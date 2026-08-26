import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, UserCog, AlertCircle, Users, TrendingUp, ArrowRight, ChevronDown } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { isAggregateOnlyRole } from "@/lib/roles";
import {
  overallAttendancePct, staffHeadcount, notApprovedLearners, familyLinkedStudentCount,
  cohorts as allCohorts, attendancePctForCohort, STAFF, GUARDIANS, studentById
} from "@/lib/records";

const TONES = {
  sky: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

function attendanceBreakdown() {
  return allCohorts().map((c) => ({ label: c, value: `${attendancePctForCohort(c)}%` }));
}
function staffBreakdown() {
  const acc = {};
  STAFF.forEach((s) => { acc[s.role] = (acc[s.role] || 0) + 1; });
  return Object.entries(acc).map(([label, value]) => ({ label, value: String(value) }));
}
function unapprovedBreakdown() {
  const acc = { confirmed: 0, pending: 0, rejected: 0, "n/a": 0 };
  notApprovedLearners().forEach((l) => { acc[l.stp_status] = (acc[l.stp_status] || 0) + 1; });
  return [
    { label: "Confirmed", value: String(acc.confirmed) },
    { label: "Pending", value: String(acc.pending) },
    { label: "Rejected", value: String(acc.rejected) },
  ].filter((r) => r.value !== "0");
}
function familyBreakdown() {
  const acc = {};
  Array.from(new Set(GUARDIANS.map((g) => g.student_id))).forEach((id) => {
    const s = studentById(id);
    if (!s) return;
    acc[s.cohort] = (acc[s.cohort] || 0) + 1;
  });
  return Object.entries(acc).map(([label, value]) => ({ label, value: String(value) }));
}

export default function ManagementKPIs() {
  const { role } = useRole();
  const aggregate = isAggregateOnlyRole(role);
  const [open, setOpen] = useState(null);
  const unapproved = notApprovedLearners().length;

  const items = [
    { icon: CalendarCheck, label: "Attendance (overall)", value: `${overallAttendancePct()}%`, to: "/attendance", tone: "emerald", trend: "+2.4% vs last term", trendUp: true, breakdown: attendanceBreakdown },
    { icon: UserCog, label: "Staff headcount", value: String(staffHeadcount()), to: "/staff", tone: "sky", breakdown: staffBreakdown },
    { icon: AlertCircle, label: "Unapproved learners", value: String(unapproved), to: "/funding-status", tone: unapproved > 3 ? "rose" : "amber", breakdown: unapprovedBreakdown },
    { icon: Users, label: "Family-linked students", value: String(familyLinkedStudentCount()), to: "/students", tone: "amber", breakdown: familyBreakdown },
  ];

  return (
    <div className="grid-auto-cards">
      {items.map((k) => {
        const isOpen = open === k.to;
        const rows = k.breakdown();
        const inner = (
          <Card className={`transition-shadow ${aggregate ? "cursor-pointer" : "hover:shadow-md cursor-pointer"} h-full`}>
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
              <div className="text-xs text-primary mt-2 inline-flex items-center gap-1">
                {aggregate ? (
                  <>
                    {isOpen ? "Hide breakdown" : "Show breakdown"} <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </>
                ) : (
                  <>Drill down <ArrowRight className="h-3 w-3" /></>
                )}
              </div>
              {aggregate && isOpen && (
                <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                  {rows.length === 0 && <div className="text-xs text-muted-foreground">No breakdown available.</div>}
                  {rows.map((r) => (
                    <div key={r.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground truncate pr-2">{r.label}</span>
                      <span className="font-semibold">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

        if (aggregate) {
          return (
            <div key={k.label} onClick={() => setOpen(isOpen ? null : k.to)}>
              {inner}
            </div>
          );
        }
        return (
          <Link to={k.to} key={k.label}>
            {inner}
          </Link>
        );
      })}
    </div>
  );
}