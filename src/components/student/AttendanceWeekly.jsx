import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const WEEKS = [
  { week: "Week 1", dates: "04–08 Aug", pct: 92, confirmed: "11 Aug 2026" },
  { week: "Week 2", dates: "11–15 Aug", pct: 78, confirmed: "18 Aug 2026" },
  { week: "Week 3", dates: "18–22 Aug", pct: 64, confirmed: "25 Aug 2026" },
  { week: "Week 4", dates: "25–29 Aug", pct: 51, confirmed: null },
];

function pctTone(p) {
  if (p >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (p >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export default function AttendanceWeekly() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly attendance — August 2026</CardTitle>
        <CardDescription>Percentage per week, with confirmation dates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Attendance %</TableHead>
                <TableHead>Confirmed on</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {WEEKS.map(w => (
                <TableRow key={w.week}>
                  <TableCell className="font-medium">{w.week}</TableCell>
                  <TableCell className="text-sm">{w.dates}</TableCell>
                  <TableCell><Badge className={pctTone(w.pct) + " hover:opacity-90"}>{w.pct}%</Badge></TableCell>
                  <TableCell className="text-sm">
                    {w.confirmed ?? <Badge variant="outline" className="text-muted-foreground">Pending confirmation</Badge>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}