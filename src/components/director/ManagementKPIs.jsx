import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, UserCog, AlertCircle, Users } from "lucide-react";
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
  const items = [
    { icon: CalendarCheck, label: "Attendance (overall)", value: `${overallAttendancePct()}%`, to: "/attendance", tone: "emerald" },
    { icon: UserCog, label: "Active staff", value: String(staffHeadcount()), to: "/staff", tone: "sky" },
    { icon: AlertCircle, label: "Unapproved learners", value: String(notApprovedLearners().length), to: "/funding-status", tone: "rose" },
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
                  <div className="text-2xl font-semibold mt-1">{k.value}</div>
                </div>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${TONES[k.tone]}`}>
                  <k.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="text-xs text-primary mt-2">Drill down →</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}