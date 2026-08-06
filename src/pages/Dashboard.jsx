import React from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { AlertTriangle, Wallet, Download, ChevronDown } from "lucide-react";
import KpiStrip from "@/components/dashboard/KpiStrip";
import ChartsRow from "@/components/dashboard/ChartsRow";
import OperationsRow from "@/components/dashboard/OperationsRow";

const ALERTS = [
  { icon: AlertTriangle, tone: "rose", title: "2 HESA blocking issues", detail: "Must resolve before sign-off" },
  { icon: Wallet, tone: "amber", title: "£86k fees overdue", detail: "31 students past due date" },
  { icon: AlertTriangle, tone: "amber", title: "Funding sync failed", detail: "SIS funding feed — retry needed" },
];

const COHORTS = [
  { faculty: "Business", students: 1820, att: "88%", wd: "3.8%", funding: "£1.3M" },
  { faculty: "Computing", students: 1240, att: "84%", wd: "5.1%", funding: "£920k" },
  { faculty: "Engineering", students: 980, att: "91%", wd: "3.2%", funding: "£740k" },
  { faculty: "Arts & Humanities", students: 760, att: "86%", wd: "4.4%", funding: "£560k" },
  { faculty: "Science", students: 940, att: "90%", wd: "3.9%", funding: "£710k" },
  { faculty: "Law", students: 483, att: "89%", wd: "4.7%", funding: "£380k" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organisation Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Northbrook University · academic year 2025/26 · live</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">This academic year <ChevronDown className="h-4 w-4" /></Button>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
        </div>
      </div>

      <KpiStrip />
      <ChartsRow />

      {/* Exception alerts */}
      <div className="grid sm:grid-cols-3 gap-4">
        {ALERTS.map(a => (
          <Card key={a.title} className={a.tone === "rose" ? "border-rose-200 bg-rose-50/40" : "border-amber-200 bg-amber-50/40"}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${a.tone === "rose" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"}`}>
                <a.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.detail}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OperationsRow />

      {/* Faculty performance table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance by faculty</CardTitle>
          <CardDescription>Students, attendance, withdrawals and funding collected — the whole estate at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Avg attendance</TableHead>
                  <TableHead>Withdrawal rate</TableHead>
                  <TableHead>Funding collected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COHORTS.map(c => (
                  <TableRow key={c.faculty}>
                    <TableCell className="font-medium">{c.faculty}</TableCell>
                    <TableCell>{c.students.toLocaleString()}</TableCell>
                    <TableCell>{c.att}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={parseFloat(c.wd) > 4.5 ? "text-rose-600 border-rose-200" : "text-emerald-600 border-emerald-200"}>
                        {c.wd}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{c.funding}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}