import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GitBranch, ArrowLeftRight, PauseCircle, RotateCcw } from "lucide-react";
import { eventsForStudent, COC_EVENT_TYPE_LABEL } from "@/lib/cocModel";
import { formatDateString } from "@/lib/records";

const TYPE_ICONS = { withdrawal: GitBranch, course_transfer: ArrowLeftRight, intermission: PauseCircle, reinstatement: RotateCcw };
const TYPE_TONE = { withdrawal: "bad", course_transfer: "info", intermission: "warning", reinstatement: "good" };

export default function StatusHistoryList({ studentId }) {
  const events = eventsForStudent(studentId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Status change history</CardTitle>
        <CardDescription>Recorded StatusChangeEvent entries — linked to the external COC tracking process.</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4 text-center">No status changes recorded.</div>
        ) : (
          <div className="space-y-2">
            {events.map((e) => {
              const Icon = TYPE_ICONS[e.event_type] || GitBranch;
              return (
                <div key={e.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{COC_EVENT_TYPE_LABEL[e.event_type] || e.event_type}</span>
                      <StatusBadge tone={TYPE_TONE[e.event_type] || "neutral"}>{e.previous_status} → {e.new_status}</StatusBadge>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDateString(e.effective_date)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1.5">{e.reason || "—"}</div>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Ref: <span className="font-mono">{e.external_tracking_ref || "—"}</span></span>
                    <span>Recorded by {e.changed_by}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}