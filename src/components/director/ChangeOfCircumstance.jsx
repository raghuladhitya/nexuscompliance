import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { GitBranch, ArrowLeftRight, Wallet, RotateCcw } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { isAggregateOnlyRole } from "@/lib/roles";

const ROWS = [
  { name: "James Whitfield", type: "Withdrawal", icon: GitBranch, date: "12 Mar 2026", status: "Completed", detail: "Voluntary — resumption possible" },
  { name: "Aisha Khan", type: "Transfer", icon: ArrowLeftRight, date: "02 Sep 2026", status: "In review", detail: "BSc CS → BSc Data Science" },
  { name: "Tom Brennan", type: "Fee change", icon: Wallet, date: "08 Aug 2026", status: "Completed", detail: "Self-funded → SLC sponsored" },
  { name: "Priya Nair", type: "Resumption", icon: RotateCcw, date: "15 Sep 2026", status: "Pending", detail: "Returning from break in study" },
  { name: "Ravi Patel", type: "Fee change", icon: Wallet, date: "10 Aug 2026", status: "In review", detail: "Instalment plan revised" },
  { name: "Sofia Marin", type: "Transfer", icon: ArrowLeftRight, date: "11 Aug 2026", status: "Pending", detail: "BEng → BEng (Hons) 4-yr" },
];

const cocTone = (s) => (s === "Completed" ? "good" : s === "In review" ? "info" : "warning");

function Field({ label, value, muted }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-sm ${muted ? "text-muted-foreground" : "font-medium"}`}>{value}</div>
    </div>
  );
}

const TYPE_ICONS = { Withdrawal: GitBranch, Transfer: ArrowLeftRight, "Fee change": Wallet, Resumption: RotateCcw };

function AggregateCOC() {
  const byType = {};
  ROWS.forEach((r) => { byType[r.type] = (byType[r.type] || 0) + 1; });
  const byStatus = [
    { label: "Completed", count: ROWS.filter((r) => r.status === "Completed").length, tone: "good" },
    { label: "In review", count: ROWS.filter((r) => r.status === "In review").length, tone: "info" },
    { label: "Pending", count: ROWS.filter((r) => r.status === "Pending").length, tone: "warning" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change of circumstance</CardTitle>
        <CardDescription>Aggregate COC activity across {ROWS.length} records.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="text-xs text-muted-foreground mb-2">By type</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(byType).map(([type, count]) => {
              const Icon = TYPE_ICONS[type] || GitBranch;
              return (
                <div key={type} className="rounded-lg border border-border p-4">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-2xl font-semibold mt-2">{count}</div>
                  <div className="text-xs text-muted-foreground">{type}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-2">By status</div>
          <div className="space-y-2">
            {byStatus.map((s) => (
              <div key={s.label} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm">{s.label}</span>
                <StatusBadge tone={s.tone}>{s.count}</StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ChangeOfCircumstance() {
  const { role } = useRole();
  if (isAggregateOnlyRole(role)) return <AggregateCOC />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Change of circumstance</CardTitle>
        <CardDescription>Withdrawals, transfers, fee changes and resumptions — with dates and status.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Wide: single row, 5 evenly-spaced columns */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-2.5 px-2">Student</th>
                <th className="text-left font-medium py-2.5 px-2">Type</th>
                <th className="text-left font-medium py-2.5 px-2">Date</th>
                <th className="text-left font-medium py-2.5 px-2">Status</th>
                <th className="text-left font-medium py-2.5 px-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 px-2 font-medium">{r.name}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <r.icon className="h-4 w-4 text-muted-foreground" />
                      {r.type}
                    </div>
                  </td>
                  <td className="py-3 px-2">{r.date}</td>
                  <td className="py-3 px-2"><StatusBadge tone={cocTone(r.status)}>{r.status}</StatusBadge></td>
                  <td className="py-3 px-2 text-muted-foreground">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet: 2 per row (2+2+1); Mobile: 1 per row, full width */}
        <div className="lg:hidden space-y-3">
          {ROWS.map((r, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <Field label="Student" value={r.name} />
                <Field
                  label="Type"
                  value={<span className="inline-flex items-center gap-2"><r.icon className="h-4 w-4 text-muted-foreground" />{r.type}</span>}
                />
                <Field label="Date" value={r.date} />
                <Field label="Status" value={<StatusBadge tone={cocTone(r.status)}>{r.status}</StatusBadge>} />
                <Field label="Detail" value={r.detail} muted />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}