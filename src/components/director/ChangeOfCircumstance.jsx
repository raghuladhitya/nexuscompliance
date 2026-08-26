import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, ArrowLeftRight, Wallet, RotateCcw } from "lucide-react";

const ROWS = [
  { name: "James Whitfield", type: "Withdrawal", icon: GitBranch, date: "12 Mar 2026", status: "Completed", detail: "Voluntary — resumption possible" },
  { name: "Aisha Khan", type: "Transfer", icon: ArrowLeftRight, date: "02 Sep 2026", status: "In review", detail: "BSc CS → BSc Data Science" },
  { name: "Tom Brennan", type: "Fee change", icon: Wallet, date: "08 Aug 2026", status: "Completed", detail: "Self-funded → SLC sponsored" },
  { name: "Priya Nair", type: "Resumption", icon: RotateCcw, date: "15 Sep 2026", status: "Pending", detail: "Returning from break in study" },
  { name: "Ravi Patel", type: "Fee change", icon: Wallet, date: "10 Aug 2026", status: "In review", detail: "Instalment plan revised" },
  { name: "Sofia Marin", type: "Transfer", icon: ArrowLeftRight, date: "11 Aug 2026", status: "Pending", detail: "BEng → BEng (Hons) 4-yr" },
];

const statusBadge = (s) =>
  s === "Completed"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
    : s === "In review"
    ? "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50"
    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";

function Field({ label, value, muted }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right text-sm ${muted ? "text-muted-foreground font-normal" : "font-medium"}`}>{value}</span>
    </div>
  );
}

export default function ChangeOfCircumstance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change of circumstance</CardTitle>
        <CardDescription>Withdrawals, transfers, fee changes and resumptions — with dates and status.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Table on wider screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-2.5">Student</th>
                <th className="text-left font-medium py-2.5">Type</th>
                <th className="text-left font-medium py-2.5">Date</th>
                <th className="text-left font-medium py-2.5">Status</th>
                <th className="text-left font-medium py-2.5">Detail</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 font-medium">{r.name}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <r.icon className="h-4 w-4 text-muted-foreground" />
                      {r.type}
                    </div>
                  </td>
                  <td className="py-3">{r.date}</td>
                  <td className="py-3"><Badge className={statusBadge(r.status)}>{r.status}</Badge></td>
                  <td className="py-3 text-muted-foreground">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stacked, centered cards on narrow screens */}
        <div className="md:hidden space-y-3">
          {ROWS.map((r, i) => (
            <div key={i} className="mx-auto max-w-md w-full rounded-lg border border-border p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{r.name}</span>
                <Badge className={statusBadge(r.status)}>{r.status}</Badge>
              </div>
              <div className="space-y-1.5">
                <Field label="Type" value={<span className="inline-flex items-center gap-2"><r.icon className="h-4 w-4 text-muted-foreground" />{r.type}</span>} />
                <Field label="Date" value={r.date} />
                <Field label="Detail" value={r.detail} muted />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}