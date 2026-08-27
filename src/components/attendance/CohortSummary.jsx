import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { COURSES, cohortStats, cohortStatsByTerm } from "@/lib/attendanceModel";

const pctTone = (p) => (p == null ? "neutral" : p >= 85 ? "good" : p >= 70 ? "warning" : "bad");
const pctColor = (p) => (p == null ? "text-muted-foreground" : p >= 85 ? "text-emerald-600" : p >= 70 ? "text-amber-600" : "text-rose-600");

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default function CohortSummary() {
  return (
    <div className="grid-auto-panels">
      {COURSES.map((c) => {
        const overall = cohortStats(c.name);
        const byTerm = cohortStatsByTerm(c.name);
        return (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-base">{c.name}</CardTitle>
              <CardDescription>{c.course_code} · {c.level} · {overall.studentCount} students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Attendance</div>
                  <div className={`text-4xl font-semibold ${pctColor(overall.raw)}`}>{overall.raw}%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Adjusted (exc. auth.)</div>
                  <div className="text-lg font-semibold">{overall.adjusted == null ? "—" : `${overall.adjusted}%`}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Stat label="Scheduled" value={overall.scheduled} />
                <Stat label="Attended" value={overall.attended} />
                <Stat label="Authorized" value={overall.authorized} />
                <Stat label="Absent" value={overall.absent} />
              </div>
              <div className="border-t border-border pt-3">
                <div className="text-xs text-muted-foreground mb-2">By term</div>
                <div className="space-y-2">
                  {byTerm.map(({ term, raw, adjusted, scheduled, attended, authorized }) => (
                    <div key={term.id} className="flex items-center justify-between gap-2">
                      <span className="text-sm shrink-0">{term.name}</span>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs text-muted-foreground truncate">
                          {attended}/{scheduled}{authorized ? ` · ${authorized} auth.` : ""}
                        </span>
                        <StatusBadge tone={pctTone(raw)}>{raw}%</StatusBadge>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {adjusted == null ? "—" : `${adjusted}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}