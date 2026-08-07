import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle, GitMerge, X, Mail, TrendingUp, TrendingDown,
  CheckCircle2, Clock, PoundSterling, Calendar, Send, FileText, FileSignature
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import RegistrationCard from "@/components/student/RegistrationCard";
import AttendanceWeekly from "@/components/student/AttendanceWeekly";
import ChangeOfCircumstances from "@/components/student/ChangeOfCircumstances";
import StudentStatusBadge from "@/components/student/StudentStatusBadge";

const TIMELINE = [
  { date: "Sep 2021", label: "Enrolled", detail: "BSc Computer Science · Provider: Northbrook", tone: "sky" },
  { date: "Jun 2022", label: "Break in study", detail: "Personal — resumed Sep 2022", tone: "amber" },
  { date: "Sep 2022", label: "Resumed", detail: "Same programme, Year 2", tone: "emerald" },
  { date: "Jan 2024", label: "Transfer", detail: "To BSc Data Science (internal)", tone: "violet" },
  { date: "Mar 2025", label: "Withdrawal", detail: "Voluntary — resumption possible", tone: "rose" },
];

const ATTENDANCE = [82, 78, 74, 68, 61];
const MODULES = [
  { name: "Data Structures", grade: "68", att: "91%" },
  { name: "Algorithms", grade: "72", att: "88%" },
  { name: "Databases", grade: "65", att: "79%" },
  { name: "Machine Learning", grade: "—", att: "61%" },
];

const TONE_CLASSES = {
  sky: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  violet: "bg-violet-100 text-violet-700",
  rose: "bg-rose-100 text-rose-700",
};

