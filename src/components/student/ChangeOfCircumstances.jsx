import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

const EVENTS = [
  { type: "Withdrawal", date: "12 Mar 2025", status: "Confirmed", detail: "Voluntary · SLC notified", tone: "rose" },
  { type: "Fee change", date: "01 Sep 2024", status: "Confirmed", detail: "Tuition adjusted to £9,250 — SLC updated", tone: "amber" },
  { type: "Cohort transfer", date: "15 Jan 2024", status: "Confirmed", detail: "Transferred to BSc Data Science · Cohort B", tone: "violet" },
  { type: "Resumption", date: "02 Sep 2022", status: "Confirmed", detail: "Resumed after break in study", tone: "emerald" },
];

const TONE = {
  rose: "bg-rose-50 text-rose-700 border-rose-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function ChangeOfCircumstances() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change of circumstances</CardTitle>
        <CardDescription>SLC portal events — withdrawals, transfers, fee changes and resumptions with dates and status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EVENTS.map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{e.type}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">{e.date}</TableCell>
                  <TableCell><Badge className={TONE[e.tone] + " hover:opacity-90"}>{e.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.detail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}