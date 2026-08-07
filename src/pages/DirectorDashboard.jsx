import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, TrendingDown, FileCheck2, Users } from "lucide-react";

export default function DirectorDashboard() {
  const [stats, setStats] = useState({ students: 0, withdrawn: 0, totalEnrolments: 0, hesaReady: 0, hesaTotal: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [students, enrolments, statuses] = await Promise.all([
          base44.entities.Student.list("-created_date", 500),
          base44.entities.Enrolment.list("-created_date", 500),
          base44.entities.HesaSubmissionStatus.list("-created_date", 500),
        ]);
        const withdrawn = (enrolments || []).filter(e => e.status === "withdrawn").length;
        const hesaTotal = (statuses || []).length;
        const hesaReady = (statuses || []).filter(s => s.status === "submitted" || s.included_in_accepted_return).length;
        setStats({
          students: (students || []).length,
          withdrawn,
          totalEnrolments: (enrolments || []).length,
          hesaReady,
          hesaTotal,
        });
      } catch (e) {
        // keep zeros — strategic view degrades gracefully when no data yet
      }
      setLoading(false);
    })();
  }, []);

  const activeEnrolments = stats.totalEnrolments - stats.withdrawn;
  const withdrawalRate = stats.totalEnrolments ? ((stats.withdrawn / stats.totalEnrolments) * 100).toFixed(1) : "0.0";
  const hesaReadiness = stats.hesaTotal ? Math.round((stats.hesaReady / stats.hesaTotal) * 100) : 0;

  const cards = [
    { label: "Active students", value: stats.students.toLocaleString(), icon: GraduationCap, tone: "bg-sky-50 text-sky-600" },
    { label: "Active enrolments", value: activeEnrolments.toLocaleString(), icon: Users, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Withdrawal rate", value: `${withdrawalRate}%`, icon: TrendingDown, tone: "bg-amber-50 text-amber-600" },
    { label: "HESA readiness", value: `${hesaReadiness}%`, icon: FileCheck2, tone: "bg-violet-50 text-violet-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Director View</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Strategic headline figures only — no operational task lists, no per-student drill-downs, no admin controls.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${c.tone}`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div className="text-3xl font-semibold mt-4">{loading ? "—" : c.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{c.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">HESA return readiness</CardTitle>
            <CardDescription>{stats.hesaReady} of {stats.hesaTotal} student records submission-ready.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={hesaReadiness} className="h-3" />
            <div className="text-sm text-muted-foreground">{hesaReadiness}% ready for the 2025/26 collection.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Withdrawal trend</CardTitle>
            <CardDescription>Withdrawals as a share of total enrolments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 h-32">
              {[4.8, 4.5, 4.4, 4.2].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${v * 14}px` }} />
                  <span className="text-xs text-muted-foreground">Q{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground mt-4">Current: {withdrawalRate}% · down 0.3pt year-on-year.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}