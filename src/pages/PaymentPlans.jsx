import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PoundSterling, Calendar, RefreshCw, Send, Plus, CheckCircle2, Clock, AlertTriangle
} from "lucide-react";

const STATUS_META = {
  paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  upcoming: { label: "Upcoming", cls: "bg-sky-50 text-sky-700 border-sky-200", icon: Clock },
  overdue: { label: "Overdue", cls: "bg-rose-50 text-rose-700 border-rose-200", icon: AlertTriangle },
};

const STUDENTS = [
  { name: "Marcus Osei", plan: 3, paid: 2, next: "02 Sep", amount: 1050, status: "upcoming" },
  { name: "Priya Nair", plan: 3, paid: 3, next: "—", amount: 0, status: "paid" },
  { name: "Aisha Khan", plan: 6, paid: 2, next: "15 Aug", amount: 525, status: "overdue" },
  { name: "Liam Boyd", plan: 3, paid: 1, next: "30 Aug", amount: 1050, status: "upcoming" },
];

export default function PaymentPlans() {
  const [instalments, setInstalments] = useState(3);
  const [total, setTotal] = useState(9450);

  const schedule = Array.from({ length: instalments }).map((_, i) => {
    const amount = (total / instalments).toFixed(2);
    const d = new Date(2026, 8 + i, 1);
    return { n: i + 1, date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), amount };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment Plans</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Build instalment schedules and track status — no spreadsheets required.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Instalment builder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instalment builder</CardTitle>
            <CardDescription>Drag the slider to auto-generate a schedule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <Label>Number of instalments</Label>
                <span className="font-semibold">{instalments}</span>
              </div>
              <input
                type="range" min={1} max={12} value={instalments}
                onChange={e => setInstalments(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Total amount (£)</Label>
              <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="number" value={total} onChange={e => setTotal(parseFloat(e.target.value) || 0)} className="pl-9" />
              </div>
            </div>
            <div className="rounded-lg border border-border divide-y divide-border">
              {schedule.map(s => (
                <div key={s.n} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" /> Instalment {s.n} · {s.date}
                  </div>
                  <span className="text-sm font-semibold">£{Number(s.amount).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between bg-muted/60 rounded-lg px-3 py-2.5">
              <span className="text-sm text-muted-foreground">Per instalment</span>
              <span className="font-semibold">£{(total / instalments).toLocaleString("en-GB", { minimumFractionDigits: 2 })}</span>
            </div>
            <Button className="w-full"><Plus className="h-4 w-4 mr-1" /> Apply plan to student</Button>
          </CardContent>
        </Card>

        {/* Per-student status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan status by student</CardTitle>
            <CardDescription>Colour-coded · one-click reminder resend.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Next</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {STUDENTS.map(s => {
                    const st = STATUS_META[s.status];
                    return (
                      <TableRow key={s.name}>
                        <TableCell className="font-medium text-sm">{s.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{s.paid}/{s.plan} paid</TableCell>
                        <TableCell className="text-sm">{s.next === "—" ? "—" : `£${s.amount} · ${s.next}`}</TableCell>
                        <TableCell><Badge className={`${st.cls} hover:opacity-90`}><st.icon className="h-3 w-3 mr-1" />{st.label}</Badge></TableCell>
                        <TableCell>
                          {s.status === "overdue" ? (
                            <Button size="sm" variant="outline"><Send className="h-3.5 w-3.5 mr-1" /> Resend</Button>
                          ) : s.status === "upcoming" ? (
                            <Button size="sm" variant="ghost"><RefreshCw className="h-3.5 w-3.5" /></Button>
                          ) : <span className="text-xs text-muted-foreground">—</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}