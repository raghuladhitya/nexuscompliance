import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, CheckCircle2, XCircle, Flag } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import AttentionList from "@/components/shared/AttentionList";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRole } from "@/lib/RoleContext";
import { canSeeNotApproved } from "@/lib/roles";
import {
  FUNDING_STATUSES, STUDENTS, cohorts as allCohorts, notApprovedLearners,
  STP_STATUS_META, formatDateString
} from "@/lib/records";

const STP_TONE = { confirmed: "good", pending: "warning", rejected: "bad", "n/a": "neutral" };

export default function FundingStatus() {
  const { role } = useRole();
  const canApprove = canSeeNotApproved(role);
  const [query, setQuery] = useState("");
  const [cohortFilter, setCohortFilter] = useState("all");
  const [notApprovedOnly, setNotApprovedOnly] = useState(true);
  const [approved, setApproved] = useState(() => new Set());
  const [flagged, setFlagged] = useState(() => new Set());
  const cohorts = allCohorts();

  const baseUnapproved = notApprovedLearners().filter((l) => !approved.has(l.student_id));

  const attentionItems = baseUnapproved.map((l) => {
    const isFlagged = flagged.has(l.student_id);
    const stp = STP_STATUS_META[l.stp_status] || STP_STATUS_META["n/a"];
    const toggleFlag = () =>
      setFlagged((prev) => {
        const n = new Set(prev);
        if (n.has(l.student_id)) n.delete(l.student_id);
        else n.add(l.student_id);
        return n;
      });
    return {
      id: l.student_id,
      label: l.name,
      description: `${l.cohort || "—"} · ${stp.label}${isFlagged ? " · Flagged" : ""}`,
      meta: isFlagged ? "Flagged" : stp.label,
      tone: isFlagged ? "bad" : STP_TONE[l.stp_status] || "neutral",
      actions: canApprove
        ? [
            { label: "Approve", variant: "default", onClick: () => setApproved((prev) => new Set(prev).add(l.student_id)) },
            { label: isFlagged ? "Unflag" : "Flag", variant: "outline", onClick: toggleFlag },
          ]
        : [],
    };
  });

  const allRows = FUNDING_STATUSES
    .map((f) => ({ ...STUDENTS.find((s) => s.id === f.student_id), ...f }))
    .filter((x) => x.id)
    .map((r) => ({ ...r, learner_approved: approved.has(r.student_id) ? true : r.learner_approved }));

  const rows = (notApprovedOnly ? allRows.filter((r) => !r.learner_approved) : allRows)
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .filter((r) => cohortFilter === "all" || r.cohort === cohortFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Funding Status"
        description="Funding source, STP status and learner approval across the institution."
      />

      <AttentionList
        title="Unapproved learners — needs action"
        items={attentionItems}
        empty="All learners are approved."
        icon={Flag}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-base">Funding records</CardTitle>
            <CardDescription>Toggle the filter to focus on unapproved learners.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setNotApprovedOnly((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                notApprovedOnly
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              Not approved learners
              {notApprovedOnly && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-rose-500" />}
            </button>
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
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-left font-medium pb-2">Student</th>
                <th className="text-left font-medium pb-2">Funding source</th>
                <th className="text-left font-medium pb-2">STP status</th>
                <th className="text-left font-medium pb-2">Approved</th>
                <th className="text-left font-medium pb-2">Date checked</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-sm text-muted-foreground text-center">No records match.</td></tr>
              )}
              {rows.map((r) => {
                const stp = STP_STATUS_META[r.stp_status] || STP_STATUS_META["n/a"];
                return (
                  <tr key={r.student_id} className="border-t border-border">
                    <td className="py-3">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{r.student_id}</div>
                    </td>
                    <td className="py-3 text-sm">{r.funding_source}</td>
                    <td className="py-3"><StatusBadge tone={STP_TONE[r.stp_status] || "neutral"}>{stp.label}</StatusBadge></td>
                    <td className="py-3">
                      {r.learner_approved
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        : <XCircle className="h-4 w-4 text-rose-600" />}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" /> {formatDateString(r.date_checked)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}