import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, ChevronDown, ChevronRight, Check, X } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { canSeeDrillDown } from "@/lib/roles";
import {
  STUDENTS, attendancePctForStudent, attendancePctForCohort,
  recordsForStudent, cohorts as allCohorts
} from "@/lib/records";
import CohortTrendChart from "@/components/attendance/CohortTrendChart";

const AT_RISK = [
  { name: "Priya Nair", reason: "4 consecutive absences", score: 52 },
  { name: "James Whitfield", reason: "Declining trend", score: 61 },
  { name: "Aisha Khan", reason: "Engagement drop", score: 64 },
];

function pctTone(p) {
  if (p >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (p >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function pctBar(p) {
  return p >= 85 ? "bg-emerald-500" : p >= 70 ? "bg-amber-500" : "bg-rose-500";
}

export default function Attendance() {
  const { role } = useRole();
  const drilldown = canSeeDrillDown(role);
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

      {/* Cohort summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cohorts.map((c) => {
          const p = attendancePctForCohort(c);
          return (
            <Card key={c}>
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground">{c}</div>
                <div className="text-2xl font-semibold mt-1">{p}%</div>
                <Badge className={`mt-2 ${pctTone(p)}`}>{p >= 85 ? "Good" : p >= 70 ? "Watch" : "At risk"}</Badge>
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
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-left font-medium pb-2 w-8"></th>
                    <th className="text-left font-medium pb-2">Student</th>
                    <th className="text-left font-medium pb-2">Cohort</th>
                    <th className="text-left font-medium pb-2">Attendance</th>
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
                          <td className="py-3">
                            {drilldown && (
                              <button onClick={() => setExpanded(isOpen ? null : s.id)} className="text-muted-foreground hover:text-foreground">
                                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </button>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="text-sm font-medium">{s.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                          </td>
                          <td className="py-3 text-sm">{s.cohort}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                                <div className={`h-full ${pctBar(p)}`} style={{ width: `${p}%` }} />
                              </div>
                              <span className="text-sm font-medium">{p}%</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge className={pctTone(p)}>{p >= 85 ? "Good" : p >= 70 ? "Watch" : "At risk"}</Badge>
                          </td>
                        </tr>
                        {isOpen && drilldown && (
                          <tr className="bg-muted/40">
                            <td></td>
                            <td colSpan={4} className="py-3 pr-4">
                              <div className="rounded-lg border border-border bg-card p-3">
                                <div className="text-xs font-semibold text-muted-foreground mb-2">Session-level records ({recs.length})</div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
                                  {recs.map((r, i) => (
                                    <div key={i} className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs">
                                      {r.attended ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <X className="h-3.5 w-3.5 text-rose-600" />}
                                      <span className="text-muted-foreground">{r.date}</span>
                                    </div>
                                  ))}
                                </div>
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