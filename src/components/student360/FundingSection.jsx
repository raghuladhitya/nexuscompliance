import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, CheckCircle2, XCircle } from "lucide-react";
import { fundingForStudent } from "@/lib/records";

export default function FundingSection({ studentId }) {
  const f = fundingForStudent(studentId);
  if (!f) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base">Funding status</CardTitle></CardHeader>
        <CardContent><div className="text-sm text-muted-foreground">No funding record on file.</div></CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Landmark className="h-4 w-4" /> Funding status</CardTitle>
        <CardDescription>Funding source, STP status and learner approval.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Row label="Funding source" value={f.funding_source} />
        <Row label="STP status" value={<Badge variant="outline">{f.stp_status}</Badge>} />
        <Row label="Learner approved" value={
          f.learner_approved
            ? <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>
            : <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50"><XCircle className="h-3 w-3 mr-1" /> Not approved</Badge>
        } />
      </CardContent>
    </Card>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}