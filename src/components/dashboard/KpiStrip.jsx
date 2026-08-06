import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpRight, ArrowDownRight, GraduationCap, PoundSterling,
  FileCheck2, TrendingDown, CalendarCheck, Users
} from "lucide-react";

const KPIS = [
  { label: "Active students", value: "6,223", delta: "+1.8% YoY", up: true, icon: GraduationCap, tone: "sky" },
  { label: "Tuition collected (MTD)", value: "£4.2M", delta: "87% of target", up: true, icon: PoundSterling, tone: "emerald" },
  { label: "HESA readiness", value: "87%", delta: "12 issues open", up: false, icon: FileCheck2, tone: "amber" },
  { label: "Withdrawal rate (YTD)", value: "4.2%", delta: "−0.3pt", up: true, icon: TrendingDown, tone: "emerald" },
  { label: "Avg attendance", value: "89%", delta: "−2pt", up: false, icon: CalendarCheck, tone: "amber" },
  { label: "Staff active", value: "142", delta: "across 9 teams", up: true, icon: Users, tone: "sky" },
];

const TONES = {
  sky: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function KpiStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {KPIS.map(k => (
        <Card key={k.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${TONES[k.tone]}`}>
                <k.icon className="h-5 w-5" />
              </div>
              {k.up ? <ArrowUpRight className="h-4 w-4 text-emerald-500" /> : <ArrowDownRight className="h-4 w-4 text-amber-500" />}
            </div>
            <div className="text-2xl font-semibold mt-3">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className={`text-xs mt-1 ${k.up ? "text-emerald-600" : "text-amber-600"}`}>{k.delta}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}