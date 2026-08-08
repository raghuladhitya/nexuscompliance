import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { logAudit } from "@/lib/auditLog";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, ChevronRight, ChevronLeft, Mail, Wallet, Users,
  ScrollText, Calendar, AlertTriangle, Check, Search
} from "lucide-react";

const STEPS = ["Student", "Status change", "Dates", "Impact preview", "Confirm"];

const TRIGGERS = [
  { icon: ScrollText, label: "Leaver record created", detail: "Registers the leave with the HESA readiness engine", on: true },
  { icon: AlertTriangle, label: "HESA status recalculated", detail: "Status flips to Outcome Pending until an outcome is linked", on: true },
  { icon: ScrollText, label: "Audit log entry created", detail: "Who, what, when, which team — immutable", on: true },
  { icon: Mail, label: "Student email sent", detail: "Withdrawal confirmation (editable) — not yet automated", on: false },
  { icon: Wallet, label: "Finance team notified", detail: "Tuition recalculation + refund review — not yet automated", on: false },
];

const REASONS = ["Voluntary", "Academic", "Financial", "Medical", "Visa", "Other"];

export default function WithdrawalWorkflow() {
  const { user } = useAuth();
  const institutionId = user?.institution_id || user?.data?.institution_id || "";

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [student, setStudent] = useState(null);

  const [reason, setReason] = useState("Voluntary");
  const [wDate, setWDate] = useState("");
  const [rDate, setRDate] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Student.list("-created_date", 200);
        setStudents(data || []);
      } catch (e) {
        setStudents([]);
      }
    })();
  }, []);

  const filtered = students.filter(s =>
    `${s.first_name || ""} ${s.last_name || ""} ${s.person_code || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  const next = () => step < STEPS.length - 1 ? setStep(step + 1) : confirm();
  const back = () => setStep(Math.max(0, step - 1));

  const confirm = async () => {
    if (!student) { setError("Select a student first."); setStep(0); return; }
    if (!wDate) { setError("Withdrawal date is required."); setStep(2); return; }
    setSubmitting(true); setError("");
    try {
      // Find the student's most recent Engagement — the real HESA anchor that
      // SessionStatus/Leaver/QualificationAwarded hang off. If this student
      // doesn't have one yet (e.g. Admissions created the Student but nothing
      // has created an Engagement for them), bootstrap a minimal one so the
      // withdrawal can actually register with the readiness engine.
      let engagements = await base44.entities.Engagement.filter({ student_id: student.id }, "-start_date", 1);
      let engagement = engagements && engagements[0];
      if (!engagement) {
        engagement = await base44.entities.Engagement.create({
          student_id: student.id,
          course_id: student.course_id || student.course_applied || "unknown",
          start_date: student.created_date ? student.created_date.slice(0, 10) : wDate,
          institution_id: institutionId,
          source: "system",
        });
        await logAudit(user, {
          action: "create",
          entity_name: "Engagement",
          record_id: engagement.id,
          source_team: "registry",
          reason: "Bootstrapped when no engagement existed yet, ahead of recording a withdrawal",
        });
      }

      const leaver = await base44.entities.Leaver.create({
        engagement_id: engagement.id,
        student_id: student.id,
        end_date: wDate,
        reason_for_ending: reason,
        intended_destination: rDate ? `Expected resumption ${rDate}` : undefined,
        institution_id: institutionId,
        source: "system",
      });

      await logAudit(user, {
        action: "create",
        entity_name: "Leaver",
        record_id: leaver.id,
        field_name: "reason_for_ending",
        new_value: reason,
        source_team: "registry",
        reason: `Withdrawal recorded for ${student.first_name} ${student.last_name} (${student.person_code})`,
      });

      // Ask the readiness engine to recompute this engagement's status now,
      // rather than waiting for the entity-trigger workflow to fire.
      try {
        await base44.functions.invoke("ComputeStudentStatus", { engagement_id: engagement.id });
      } catch (e) {
        // Non-fatal — the "HESA Recalc on Leaver" workflow will also catch this.
      }

      setDone(true);
    } catch (e) {
      setError(e?.message || "Couldn't record the withdrawal.");
    }
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto py-12 animate-scale-in">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold mt-5">Withdrawal recorded</h2>
            <p className="text-sm text-muted-foreground mt-1">{student?.first_name} {student?.last_name}'s status will show as "Outcome Pending" until Registry links a qualification outcome.</p>
            <div className="mt-6 text-left space-y-2">
              {TRIGGERS.filter(t => t.on).map(t => (
                <div key={t.label} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-emerald-600" /> {t.label}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6 justify-center">
              <Button variant="outline" onClick={() => { setDone(false); setStep(0); setStudent(null); setWDate(""); setRDate(""); setReason("Voluntary"); }}>Start new withdrawal</Button>
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
        <p className="text-sm text-muted-foreground mt-0.5">Guided — creates a real Leaver record and triggers the HESA readiness engine.</p>
      </div>

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
          <CardDescription>
            {student ? `${student.first_name} ${student.last_name} · ${student.person_code}` : "Select the student to withdraw"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name or person code…" value={query} onChange={e => setQuery(e.target.value)} className="pl-9" />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-1.5">
                {filtered.length === 0 && <div className="text-sm text-muted-foreground py-4 text-center">No students found.</div>}
                {filtered.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setStudent(s)}
                    className={`w-full text-left rounded-lg border px-3 py-2 text-sm transition-all ${student?.id === s.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
                  >
                    <div className="font-medium">{s.first_name} {s.last_name}</div>
                    <div className="text-xs text-muted-foreground">{s.person_code} · {s.course_applied || "—"}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-3">
              <Label>Withdrawal reason</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {REASONS.map(r => (
                  <button key={r} onClick={() => setReason(r)}
                    className={`rounded-lg border px-3 py-2 text-sm transition-all ${reason === r ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:bg-muted"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
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
          {step === 3 && (
            <div>
              <div className="text-sm font-medium mb-3">What happens on confirm</div>
              <div className="space-y-2">
                {TRIGGERS.map(t => (
                  <div key={t.label} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${t.on ? "bg-primary/10" : "bg-muted"}`}>
                      <t.icon className={`h-4 w-4 ${t.on ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.detail}</div>
                    </div>
                    <Badge className={t.on ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-50"}>
                      {t.on ? "Will trigger" : "Not automated"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="rounded-lg bg-muted/60 p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Student</span><span className="font-medium">{student?.first_name} {student?.last_name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Reason</span><span className="font-medium">{reason}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Withdrawal date</span><span className="font-medium">{wDate || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Resumption date</span><span className="font-medium">{rDate || "Not set"}</span></div>
            </div>
          )}

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={back} disabled={step === 0}><ChevronLeft className="h-4 w-4 mr-1" /> Back</Button>
            <Button onClick={next} disabled={submitting || (step === 0 && !student)}>
              {submitting ? "Recording…" : step === STEPS.length - 1 ? "Confirm withdrawal" : "Continue"} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
