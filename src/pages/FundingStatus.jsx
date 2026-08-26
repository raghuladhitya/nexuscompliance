import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { FUNDING_STATUSES, STUDENTS, cohorts as allCohorts, notApprovedLearners } from "@/lib/records";

export default function FundingStatus() {
  const [query, setQuery] = useState("");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [view, setView] = useState("not-approved");
  const cohorts = allCohorts();

  const base = view === "not-approved"
    ? notApprovedLearners()
    : FUNDING_STATUSES.map((f) => ({ ...STUDENTS.find((s) => s.id === f.student_id), ...f })).filter((x) => x.id);

  const rows = base
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .filter((r) => cohortFilter === "all" || r.cohort === cohortFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Funding Status</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Funding source, STP status and learner approval across the institution.</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-rose-500" /> Not approved learners</CardTitle>
            <CardDescription>Students whose learner approval is outstanding.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select value={view} onChange={(e) => setView(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-2 text-sm">
              <option value="not-approved">Not approved only</option>
              <option value="all">All funding records</option>
            </select>
            <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className="h-9 rounded-md border border-input bg-transparent px-2 text-sm">
              <option value="all">All cohorts</option>
              {cohorts.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search students" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-left font-medium pb-2">Student</th>
                <th className="text-left font-medium pb-2">Cohort</th>
                <th className="text-left font-medium pb-2">Funding source</th>
                <th className="text-left font-medium pb-2">STP status</th>
                <th className="text-left font-medium pb-2">Learner approved</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-sm text-muted-foreground text-center">No records match.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.student_id} className="border-t border-border">
                  <td className="py-3">
                    <div className="text-sm font-medium">{r.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{r.student_id}</div>
                  </td>
                  <td className="py-3 text-sm">{r.cohort}</td>
                  <td className="py-3 text-sm">{r.funding_source}</td>
                  <td className="py-3"><Badge variant="outline">{r.stp_status}</Badge></td>
                  <td className="py-3">
                    {r.learner_approved
                      ? <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>
                      : <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50"><XCircle className="h-3 w-3 mr-1" /> Not approved</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}