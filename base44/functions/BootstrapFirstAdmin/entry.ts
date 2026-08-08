import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// BootstrapFirstAdmin — one-time institution setup.
// New sign-ups get role "user" and no institution_id, and every route in the
// app requires a specific team role — so without this, the very first person
// to register has nowhere to go (RLS also blocks a plain "user" from
// creating an Institution or promoting themselves, by design). This function
// runs as service role to break that chicken-and-egg deadlock exactly once:
// if no admin exists yet anywhere in this app, it creates the Institution
// and promotes the calling user to admin. Once an admin exists, it refuses —
// all further role assignment must go through Admin & Settings > Users & roles.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const me = await base44.auth.me().catch(() => null);
    if (!me) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    const svc = base44.asServiceRole;

    // Refuse if an admin already exists anywhere — this is a one-time
    // bootstrap, not a general self-promotion endpoint.
    const existingAdmins = await svc.entities.User.filter({ role: "admin" }, "-created_date", 1);
    if (existingAdmins && existingAdmins.length > 0) {
      return Response.json({
        error: "An administrator already exists for this app. Ask them to assign your role from Admin & Settings > Users & roles."
      }, { status: 409 });
    }

    const body = await req.json().catch(() => ({}));
    const institutionName = (body.institution_name || "").trim();
    if (!institutionName) {
      return Response.json({ error: "institution_name is required" }, { status: 400 });
    }

    const institution = await svc.entities.Institution.create({ name: institutionName });

    await svc.entities.User.update(me.id, {
      role: "admin",
      institution_id: institution.id,
    });

    await svc.entities.AuditEntry.create({
      action: "update",
      entity_name: "User",
      record_id: me.id,
      field_name: "role",
      old_value: "user",
      new_value: "admin",
      changed_by_id: me.id,
      changed_by_name: me.full_name || me.email || "First user",
      source_team: "system",
      reason: `Initial workspace bootstrap — created institution "${institutionName}"`,
      institution_id: institution.id,
    }).catch(() => {});

    return Response.json({ institution_id: institution.id, role: "admin" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
