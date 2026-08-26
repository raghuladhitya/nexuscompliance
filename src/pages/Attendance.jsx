import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import {
  STUDENTS, attendancePctForStudent, attendancePctForCohort,
  recordsForStudent, cohorts as allCohorts, ATTENDANCE_STATUS_META
} from "@/lib/records";
import CohortTrendChart from "@/components/attendance/CohortTrendChart";

const AT_RISK = [
  { name: "Priya Nair", reason: "4 consecutive absences", score: 52 },
  { name: "James Whitfield", reason: "Declining trend", score: 61 },
  { name: "Aisha Khan", reason: "Engagement drop", score: 64 },
];

function pctTone(p) {
  if (p >= 85) return "text-emerald-600";
  if (p >= 70) return "text-amber-600";
  return "text-rose-600";
}
function pctBadgeTone(p) {
  if (p >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (p >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}
function pctBar(p) {
  return p >= 85 ? "bg-emerald-500" : p >= 70 ? "bg-amber-500" : "bg-rose-500";
}

function PctDisplay({ p, big }) {
  return (
    <div className="flex-1">
      <div className={`font-semibold ${pctTone(p)} ${big ? "text-4xl" : "text-2xl"}`}>{p}%</div>
      <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${pctBar(p)}`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

export default function Attendance() {
  const { role } = useRole();
  const drilldown = role === "academic";
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const cohorts = allCohorts();

  const filtered = STUDENTS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Attendance Register</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Auto-calculated attendance % per student and cohort, computed from session records.</p>
      </div>

      {/* Cohort summary — big color-coded % + progress bar */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cohorts.map((c) => {
          const p = attendancePctForCohort(c);
          return (
            <Card key={c}>
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground">{c}</div>
                <div className="mt-2"><PctDisplay p={p} big /></div>
                <Badge className={`mt-3 ${pctBadgeTone(p)}`}>{p >= 85 ? "Good" : p >= 70 ? "Watch" : "At risk"}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CohortTrendChart />

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Attendance by student</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[620px]">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-left font-medium pb-2 w-8"></th>
                    <th className="text-left font-medium pb-2">Student</th>
                    <th className="text-left font-medium pb-2 w-40">Attendance</th>
                    <th className="text-left font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const p = attendancePctForStudent(s.id);
                    const isOpen = expanded === s.id;
                    const recs = recordsForStudent(s.id);
                    return (
                      <React.Fragment key={s.id}>
                        <tr className="border-t border-border">
                          <td className="py-3 align-top pt-4">
                            {drilldown && (
                              <button onClick={() => setExpanded(isOpen ? null : s.id)} className="text-muted-foreground hover:text-foreground">
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </button>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="text-sm font-medium">{s.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                            <div className="text-xs text-muted-foreground">{s.cohort}</div>
                          </td>
                          <td className="py-3"><PctDisplay p={p} /></td>
                          <td className="py-3 align-top pt-4"><Badge className={pctBadgeTone(p)}>{p >= 85 ? "Good" : p >= 70 ? "Watch" : "At risk"}</Badge></td>
                        </tr>
                        {isOpen && drilldown && (
                          <tr className="bg-muted/40">
                            <td></td>
                            <td colSpan={3} className="py-3 pr-4">
                              <div className="rounded-lg border border-border bg-card p-3">
                                <div className="text-xs font-semibold text-muted-foreground mb-2">View session details · {recs.length} sessions</div>
                                <table className="w-full">
                                  <thead>
                                    <tr className="text-xs text-muted-foreground">
                                      <th className="text-left font-medium pb-1.5">Date</th>
                                      <th className="text-left font-medium pb-1.5">Status</th>
                                      <th className="text-left font-medium pb-1.5">Unit / Session</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {recs.map((r, i) => {
                                      const meta = ATTENDANCE_STATUS_META[r.status] || ATTENDANCE_STATUS_META.absent;
                                      return (
                                        <tr key={i} className="border-t border-border">
                                          <td className="py-2 text-sm text-muted-foreground whitespace-nowrap">{r.date}</td>
                                          <td className="py-2"><Badge className={meta.tone}>{meta.label}</Badge></td>
                                          <td className="py-2 text-sm">{r.unit} <span className="text-muted-foreground">· {r.session}</span></td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-rose-500" /> At-risk students</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {AT_RISK.map((r) => (
              <div key={r.name} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.name}</span>
                  <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50">{r.score}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{r.reason}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}