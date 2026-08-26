import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Link2, Phone, Mail } from "lucide-react";
import { guardiansForStudent, studentById } from "@/lib/records";

export default function FamilySection({ studentId }) {
  const guardians = guardiansForStudent(studentId);
  const siblings = guardians
    .map((g) => g.sibling_student_id)
    .filter(Boolean)
    .map((id) => studentById(id))
    .filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Family & guardians</CardTitle>
        <CardDescription>Guardian records and sibling links for this student.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          {guardians.length === 0 && <div className="text-sm text-muted-foreground">No guardian records linked.</div>}
          {guardians.map((g, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">{g.name}</div>
                <div className="text-xs text-muted-foreground">{g.relationship}</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {g.contact && g.contact.includes("@") ? <Mail className="h-3.5 w-3.5" /> : <Phone className="h-3.5 w-3.5" />}
                {g.contact}
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-2"><Link2 className="h-4 w-4" /> Sibling-linked students</div>
          {siblings.length === 0 ? (
            <div className="text-xs text-muted-foreground">No sibling links recorded.</div>
          ) : (
            <div className="space-y-2">
              {siblings.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{s.id} · {s.course}</div>
                  </div>
                  <Badge variant="outline">{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}