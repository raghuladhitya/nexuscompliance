// Shared provenance/audit logging helper.
// Every write to a compliance-relevant field should call logAudit() so it
// shows up in the immutable Audit Log (AuditEntry) with WHO changed it,
// WHICH team they belong to, and the before/after values. AuditEntry is
// create-only (RLS blocks update/delete) so this is a genuine append-only
// provenance trail, not a soft log.
import { base44 } from "@/api/base44Client";

// user: the current auth user (from useAuth()), used to stamp who + team.
// entry: { action, entity_name, record_id, field_name, old_value, new_value, reason, source_team }
// source_team defaults to the user's own role when not explicitly passed.
export async function logAudit(user, entry) {
  try {
    await base44.entities.AuditEntry.create({
      action: entry.action,
      entity_name: entry.entity_name,
      record_id: String(entry.record_id ?? ""),
      field_name: entry.field_name || undefined,
      old_value: entry.old_value != null ? String(entry.old_value) : undefined,
      new_value: entry.new_value != null ? String(entry.new_value) : undefined,
      changed_by_id: user?.id || "unknown",
      changed_by_name: user?.full_name || user?.email || "Unknown user",
      source_team: entry.source_team || user?.role || "system",
      reason: entry.reason || undefined,
      institution_id: user?.institution_id || user?.data?.institution_id || "",
    });
  } catch (e) {
    // Audit logging is best-effort and must never block the primary action.
    console.error("Audit log write failed:", e);
  }
}
