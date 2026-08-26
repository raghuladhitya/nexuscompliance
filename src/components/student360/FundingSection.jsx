import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { fundingForStudent, STP_STATUS_META, formatDateString } from "@/lib/records";

export default function FundingSection({ studentId }) {
  const f = fundingForStudent(studentId);
  if (!f) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Landmark className="h-4 w-4" /> Funding status</CardTitle></CardHeader>
        <CardContent><div className="text-sm text-muted-foreground">No funding record on file.</div></CardContent>
      </Card>
    );
  }
  const stp = STP_STATUS_META[f.stp_status] || STP_STATUS_META["n/a"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Landmark className="h-4 w-4" /> Funding status</CardTitle>
        <CardDescription>Funding source, STP status and learner approval.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Funding source</span>
            <span className="text-sm font-medium">{f.funding_source}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">STP status</span>
            <Badge className={stp.tone}>{stp.label}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Learner approved</span>
            {f.learner_approved ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Approved
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-700">
                <XCircle className="h-4 w-4" /> Not approved
              </span>
            )}
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-border">
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Last checked
            </span>
            <span className="text-xs text-muted-foreground">{formatDateString(f.date_checked)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}