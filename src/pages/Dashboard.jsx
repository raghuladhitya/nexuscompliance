import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  FileCheck2, AlertTriangle, Clock, TrendingDown, UserPlus,
  UserMinus, Search, ArrowRight, Calendar, Users, GraduationCap, ChevronDown
} from "lucide-react";

const ROLES = ["Compliance Officer", "Registry", "Senior Management"];

function Ring({ value, label }) {
  const r = 54, c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <div className="relative">
      <svg viewBox="0 0 128 128" className="w-36 h-36">
        <circle cx="64" cy="64" r={r} fill="none" stroke="hsl(214 32% 91%)" strokeWidth="11" />
        <circle
          cx="64" cy="64" r={r} fill="none" stroke="hsl(142 71% 45%)" strokeWidth="11"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          transform="rotate(-90 64 64)" className="transition-all duration-700"
        />
        <text x="64" y="60" textAnchor="middle" className="fill-foreground" fontSize="26" fontWeight="700">{value}%</text>
        <text x="64" y="80" textAnchor="middle" className="fill-muted-foreground" fontSize="11">validated</text>
      </svg>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, tone }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    sky: "bg-sky-50 text-sky-600",
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {sub && <div className="text-xs text-muted-foreground mt-2">{sub}</div>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(ROLES[0]);
  const [roleOpen, setRoleOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, Dana</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's what needs your attention today.</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setRoleOpen(v => !v)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <span className="text-muted-foreground">Viewing as</span>
            {role}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          {roleOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setRoleOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-border bg-popover shadow-lg z-40 animate-scale-in p-1">
                {ROLES.map(r => (
                  <button key={r} onClick={() => { setRole(r); setRoleOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted ${r === role ? "bg-muted font-medium" : ""}`}>
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {role === "Compliance Officer" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>HESA Return Readiness</CardTitle>
                <CardDescription>Student return · 2025/26 collection</CardDescription>
              </div>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">12 issues to resolve</Badge>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center gap-6">
              <Ring value={87} />
              <div className="flex-1 w-full space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Student fields validated</span><span className="font-medium">5,418 / 6,223</span></div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Modules validated</span><span className="font-medium">3,901 / 4,102</span></div>
                  <Progress value={95} className="h-2" />
                </div>
                <Button onClick={() => navigate("/hesa")} className="mt-2 w-full sm:w-auto">
                  Open Return Preview <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
                  <Clock className="h-4 w-4" /> Next submission window
                </div>
                <div className="mt-4">
                  <div className="text-5xl font-semibold">23</div>
                  <div className="text-primary-foreground/80 mt-1">days until 29 August 2026</div>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between text-primary-foreground/90">
                  <span>Sign-off deadline</span><span className="font-medium">26 Aug</span>
                </div>
                <div className="flex items-center justify-between text-primary-foreground/90">
                  <span>Quality report due</span><span className="font-medium">28 Aug</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {role === "Registry" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <StatCard icon={UserMinus} label="Withdrawals this week" value="7" sub="2 pending review" tone="rose" />
          <StatCard icon={UserPlus} label="New enrolments" value="34" sub="across 6 programmes" tone="emerald" />
          <StatCard icon={AlertTriangle} label="Attendance risk alerts" value="18" sub="down from 24 last week" tone="amber" />
        </div>
      )}

      {role === "Senior Management" && (
        <div className="grid lg:grid-cols-4 gap-6">
          <StatCard icon={GraduationCap} label="Active students" value="6,223" sub="+1.8% YoY" tone="sky" />
          <StatCard icon={FileCheck2} label="HESA readiness" value="87%" sub="12 issues open" tone="amber" />
          <StatCard icon={TrendingDown} label="Withdrawal rate" value="4.2%" sub="−0.3pt vs last year" tone="emerald" />
          <StatCard icon={Users} label="Staff active" value="142" sub="across 9 teams" tone="sky" />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { icon: UserMinus, tone: "rose", title: "James Whitfield withdrew", sub: "BSc Computer Science · Year 2", time: "12 min ago" },
              { icon: AlertTriangle, tone: "amber", title: "Attendance risk raised", sub: "Priya Nair · 4 consecutive absences", time: "38 min ago" },
              { icon: UserPlus, tone: "emerald", title: "New enrolment confirmed", sub: "Marcus Osei · MSc Data Science", time: "1 hr ago" },
              { icon: FileCheck2, tone: "sky", title: "HESA field validated", sub: "312 student records re-validated", time: "2 hr ago" },
              { icon: UserMinus, tone: "rose", title: "Withdrawal requested", sub: "Aisha Khan · awaiting review", time: "3 hr ago" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/60 transition-colors">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${a.tone === 'rose' ? 'bg-rose-50 text-rose-600' : a.tone === 'amber' ? 'bg-amber-50 text-amber-600' : a.tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{a.sub}</div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick student search</CardTitle>
            <CardDescription>Find anyone across all enrolments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Name, student ID, or email" className="pl-9" />
            </div>
            <Button variant="outline" className="w-full" onClick={() => navigate("/students")}>
              <Users className="h-4 w-4 mr-2" /> Open Student 360
            </Button>
            <div className="pt-2 border-t border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2">Recently viewed</div>
              {["James Whitfield", "Priya Nair", "Marcus Osei"].map(n => (
                <button key={n} onClick={() => navigate("/students")}
                  className="flex items-center gap-2 w-full py-1.5 text-sm hover:text-primary transition-colors">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                    {n.split(" ").map(p => p[0]).join("")}
                  </div>
                  {n}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calendar, label: "Attendance register", to: "/attendance", tone: "text-emerald-600" },
          { icon: FileCheck2, label: "HESA validation", to: "/hesa", tone: "text-sky-600" },
          { icon: TrendingDown, label: "Withdrawal workflow", to: "/withdrawals", tone: "text-rose-600" },
          { icon: GraduationCap, label: "Build a report", to: "/reports", tone: "text-violet-600" },
        ].map(s => (
          <button key={s.label} onClick={() => navigate(s.to)}
            className="text-left rounded-xl border border-border bg-card p-4 hover:shadow-sm hover:border-primary/30 transition-all group">
            <s.icon className={`h-5 w-5 ${s.tone}`} />
            <div className="mt-3 text-sm font-medium">{s.label}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors">
              Open <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}