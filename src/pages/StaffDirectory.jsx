import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { UserCog, Plus, Search, Mail, Power } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import AttentionList from "@/components/shared/AttentionList";
import { useRole } from "@/lib/RoleContext";
import { canEditStaff } from "@/lib/roles";
import { STAFF, cohorts as allCohorts } from "@/lib/records";

function initials(name) {
  return name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function StatusDot({ active }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function staffRoleBadgeTone(role) {
  const r = role.toLowerCase();
  if (r.includes("lecturer") || r.includes("professor")) return "info";
  if (r.includes("registrar")) return "violet";
  if (r.includes("finance")) return "good";
  return "neutral";
}

export default function StaffDirectory() {
  const { role } = useRole();
  const canEdit = canEditStaff(role);
  const [staff, setStaff] = useState(STAFF);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);

  const cohorts = allCohorts();
  const roleOptions = [...new Set(STAFF.map((s) => s.role))];

  const toggleActive = (id) => setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  const openRow = (s) => {
    setSelected(s);
    setDraft(canEdit ? { ...s } : null);
  };
  const handleSave = () => {
    setStaff((prev) => prev.map((s) => (s.id === draft.id ? draft : s)));
    setSelected(draft);
    setDraft(null);
  };

  const unassigned = staff.filter((s) => s.cohorts.length === 0);
  const inactive = staff.filter((s) => !s.active);
  const attentionItems = [
    ...unassigned.map((s) => ({
      id: s.id + "-unassigned",
      label: s.name,
      description: `No cohort assignment · ${s.role}`,
      meta: "Unassigned",
      tone: "warning",
      actions: canEdit ? [{ label: "Assign", onClick: () => openRow(s) }] : [],
    })),
    ...inactive.map((s) => ({
      id: s.id + "-inactive",
      label: s.name,
      description: `Inactive · ${s.role}`,
      meta: "Inactive",
      tone: "neutral",
      actions: canEdit ? [{ label: "Activate", variant: "default", onClick: () => toggleActive(s.id) }] : [],
    })),
  ];

  const filtered = staff.filter((s) => {
    const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
    const matchRole = roleFilter === "all" || s.role === roleFilter;
    const matchCohort = cohortFilter === "all" || s.cohorts.includes(cohortFilter);
    return matchQuery && matchRole && matchCohort;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Staff Directory"
        description="Staff records, cohort assignments and teaching lookup."
        actions={canEdit && <Button><Plus className="h-4 w-4 mr-1" /> Add staff</Button>}
      />

      <AttentionList
        title="Staff needing attention"
        items={attentionItems}
        empty="All staff are assigned and active."
        icon={UserCog}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-base flex items-center gap-2"><UserCog className="h-4 w-4" /> All staff</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-2 text-sm">
              <option value="all">All roles</option>
              {roleOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-2 text-sm">
              <option value="all">All cohorts</option>
              {cohorts.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search staff" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-left font-medium pb-2">Name</th>
                <th className="text-left font-medium pb-2">Role</th>
                <th className="text-left font-medium pb-2">Assigned cohorts</th>
                <th className="text-left font-medium pb-2">Status</th>
                {canEdit && <th className="text-left font-medium pb-2 w-20">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={canEdit ? 5 : 4} className="py-6 text-sm text-muted-foreground text-center">No staff match your filters.</td></tr>
              )}
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => openRow(s)}
                  className="border-t border-border cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-8 w-8 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center">{initials(s.name)}</span>
                      <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3"><StatusBadge tone={staffRoleBadgeTone(s.role)}>{s.role}</StatusBadge></td>
                  <td className="py-3">
                    {s.cohorts.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {s.cohorts.map((c) => <Badge key={c} variant="outline" className="font-normal">{c}</Badge>)}
                      </div>
                    )}
                  </td>
                  <td className="py-3"><StatusDot active={s.active} /></td>
                  {canEdit && (
                    <td className="py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); toggleActive(s.id); }}
                        className="h-8 w-8 p-0"
                        title={s.active ? "Deactivate" : "Activate"}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="sm:max-w-lg w-full overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{initials(selected.name)}</span>
                  {selected.name}
                </SheetTitle>
                <SheetDescription>{selected.id} · {selected.role}</SheetDescription>
              </SheetHeader>

              {canEdit && draft ? (
                <div className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="d-name">Name</Label>
                    <Input id="d-name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="d-role">Role</Label>
                    <Input id="d-role" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="d-cohorts">Assigned cohorts (comma-separated)</Label>
                    <Input id="d-cohorts" value={(draft.cohorts || []).join(", ")} onChange={(e) => setDraft({ ...draft, cohorts: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-3">
                    <Label htmlFor="d-active">Active</Label>
                    <Switch id="d-active" checked={draft.active} onCheckedChange={(v) => setDraft({ ...draft, active: v })} />
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  <ReadRow label="Role" value={<StatusBadge tone={staffRoleBadgeTone(selected.role)}>{selected.role}</StatusBadge>} />
                  <ReadRow label="Status" value={<StatusDot active={selected.active} />} />
                  <div className="rounded-lg border border-border p-3">
                    <div className="text-xs text-muted-foreground mb-2">Assigned cohorts</div>
                    {selected.cohorts.length === 0 ? (
                      <div className="text-sm text-muted-foreground">No cohort assignments.</div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {selected.cohorts.map((c) => <Badge key={c} variant="outline" className="font-normal">{c}</Badge>)}
                      </div>
                    )}
                  </div>
                  {selected.units.length > 0 && (
                    <div className="rounded-lg border border-border p-3">
                      <div className="text-xs text-muted-foreground mb-2">Units taught</div>
                      <div className="text-sm">{selected.units.join(", ")}</div>
                    </div>
                  )}
                  <div className="rounded-lg border border-border p-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" /> {selected.id.toLowerCase()}@northbrook.ac.uk
                  </div>
                </div>
              )}

              {canEdit && draft && (
                <SheetFooter className="mt-6">
                  <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
                  <Button onClick={handleSave}>Save changes</Button>
                </SheetFooter>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ReadRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}