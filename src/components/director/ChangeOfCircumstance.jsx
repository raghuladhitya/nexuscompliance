import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { GitBranch, ArrowLeftRight, PauseCircle, RotateCcw, Plus } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { isAggregateOnlyRole } from "@/lib/roles";
import { STATUS_CHANGE_EVENTS, COC_EVENT_TYPES, COC_EVENT_TYPE_LABEL } from "@/lib/cocModel";
import { STUDENTS, formatDateString } from "@/lib/records";

const TYPE_ICONS = { withdrawal: GitBranch, course_transfer: ArrowLeftRight, intermission: PauseCircle, reinstatement: RotateCcw };
const TYPE_TONE = { withdrawal: "bad", course_transfer: "info", intermission: "warning", reinstatement: "good" };

function AggregateCOC({ events }) {
  const byType = {};
  events.forEach((e) => { byType[e.event_type] = (byType[e.event_type] || 0) + 1; });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change of circumstance</CardTitle>
        <CardDescription>Aggregate COC activity across {events.length} recorded event{events.length === 1 ? "" : "s"}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2">By type</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(byType).map(([type, count]) => {
            const Icon = TYPE_ICONS[type] || GitBranch;
            return (
              <div key={type} className="rounded-lg border border-border p-4">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-semibold mt-2">{count}</div>
                <div className="text-xs text-muted-foreground">{COC_EVENT_TYPE_LABEL[type] || type}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RecordStatusChangeDialog({ onRecord }) {
  const [open, setOpen] = useState(false);
  const [studentId, setStudentId] = useState(STUDENTS[0].id);
  const [eventType, setEventType] = useState("withdrawal");
  const [previousStatus, setPreviousStatus] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));
  const [reason, setReason] = useState("");
  const [externalRef, setExternalRef] = useState("");

  const reset = () => {
    setPreviousStatus(""); setNewStatus(""); setReason(""); setExternalRef("");
    setEventType("withdrawal");
    setEffectiveDate(new Date().toISOString().slice(0, 10));
  };

  const submit = () => {
    if (!effectiveDate) return;
    const student = STUDENTS.find((s) => s.id === studentId);
    onRecord({
      id: `sce_${Date.now()}`,
      student_id: studentId,
      student_name: student ? student.name : studentId,
      event_type: eventType,
      previous_status: previousStatus || "—",
      new_status: newStatus || COC_EVENT_TYPE_LABEL[eventType],
      effective_date: effectiveDate,
      reason,
      changed_by: "STF-004",
      external_tracking_ref: externalRef,
    });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="h-4 w-4 mr-1" /> Record status change</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record a status change</DialogTitle>
          <DialogDescription>
            Creates a StatusChangeEvent entry. The actual COC process is handled manually outside this tool — use the external reference to link the two.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm">
              {STUDENTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Event type</Label>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm">
              {COC_EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Previous status</Label>
            <Input value={previousStatus} onChange={(e) => setPreviousStatus(e.target.value)} placeholder="e.g. Active" />
          </div>
          <div className="space-y-1.5">
            <Label>New status</Label>
            <Input value={newStatus} onChange={(e) => setNewStatus(e.target.value)} placeholder="e.g. Withdrawn" />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label>Effective date</Label>
            <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label>Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for the change" />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label>External tracking reference</Label>
            <Input value={externalRef} onChange={(e) => setExternalRef(e.target.value)} placeholder="e.g. COC-2026-0488" className="font-mono" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Record change</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, muted }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-sm ${muted ? "text-muted-foreground" : "font-medium"}`}>{value}</div>
    </div>
  );
}

export default function ChangeOfCircumstance() {
  const { role } = useRole();
  const [events, setEvents] = useState(() => STATUS_CHANGE_EVENTS.map((e) => ({ ...e })));

  const record = (evt) => setEvents((prev) => [evt, ...prev]);

  if (isAggregateOnlyRole(role)) return <AggregateCOC events={events} />;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between flex-wrap gap-3">
        <div>
          <CardTitle className="text-base">Change of circumstance</CardTitle>
          <CardDescription>Recorded status changes with effective dates and external tracking references.</CardDescription>
        </div>
        <RecordStatusChangeDialog onRecord={record} />
      </CardHeader>
      <CardContent>
        {/* Wide: single row table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-2.5 px-2">Student</th>
                <th className="text-left font-medium py-2.5 px-2">Type</th>
                <th className="text-left font-medium py-2.5 px-2">Effective date</th>
                <th className="text-left font-medium py-2.5 px-2">Reason</th>
                <th className="text-left font-medium py-2.5 px-2">External ref</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const Icon = TYPE_ICONS[e.event_type] || GitBranch;
                return (
                  <tr key={e.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-2 font-medium">{e.student_name}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {COC_EVENT_TYPE_LABEL[e.event_type] || e.event_type}
                      </div>
                    </td>
                    <td className="py-3 px-2">{formatDateString(e.effective_date)}</td>
                    <td className="py-3 px-2 text-muted-foreground truncate">{e.reason || "—"}</td>
                    <td className="py-3 px-2 font-mono text-xs">{e.external_tracking_ref || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tablet: 2 per row; Mobile: 1 per row */}
        <div className="lg:hidden space-y-3">
          {events.map((e) => {
            const Icon = TYPE_ICONS[e.event_type] || GitBranch;
            return (
              <div key={e.id} className="rounded-lg border border-border p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <Field label="Student" value={e.student_name} />
                  <Field
                    label="Type"
                    value={<span className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" />{COC_EVENT_TYPE_LABEL[e.event_type] || e.event_type}</span>}
                  />
                  <Field label="Effective date" value={formatDateString(e.effective_date)} />
                  <Field label="External ref" value={<span className="font-mono text-xs">{e.external_tracking_ref || "—"}</span>} />
                  <Field label="Reason" value={e.reason || "—"} muted />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}