export default function Student360() {
  const [showMerge, setShowMerge] = useState(true);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Student.list("-created_date", 1);
        if (data && data[0]) setStudent(data[0]);
      } catch (e) {
        // no real student — keep mock header
      }
    })();
  }, []);

  const displayName = student ? `${student.first_name} ${student.last_name}` : "James Whitfield";
  const displayCode = student ? student.person_code : "STU-2021-4471";
  const displayEmail = student ? (student.contact_email || "—") : "j.whitfield@northbrook.ac.uk";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-lg font-semibold">JW</div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{displayName}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>ID: {displayCode}</span><span>·</span>
              <span>{displayEmail}</span><span>·</span>
              {student
                ? <StudentStatusBadge studentId={student.id} fallback="Withdrawn" />
                : <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50">Withdrawn</Badge>}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Mail className="h-4 w-4 mr-2" /> Message</Button>
          <Button>View audit trail</Button>
        </div>
      </div>

      <RegistrationCard />

      {/* Duplicate merge prompt */}
      {showMerge && (
        <Card className="border-amber-300 bg-amber-50/50 animate-slide-up">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-base text-amber-900">Possible duplicate — merge?</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowMerge(false)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-900/80 mb-4">Two records may refer to the same person. Review side-by-side before merging.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { id: "STU-2021-4471", name: "James Whitfield", email: "j.whitfield@northbrook.ac.uk", dob: "12/03/2003", course: "BSc Data Science" },
                { id: "STU-2023-9920", name: "J. Whitfield", email: "jamesw@northbrook.ac.uk", dob: "12/03/2003", course: "CertHE Computing" },
              ].map((r, i) => (
                <div key={r.id} className="rounded-lg border border-amber-200 bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono">{r.id}</Badge>
                    {i === 1 && <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">Potential match</Badge>}
                  </div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>{r.email}</div><div>DOB: {r.dob}</div><div>{r.course}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button><GitMerge className="h-4 w-4 mr-2" /> Merge records</Button>
              <Button variant="outline" onClick={() => setShowMerge(false)}>Not the same person</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lifecycle timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lifecycle timeline</CardTitle>
          <CardDescription>Every enrolment, break, transfer and withdrawal — one person, one history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
            {TIMELINE.map((e, i) => (
              <div key={i} className="relative pb-6 last:pb-0">
                <div className={`absolute -left-[18px] top-1 h-3.5 w-3.5 rounded-full ring-4 ring-card ${TONE_CLASSES[e.tone]}`} />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold">{e.label}</span>
                  <Badge variant="outline" className={TONE_CLASSES[e.tone]}>{e.date}</Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{e.detail}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="attendance">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="funding">Funding & Finance</TabsTrigger>
          <TabsTrigger value="circs">Change of Circs</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="hesa">HESA Fields</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-4">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-base">Attendance trend</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-40">
                  {ATTENDANCE.map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full rounded-t-md bg-rose-400" style={{ height: `${v}%` }} />
                      <span className="text-xs text-muted-foreground">Term {i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm text-rose-600">
                  <TrendingDown className="h-4 w-4" /> Declining trend — early warning triggered
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Engagement score</CardTitle></CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-semibold text-rose-600">61</div>
                <div className="text-sm text-muted-foreground mt-1">/ 100</div>
                <Badge className="mt-3 bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50">High risk</Badge>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6"><AttendanceWeekly /></div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Module performance</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {MODULES.map(m => (
                  <div key={m.name} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted-foreground">Attendance: {m.att}</div>
                    </div>
                    <Badge variant="outline" className="text-base font-semibold">{m.grade}{m.grade !== "—" ? "%" : ""}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funding" className="mt-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Category 1 — Student to pay */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Student to pay</CardTitle>
                <CardDescription>Self-funded tuition, reminders and agreements.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <FieldRow icon={Send} label="Stage 1 fee reminder">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Sent</Badge>
                  <span className="text-xs text-muted-foreground ml-2">12 Aug 2026</span>
                </FieldRow>
                <FieldRow icon={CheckCircle2} label="Stage 1 payment status">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Paid</Badge>
                </FieldRow>
                <FieldRow icon={Mail} label="Follow-up communication">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Sent</Badge>
                  <span className="text-xs text-muted-foreground ml-2">14 Aug 2026</span>
                </FieldRow>
                <FieldRow icon={Send} label="Stage 2 reminder">
                  <Badge variant="outline" className="text-muted-foreground">Not sent</Badge>
                </FieldRow>
                <FieldRow icon={Send} label="Stage 3 reminder">
                  <Badge variant="outline" className="text-muted-foreground">Not sent</Badge>
                </FieldRow>
                <FieldRow icon={CheckCircle2} label="Maintenance — Term 3 received">
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Pending</Badge>
                </FieldRow>
                <FieldRow icon={PoundSterling} label="Other amounts (retake / extra tuition)">
                  <span className="text-sm font-semibold">£450.00</span>
                  <span className="text-xs text-muted-foreground ml-2">Resit fee</span>
                </FieldRow>
                <FieldRow icon={FileText} label="Fee payment policy">
                  <Badge className="bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50">On file</Badge>
                </FieldRow>
                <FieldRow icon={FileSignature} label="Fee agreement signed">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Signed</Badge>
                </FieldRow>
              </CardContent>
            </Card>

            {/* Category 2 — Student Loan Company */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Student Loan Company</CardTitle>
                <CardDescription>SLC application status and tracking.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <FieldRow icon={CheckCircle2} label="Applied for loan">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Yes</Badge>
                </FieldRow>
                <FieldRow icon={Calendar} label="Application date">
                  <span className="text-sm font-medium">14 Jul 2026</span>
                </FieldRow>
                <FieldRow icon={Clock} label="Application status">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Approved</Badge>
                </FieldRow>
                <FieldRow icon={PoundSterling} label="Loan confirmed amount">
                  <span className="text-sm font-semibold">£9,250.00</span>
                </FieldRow>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="circs" className="mt-4">
          <ChangeOfCircumstances />
        </TabsContent>

        <TabsContent value="communications" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Communications log</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { subj: "Withdrawal confirmation", trig: "Lifecycle: withdrawal", date: "12 Mar 2025" },
                { subj: "Attendance warning", trig: "Early warning rule", date: "28 Feb 2025" },
                { subj: "Resumption notice", trig: "Lifecycle: break end", date: "02 Sep 2022" },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">{c.subj}</div>
                    <div className="text-xs text-muted-foreground">Trigger: {c.trig}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hesa" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">HESA fields</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              {[
                ["MODE", "31"], ["YEARSTUD", "2"], ["MSTUFEE", "1"], ["DOMICILE", "XF"],
                ["PREVINST", "—"], ["QUALENT3", "D3"], ["DISABLE", "0"], ["ETHNIC", "22"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-xs font-mono text-muted-foreground">{k}</span>
                  <span className="text-sm font-medium">{v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FieldRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </div>
      <div className="flex items-center">{children}</div>
    </div>
  );
}