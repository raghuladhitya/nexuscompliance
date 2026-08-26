import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap, CalendarCheck, FileCheck2, Wallet, AlertTriangle, TrendingDown
} from "lucide-react";

const KPIS = [
  { icon: GraduationCap, label: "Active students", value: "6,223", sub: "+1.8% YoY", tone: "sky" },
  { icon: CalendarCheck, label: "Overall attendance", value: "84.2%", sub: "Aug · Term 1", tone: "emerald" },
  { icon: FileCheck2, label: "HESA readiness", value: "87%", sub: "12 issues open", tone: "amber" },
  { icon: Wallet, label: "Fee collection", value: "91%", sub: "£418k outstanding", tone: "emerald" },
  { icon: AlertTriangle, label: "At-risk students", value: "18", sub: "−6 vs last week", tone: "amber" },
  { icon: TrendingDown, label: "Withdrawal rate", value: "4.2%", sub: "−0.3pt YoY", tone: "rose" },
];

const TONES = {
  sky: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function DirectorKPIs() {
  return (
    <div className="grid-auto-cards">
      {KPIS.map((k) => (
        <Card key={k.label}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">{k.label}</div>
                <div className="text-2xl font-semibold mt-1">{k.value}</div>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${TONES[k.tone]}`}>
                <k.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">{k.sub}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}