import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search, TrendingDown, AlertTriangle, X, CalendarCheck
} from "lucide-react";
import CohortTrendChart from "@/components/attendance/CohortTrendChart";

const STUDENTS = [
  { name: "Priya Nair", id: "STU-2021-3390", risk: "high", weeks: [1,1,0,1,2,2,3,3,3,3] },
  { name: "James Whitfield", id: "STU-2021-4471", risk: "high", weeks: [1,1,2,2,3,3,3,2,3,3] },
  { name: "Marcus Osei", id: "STU-2023-9981", risk: "medium", weeks: [1,1,1,1,2,2,1,2,2,1] },
  { name: "Aisha Khan", id: "STU-2022-1120", risk: "medium", weeks: [1,1,2,1,1,2,3,2,2,2] },
  { name: "Liam Boyd", id: "STU-2021-7782", risk: "low", weeks: [1,1,1,1,1,1,1,1,2,1] },
  { name: "Sara Müller", id: "STU-2023-4410", risk: "low", weeks: [1,1,1,1,1,2,1,1,1,1] },
];

const CELL = {
  0: "bg-slate-100",
  1: "bg-emerald-400",
  2: "bg-amber-400",
  3: "bg-rose-500",
};

const AT_RISK = [
  { name: "Priya Nair", reason: "4 consecutive absences", score: 52, trend: "−18%" },
  { name: "James Whitfield", reason: "Declining trend", score: 61, trend: "−22%" },
  { name: "Aisha Khan", reason: "Engagement drop", score: 64, trend: "−9%" },
];

export default function Attendance() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = STUDENTS.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Attendance Register</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Heatmap view · 10 teaching weeks · risk-coloured</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Legend color="bg-emerald-400" label="Good" />
          <Legend color="bg-amber-400" label="Watch" />
          <Legend color="bg-rose-500" label="At risk" />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Weekly attendance</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students" value={query} onChange={e => setQuery(e.target.value)} className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-left font-medium pb-2">Student</th>
                    {Array.from({ length: 10 }).map((_, i) => <th key={i} className="font-medium pb-2 px-1 text-center">W{i + 1}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="py-2 pr-3">
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                      </td>
                      {s.weeks.map((w, i) => (
                        <td key={i} className="px-1 py-2 text-center">
                          <button
                            onClick={() => w >= 2 && setSelected({ name: s.name, week: i + 1, status: w })}
                            className={`h-7 w-7 rounded-md ${CELL[w]} ${w >= 2 ? "hover:ring-2 hover:ring-offset-1 hover:ring-rose-300 cursor-pointer" : ""} transition-all`}
                            title={`Week ${i + 1}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* At-risk side panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-rose-500" /> At-risk students</CardTitle>
            <CardDescription>Auto-surfaced early warnings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {AT_RISK.map(r => (
              <div key={r.name} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.name}</span>
                  <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50">{r.score}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{r.reason}</div>
                <div className="flex items-center gap-1 text-xs text-rose-600 mt-1.5">
                  <TrendingDown className="h-3 w-3" /> {r.trend} engagement
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <CohortTrendChart />

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" onClick={() => setSelected(null)} />
          <Card className="relative w-full max-w-sm h-full rounded-none rounded-l-2xl animate-slide-up overflow-auto">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">{selected.name}</CardTitle>
                <CardDescription>Week {selected.week} absence</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
                <div className="font-medium">3 sessions missed this week</div>
                <ul className="mt-2 space-y-1 text-xs text-rose-700">
                  <li>· Mon 10:00 — Algorithms</li>
                  <li>· Wed 14:00 — Databases</li>
                  <li>· Fri 09:00 — Machine Learning</li>
                </ul>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Attendance rate</span><span className="font-medium">61%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Engagement score</span><span className="font-medium text-rose-600">52</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Trend</span><span className="font-medium text-rose-600">↓ 18%</span></div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1"><CalendarCheck className="h-4 w-4 mr-1" /> Log follow-up</Button>
                <Button variant="outline">View profile</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-sm ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}