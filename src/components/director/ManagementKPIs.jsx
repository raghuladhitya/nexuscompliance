import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, UserCog, AlertCircle, Users, TrendingUp, ArrowRight } from "lucide-react";
import {
  overallAttendancePct, staffHeadcount, notApprovedLearners, familyLinkedStudentCount
} from "@/lib/records";

const TONES = {
  sky: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function ManagementKPIs() {
  const unapproved = notApprovedLearners().length;
  const items = [
    { icon: CalendarCheck, label: "Attendance (overall)", value: `${overallAttendancePct()}%`, to: "/attendance", tone: "emerald", trend: "+2.4% vs last term", trendUp: true },
    { icon: UserCog, label: "Staff headcount", value: String(staffHeadcount()), to: "/staff", tone: "sky" },
    { icon: AlertCircle, label: "Unapproved learners", value: String(unapproved), to: "/funding-status", tone: unapproved > 3 ? "rose" : "amber" },
    { icon: Users, label: "Family-linked students", value: String(familyLinkedStudentCount()), to: "/students", tone: "amber" },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((k) => (
        <Link to={k.to} key={k.label}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{k.label}</div>
                  <div className="text-3xl font-semibold mt-1">{k.value}</div>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${TONES[k.tone]}`}>
                  <k.icon className="h-5 w-5" />
                </div>
              </div>
              {k.trend && (
                <div className={`text-xs mt-2 inline-flex items-center gap-1 ${k.trendUp ? "text-emerald-600" : "text-rose-600"}`}>
                  <TrendingUp className="h-3.5 w-3.5" /> {k.trend}
                </div>
              )}
              <div className="text-xs text-primary mt-2 inline-flex items-center gap-1">Drill down <ArrowRight className="h-3 w-3" /></div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}