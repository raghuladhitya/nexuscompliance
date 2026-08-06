import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import {
  Mail, Send, Clock, GitBranch, Search, Eye
} from "lucide-react";

const TEMPLATES = [
  { name: "Withdrawal confirmation", trigger: "Lifecycle: withdrawal", fields: ["student_name", "withdrawal_date", "reason"], uses: 142 },
  { name: "Payment reminder", trigger: "Instalment due in 7 days", fields: ["student_name", "amount", "due_date"], uses: 318 },
  { name: "Resumption notice", trigger: "Lifecycle: break end", fields: ["student_name", "resumption_date", "course"], uses: 64 },
  { name: "Attendance warning", trigger: "Early warning rule", fields: ["student_name", "missed_sessions"], uses: 207 },
  { name: "Visa engagement check", trigger: "Tier 4 COMLOCK", fields: ["student_name", "last_contact"], uses: 39 },
];

const LOG = [
  { subj: "Withdrawal confirmation", to: "James Whitfield", trig: "Lifecycle: withdrawal", date: "12 Mar 2026, 14:02", by: "System" },
  { subj: "Payment reminder", to: "Aisha Khan", trig: "Instalment due", date: "12 Mar 2026, 09:00", by: "System" },
  { subj: "Attendance warning", to: "Priya Nair", trig: "Early warning rule", date: "28 Feb 2026, 16:30", by: "System" },
  { subj: "Resumption notice", to: "Liam Boyd", trig: "Lifecycle: break end", date: "02 Sep 2025, 08:00", by: "Dana Roberts" },
];

export default function Communications() {
  const [selected, setSelected] = useState(TEMPLATES[0]);
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Communications Centre</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Templates triggered by lifecycle events — editable before sending, fully logged.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Template library */}
        <Card className="lg:col-span-2 h-fit">
          <CardHeader>
            <CardTitle className="text-base">Template library</CardTitle>
            <CardDescription>Auto-triggered, always editable.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {TEMPLATES.map(t => (
              <button key={t.name} onClick={() => setSelected(t)}
                className={`w-full text-left rounded-lg border p-3 transition-all ${selected.name === t.name ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.name}</span>
                  <Badge variant="outline" className="text-xs">{t.uses} sent</Badge>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <GitBranch className="h-3 w-3" /> {t.trigger}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Template preview */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">{selected.name}</CardTitle>
              <CardDescription>Trigger: {selected.trigger}</CardDescription>
            </div>
            <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" /> Preview merge</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1.5">Available merge fields</div>
              <div className="flex flex-wrap gap-1.5">
                {selected.fields.map(f => (
                  <Badge key={f} variant="secondary" className="font-mono text-xs">{`{{${f}}}`}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">Subject</div>
              <Input defaultValue={`${selected.name} — Northbrook University`} className="rounded-none border-0 border-b" />
              <div className="bg-muted px-3 py-2 text-xs font-medium text-muted-foreground">Body</div>
              <textarea
                className="w-full min-h-[140px] p-3 text-sm outline-none resize-none"
                defaultValue={`Dear {{student_name}},\n\nThis email confirms that your withdrawal has been processed as of {{withdrawal_date}}.\n\nIf you believe this is an error, please contact the Registry team.\n\nNorthbrook University`}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Save changes</Button>
              <Button><Send className="h-4 w-4 mr-1" /> Send now</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Communications log</CardTitle>
            <CardDescription>Full auditability — every send, recipient, trigger and time.</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search log" value={query} onChange={e => setQuery(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead><TableHead>Recipient</TableHead>
                  <TableHead>Trigger</TableHead><TableHead>Sent by</TableHead><TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LOG.filter(l => l.subj.toLowerCase().includes(query.toLowerCase()) || l.to.toLowerCase().includes(query.toLowerCase())).map((l, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm"><Mail className="h-3.5 w-3.5 inline mr-1.5 text-muted-foreground" />{l.subj}</TableCell>
                    <TableCell className="text-sm">{l.to}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{l.trig}</TableCell>
                    <TableCell className="text-sm">{l.by}</TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap"><Clock className="h-3.5 w-3.5 inline mr-1" />{l.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}