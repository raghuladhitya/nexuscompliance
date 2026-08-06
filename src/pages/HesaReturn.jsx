import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, AlertTriangle, XCircle, ArrowRight, GitCompare,
  ChevronRight, FileCheck2
} from "lucide-react";

const SECTIONS = [
  { name: "Student (Student entity)", status: "ready", count: "6,223 records" },
  { name: "Module (Module entity)", status: "ready", count: "4,102 records" },
  { name: "Course (Course entity)", status: "review", count: "312 flagged" },
  { name: "Instance (Course instance)", status: "ready", count: "1,890 records" },
  { name: "Qualification (Quals on entry)", status: "review", count: "88 missing" },
  { name: "EntryProfile", status: "ready", count: "6,201 records" },
  { name: "StudentCourseMembership", status: "blocking", count: "14 duplicates" },
  { name: "Engagement", status: "ready", count: "6,180 records" },
];

const VALIDATIONS = [
  { label: "Missing required fields", count: 47, sev: "blocking", detail: "MSTUFEE / YEARSTUD absent" },
  { label: "Invalid field combinations", count: 23, sev: "review", detail: "MODE + STUDYPRG mismatch" },
  { label: "Funding errors", count: 12, sev: "review", detail: "SFE funding mismatch" },
  { label: "Duplicate students", count: 14, sev: "blocking", detail: "Possible merged person codes" },
  { label: "Visa / qualification mismatches", count: 8, sev: "review", detail: "Tier 4 COMLOCK checks" },
  { label: "Provider mismatches", count: 0, sev: "ready", detail: "All aligned" },
];

const STATUS = {
  ready: { label: "Ready", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2, dot: "bg-emerald-500" },
  review: { label: "Needs review", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertTriangle, dot: "bg-amber-500" },
  blocking: { label: "Blocking issue", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle, dot: "bg-rose-500" },
};

export default function HesaReturn() {
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">HESA Return Preview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Student return · 2025/26 collection · live validation</p>
        </div>
        <Button variant="outline" onClick={() => setCompareOpen(v => !v)}>
          <GitCompare className="h-4 w-4 mr-2" /> Compare to last year's accepted return
        </Button>
      </div>

      {compareOpen && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-base">Diff vs 2024/25 accepted return</CardTitle>
            <CardDescription>Automatic comparison — review anomalies before submission.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Unexpected withdrawals", value: "17", tone: "rose" },
              { label: "Missing students", value: "9", tone: "amber" },
              { label: "Funding anomalies", value: "5", tone: "amber" },
            ].map(d => (
              <div key={d.label} className="rounded-lg border border-border p-4">
                <div className={`text-3xl font-semibold ${d.tone === 'rose' ? 'text-rose-600' : 'text-amber-600'}`}>{d.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{d.label}</div>
                <Button variant="link" className="h-auto p-0 mt-2 text-xs">Review list <ArrowRight className="h-3 w-3" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Return shape */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Return structure</CardTitle>
            <CardDescription>Mirrors the shape of the final HESA submission.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {SECTIONS.map(s => {
              const st = STATUS[s.status];
              return (
                <button key={s.name} className="flex items-center justify-between w-full rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-muted/40 transition-all text-left group">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${st.cls}`}>
                      <st.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.count}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${st.cls} hover:opacity-90`}>{st.label}</Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Validation checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Live validation</CardTitle>
            <CardDescription>Click any issue to jump to the record.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {VALIDATIONS.map(v => {
              const st = STATUS[v.sev];
              return (
                <button key={v.label} className="w-full text-left rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-muted/40 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                      <span className="text-sm font-medium">{v.label}</span>
                    </div>
                    <span className={`text-sm font-semibold ${v.count > 0 ? (v.sev === "blocking" ? "text-rose-600" : "text-amber-600") : "text-emerald-600"}`}>{v.count}</span>
                  </div>
                  {v.count > 0 && <div className="text-xs text-muted-foreground mt-1 pl-4">{v.detail} → jump to records</div>}
                </button>
              );
            })}
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Overall readiness</span><span className="font-medium">87%</span></div>
              <Progress value={87} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Ready to submit?</div>
              <div className="text-xs text-muted-foreground">2 blocking issues must be resolved before sign-off.</div>
            </div>
          </div>
          <Button>Request sign-off <ArrowRight className="h-4 w-4 ml-1" /></Button>
        </CardContent>
      </Card>
    </div>
  );
}