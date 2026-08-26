import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import AttentionList from "@/components/shared/AttentionList";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRole } from "@/lib/RoleContext";
import { canSeeDrillDown } from "@/lib/roles";
import {
  STUDENTS, attendancePctForStudent, attendancePctForCohort,
  recordsForStudent, cohorts as allCohorts, ATTENDANCE_STATUS_META
} from "@/lib/records";
import CohortTrendChart from "@/components/attendance/CohortTrendChart";

const STATUS_TONE = { present: "good", late: "warning", absent: "bad", authorized_absence: "info" };

const pctTone = (p) => (p >= 85 ? "good" : p >= 70 ? "warning" : "bad");
const pctColor = (p) => (p >= 85 ? "text-emerald-600" : p >= 70 ? "text-amber-600" : "text-rose-600");
const pctBar = (p) => (p >= 85 ? "bg-emerald-500" : p >= 70 ? "bg-amber-500" : "bg-rose-500");
const pctLabel = (p) => (p >= 85 ? "Good" : p >= 70 ? "Watch" : "At risk");

function PctDisplay({ p, big }) {
  return (
    <div className="flex-1">
      <div className={`font-semibold ${pctColor(p)} ${big ? "text-4xl" : "text-2xl"}`}>{p}%</div>
      <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${pctBar(p)}`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

export default function Attendance() {
  const { role } = useRole();
  const drilldown = canSeeDrillDown(role);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [contacted, setContacted] = useState(() => new Set());
  const cohorts = allCohorts();

  const lowAttendance = STUDENTS
    .map((s) => ({ ...s, pct: attendancePctForStudent(s.id) }))
    .filter((x) => x.pct < 70 && x.pct > 0);

  const attentionItems = lowAttendance.map((s) => {
    const isContacted = contacted.has(s.id);
    return {
      id: s.id,
      label: s.name,
      description: `${s.cohort} · ${s.id}`,
      meta: isContacted ? "Contacted" : `${s.pct}%`,
      tone: isContacted ? "good" : pctTone(s.pct),
      actions: isContacted
        ? []
        : [{ label: "Log contact", onClick: () => setContacted((prev) => new Set(prev).add(s.id)) }],
    };
  });

  const filtered = STUDENTS.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Attendance Register"
        description="Auto-calculated attendance % per student and cohort, computed from session records."
      />

      <AttentionList
        title="Low attendance — needs follow-up"
        items={attentionItems}
        empty="All students are above the 70% threshold."
      />

      <div className="grid-auto-cards">
        {cohorts.map((c) => {
          const p = attendancePctForCohort(c);
          return (
            <Card key={c}>
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground">{c}</div>
                <div className="mt-2"><PctDisplay p={p} big /></div>
                <StatusBadge className="mt-3" tone={pctTone(p)}>{pctLabel(p)}</StatusBadge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <CohortTrendChart />

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
                      <td className="py-3 align-top pt-4"><StatusBadge tone={pctTone(p)}>{pctLabel(p)}</StatusBadge></td>
                    </tr>
                    {isOpen && drilldown && (
                      <tr className="bg-muted/40">
                        <td></td>
                        <td colSpan={3} className="py-3 pr-4">
                          <div className="rounded-lg border border-border bg-card p-3">
                            <div className="text-xs font-semibold text-muted-foreground mb-2">Session details · {recs.length} sessions</div>
                            <table className="w-full">
                              <thead>
                                <tr className="text-xs text-muted-foreground">
                                  <th className="text-left font-medium pb-1.5">Date</th>
                                  <th className="text-left font-medium pb-1.5">Status</th>
                                  <th className="text-left font-medium pb-1.5">Unit / Session</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recs.map((r, i) => (
                                  <tr key={i} className="border-t border-border">
                                    <td className="py-2 text-sm text-muted-foreground whitespace-nowrap">{r.date}</td>
                                    <td className="py-2">
                                      <StatusBadge tone={STATUS_TONE[r.status] || "neutral"}>
                                        {(ATTENDANCE_STATUS_META[r.status] || { label: r.status }).label}
                                      </StatusBadge>
                                    </td>
                                    <td className="py-2 text-sm">{r.unit} <span className="text-muted-foreground">· {r.session}</span></td>
                                  </tr>
                                ))}
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
  );
}