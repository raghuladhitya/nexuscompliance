import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrendingDown, Wallet, FileWarning, CheckCircle2 } from "lucide-react";
import {
  attendancePctForStudent, recordsForStudent, fundingForStudent, STP_STATUS_META, formatDateString
} from "@/lib/records";

const STATUS_LABEL = {
  Active: "Active",
  "At risk": "Flagged at risk",
  Withdrawn: "Withdrawal (COC) on file",
  pending_induction: "Registration incomplete",
};

function statusTone(status) {
  if (status === "Active" || !status) return "good";
  if (status === "Withdrawn") return "bad";
  return "warning";
}

export default function PendingItemsProfile({ student }) {
  const pct = attendancePctForStudent(student.id);
  const absences = recordsForStudent(student.id).filter((r) => r.status === "absent").length;
  const funding = fundingForStudent(student.id);

  const items = [];
  if (pct < 70 && pct > 0) {
    items.push({
      icon: TrendingDown,
      label: "Outstanding attendance issues",
      detail: `${pct}% attendance · ${absences} unauthorised absence${absences === 1 ? "" : "s"}`,
      tone: pct < 60 ? "bad" : "warning",
    });
  }
  if (funding && !funding.learner_approved) {
    const stp = STP_STATUS_META[funding.stp_status] || STP_STATUS_META["n/a"];
    items.push({
      icon: Wallet,
      label: "Unapproved funding status",
      detail: `${funding.funding_source} · ${stp.label} · checked ${formatDateString(funding.date_checked)}`,
      tone: funding.stp_status === "rejected" ? "bad" : "warning",
    });
  }
  if (student.status && student.status !== "Active") {
    items.push({
      icon: FileWarning,
      label: "Open registration / COC item",
      detail: STATUS_LABEL[student.status] || student.status,
      tone: student.status === "Withdrawn" ? "bad" : "warning",
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <div className="text-sm text-muted-foreground mt-0.5 font-mono">{student.id}</div>
              <div className="text-sm text-muted-foreground">{student.cohort}</div>
            </div>
            <StatusBadge tone={statusTone(student.status)}>
              {STATUS_LABEL[student.status] || student.status || "Active"}
            </StatusBadge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending items</CardTitle>
          <CardDescription>Consolidated outstanding actions for this student.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No pending items — student is fully compliant.
            </div>
          ) : (
            items.map((it, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <it.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{it.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{it.detail}</div>
                </div>
                <StatusBadge tone={it.tone} className="shrink-0">Open</StatusBadge>
              </div>
            ))
          )}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Total pending</span>
            <span className="text-sm font-semibold">{items.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}