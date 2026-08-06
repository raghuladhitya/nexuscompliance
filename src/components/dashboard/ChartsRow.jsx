import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts";

const FACULTY = [
  { name: "Bus", students: 1820 },
  { name: "Comp", students: 1240 },
  { name: "Eng", students: 980 },
  { name: "Arts", students: 760 },
  { name: "Sci", students: 940 },
  { name: "Law", students: 483 },
];

const FUNDING = [
  { name: "Collected", value: 4.2, color: "#10b981" },
  { name: "Outstanding", value: 0.9, color: "#f43f5e" },
  { name: "SLC pending", value: 0.6, color: "#f59e0b" },
];

export default function ChartsRow() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enrolment by faculty</CardTitle>
          <CardDescription>Active students per faculty.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={FACULTY}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{ fill: "hsl(214 32% 91%)" }} />
              <Bar dataKey="students" fill="hsl(224 76% 28%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funding position</CardTitle>
          <CardDescription>£5.7M total billed this month.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={FUNDING} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {FUNDING.map(f => <Cell key={f.name} fill={f.color} />)}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">HESA return</CardTitle>
          <CardDescription>2025/26 student collection.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Student fields</span><span className="font-medium">87%</span></div>
            <Progress value={87} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Modules</span><span className="font-medium">95%</span></div>
            <Progress value={95} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Sign-off</span><span className="font-medium">2 blockers</span></div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="rounded-lg bg-primary text-primary-foreground p-3 text-sm flex justify-between">
            <span>Submission due</span><span className="font-semibold">29 Aug · 23 days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}