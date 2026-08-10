import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Mail, Wallet, Users,
  ScrollText, Calendar, AlertTriangle, Check
} from "lucide-react";

const STEPS = ["Status change", "Dates", "Impact preview", "Confirm"];

const TRIGGERS = [
  { icon: Mail, label: "Student email sent", detail: "Withdrawal confirmation (editable)", on: true },
  { icon: Wallet, label: "Finance team notified", detail: "Tuition recalculation + refund review", on: true },
  { icon: Users, label: "Academic team notified", detail: "Module access revoked in 7 days", on: true },
  { icon: ScrollText, label: "Audit log entry created", detail: "Who, what, when — immutable", on: true },
  { icon: AlertTriangle, label: "HESA flag updated", detail: "Student marked as withdrawn in return", on: true },
];

export default function WithdrawalWorkflow() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [reason, setReason] = useState("Voluntary");
  const [wDate, setWDate] = useState("");
  const [rDate, setRDate] = useState("");

  const next = () => step < STEPS.length - 1 ? setStep(step + 1) : setDone(true);
  const back = () => setStep(Math.max(0, step - 1));

  if (done) {
    return (
      <div className="max-w-xl mx-auto py-12 animate-scale-in">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold mt-5">Withdrawal completed</h2>
            <p className="text-sm text-muted-foreground mt-1">All downstream actions were triggered successfully.</p>
            <div className="mt-6 text-left space-y-2">
              {TRIGGERS.map(t => (
                <div key={t.label} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-600" /> {t.label}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6 justify-center">
              <Button variant="outline" onClick={() => { setDone(false); setStep(0); }}>Start new withdrawal</Button>
              <Button>View student record</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Withdrawal workflow</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Guided — see the full downstream chain before you commit.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border ${i <= step ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
          </React.Fragment>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{STEPS[step]}</CardTitle>
          <CardDescription>James Whitfield · STU-2021-4471 · BSc Data Science</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="space-y-3">
              <Label>Withdrawal reason</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Voluntary", "Academic", "Financial", "Medical", "Visa", "Other"].map(r => (
                  <button key={r} onClick={() => setReason(r)}
                    className={`rounded-lg border px-3 py-2 text-sm transition-all ${reason === r ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:bg-muted"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Withdrawal date <span className="text-rose-500">*</span></Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" value={wDate} onChange={e => setWDate(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Expected resumption date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" value={rDate} onChange={e => setRDate(e.target.value)} className="pl-9" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground sm:col-span-2">Resumption date is optional but enables accurate break-in-study tracking and HESA reporting.</p>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="text-sm font-medium mb-3">What happens next</div>
              <div className="space-y-2">
                {TRIGGERS.map(t => (
                  <div key={t.label} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <t.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.detail}</div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Will trigger</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="rounded-lg bg-muted/60 p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Student</span><span className="font-medium">James Whitfield</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Reason</span><span className="font-medium">{reason}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Withdrawal date</span><span className="font-medium">{wDate || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Resumption date</span><span className="font-medium">{rDate || "Not set"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Downstream actions</span><span className="font-medium">{TRIGGERS.length} triggered</span></div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={back} disabled={step === 0}><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
            <Button onClick={next}>{step === STEPS.length - 1 ? "Confirm withdrawal" : "Continue"} <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}