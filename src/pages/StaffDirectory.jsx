import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { UserCog, Plus, Pencil, Search } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { canEditStaff } from "@/lib/roles";
import { STAFF, cohorts as allCohorts } from "@/lib/records";
import StaffForm from "@/components/staff/StaffForm";

export default function StaffDirectory() {
  const { role } = useRole();
  const canEdit = canEditStaff(role);
  const [staff, setStaff] = useState(STAFF);
  const [query, setQuery] = useState("");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const cohorts = allCohorts();

  const filtered = staff.filter((s) => {
    const matchQuery = s.name.toLowerCase().includes(query.toLowerCase()) || s.role.toLowerCase().includes(query.toLowerCase());
    const matchCohort = cohortFilter === "all" || s.cohorts.includes(cohortFilter);
    return matchQuery && matchCohort;
  });

  const teachersForCohort = cohortFilter === "all" ? [] : staff.filter((s) => s.cohorts.includes(cohortFilter));

  const openNew = () => { setEditing(null); setOpen(true); };
  const openEdit = (s) => { setEditing(s); setOpen(true); };

  const handleSave = (data) => {
    if (editing) {
      setStaff((prev) => prev.map((s) => (s.id === data.id ? data : s)));
    } else {
      setStaff((prev) => [...prev, data]);
    }
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Staff records, cohort assignments and "who teaches this unit" lookup.</p>
        </div>
        {canEdit && <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Add staff</Button>}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">All staff</CardTitle>
            <div className="flex items-center gap-2">
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
                  <th className="text-left font-medium pb-2">Cohorts</th>
                  <th className="text-left font-medium pb-2">Status</th>
                  {canEdit && <th className="pb-2"></th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="py-3">
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                    </td>
                    <td className="py-3 text-sm">{s.role}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.cohorts.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                        {s.cohorts.map((c) => <Badge key={c} variant="outline" className="font-normal">{c}</Badge>)}
                      </div>
                    </td>
                    <td className="py-3">
                      {s.active
                        ? <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Active</Badge>
                        : <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>}
                    </td>
                    {canEdit && (
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><UserCog className="h-4 w-4" /> Who teaches this unit</CardTitle>
            <CardDescription>Pick a cohort to see assigned teaching staff.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm">
              <option value="all">Select a cohort…</option>
              {cohorts.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {cohortFilter === "all" ? (
              <div className="text-sm text-muted-foreground">Choose a cohort to look up teaching staff.</div>
            ) : teachersForCohort.length === 0 ? (
              <div className="text-sm text-muted-foreground">No staff assigned to this cohort yet.</div>
            ) : (
              <div className="space-y-2">
                {teachersForCohort.map((s) => (
                  <div key={s.id} className="rounded-lg border border-border p-3">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.role}</div>
                    {s.units.length > 0 && <div className="text-xs text-muted-foreground mt-1">Units: {s.units.join(", ")}</div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit staff" : "Add staff"}</DialogTitle>
            <DialogDescription>{editing ? "Update staff details and cohort assignments." : "Create a new staff record and assign cohorts."}</DialogDescription>
          </DialogHeader>
          <StaffForm initial={editing} onSave={handleSave} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}