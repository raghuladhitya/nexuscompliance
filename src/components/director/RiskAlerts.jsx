import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, UserMinus, Clock, FileWarning } from "lucide-react";

const ALERTS = [
  { icon: UserMinus, tone: "rose", title: "Withdrawal awaiting sign-off", sub: "Aisha Khan · 2 days in queue" },
  { icon: AlertTriangle, tone: "amber", title: "Attendance below 60%", sub: "Tom Brennan · W3–W4 declining" },
  { icon: FileWarning, tone: "rose", title: "HESA blocking error", sub: "4 records — must fix before submission" },
  { icon: Clock, tone: "amber", title: "Registration pending", sub: "2 students unconfirmed for Term 1" },
];

const TONES = {
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function RiskAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Needs your attention</CardTitle>
        <CardDescription>Items escalated for director review</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {ALERTS.map((a, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/60 transition-colors">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${TONES[a.tone]}`}>
              <a.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{a.title}</div>
              <div className="text-xs text-muted-foreground truncate">{a.sub}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}