import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCog, Mail, History } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { TUTOR_ASSIGNMENTS, staffById } from "@/lib/tutorModel";
import { STAFF, formatDateString } from "@/lib/records";

// Admin, Registry and admin-equivalent roles can assign a new tutor.
const canAssign = (r) => ["admin", "registry_manager", "ceo", "quality_manager"].includes(r);

function initials(name) {
  return name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function PersonalTutorCard({ studentId }) {
  const { role } = useRole();
  const editable = canAssign(role);
  const [assignments, setAssignments] = useState(() => TUTOR_ASSIGNMENTS.map((a) => ({ ...a })));
  const [newTutor, setNewTutor] = useState("");

  const current = assignments.find((a) => a.student_id === studentId && !a.end_date);
  const currentStaff = current ? staffById(current.staff_id) : null;
  const history = assignments
    .filter((a) => a.student_id === studentId)
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  const eligibleTutors = STAFF.filter((s) => s.active && (!current || s.id !== current.staff_id));

  const assign = () => {
    if (!newTutor) return;
    const today = new Date().toISOString().slice(0, 10);
    setAssignments((prev) => {
      const updated = prev.map((a) => (a.student_id === studentId && !a.end_date ? { ...a, end_date: today } : a));
      return [...updated, { id: `ta_${Date.now()}`, student_id: studentId, staff_id: newTutor, start_date: today, end_date: null }];
    });
    setNewTutor("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><UserCog className="h-4 w-4 text-primary" /> Personal tutor</CardTitle>
        <CardDescription>Current academic advisor and assignment history.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentStaff ? (
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <span className="h-10 w-10 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">{initials(currentStaff.name)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{currentStaff.name}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" /> {currentStaff.id.toLowerCase()}@northbrook.ac.uk</div>
              <div className="text-xs text-muted-foreground">Since {formatDateString(current.start_date)}</div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Current</Badge>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground rounded-lg border border-dashed border-border p-3 text-center">No tutor currently assigned.</div>
        )}

        {editable && (
          <div className="flex gap-2">
            <select value={newTutor} onChange={(e) => setNewTutor(e.target.value)} className="h-9 flex-1 rounded-md border border-input bg-transparent px-2 text-sm">
              <option value="">Assign new tutor…</option>
              {eligibleTutors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <Button onClick={assign} disabled={!newTutor}>Assign</Button>
          </div>
        )}

        {history.length > 1 && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5"><History className="h-3.5 w-3.5" /> Assignment history</div>
            <div className="space-y-1.5">
              {history.map((a) => {
                const s = staffById(a.staff_id);
                return (
                  <div key={a.id} className="flex items-center justify-between text-sm rounded-lg border border-border p-2.5">
                    <span>{s ? s.name : a.staff_id}</span>
                    <span className="text-xs text-muted-foreground">{formatDateString(a.start_date)} → {a.end_date ? formatDateString(a.end_date) : "present"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}