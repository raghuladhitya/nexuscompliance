import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import {
  Plus, X, Save, Share2, Table2, BarChart3, Search, ChevronDown
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Attendance", fields: ["Attendance %", "Sessions attended", "Sessions missed", "Consecutive absences"],
  },
  {
    name: "Progression", fields: ["Module grade", "Pass rate", "Credit accumulation", "Stage outcome"],
  },
  {
    name: "Withdrawals", fields: ["Withdrawal date", "Withdrawal reason", "Resumption date", "Notice given"],
  },
  {
    name: "Performance", fields: ["Average mark", "Classification", "Resit count", "Award progress"],
  },
  {
    name: "Visa Compliance", fields: ["Visa type", "Visa expiry", "Engagement status", "Last contact"],
  },
  {
    name: "Funding", fields: ["Funding source", "Amount", "Outstanding balance", "SLC status"],
  },
];

const PREVIEW = [
  { name: "Priya Nair", att: "61%", grade: "65", status: "At risk", funding: "SFE" },
  { name: "James Whitfield", att: "58%", grade: "—", status: "Withdrawn", funding: "Self" },
  { name: "Marcus Osei", att: "84%", grade: "72", status: "Active", funding: "SFE" },
  { name: "Aisha Khan", att: "73%", grade: "68", status: "Active", funding: "Sponsor" },
  { name: "Liam Boyd", att: "91%", grade: "74", status: "Active", funding: "SFE" },
];

export default function ReportBuilder() {
  const [columns, setColumns] = useState(["Student name", "Attendance %", "Module grade", "Status", "Funding source"]);
  const [view, setView] = useState("table");
  const [openCat, setOpenCat] = useState("Attendance");

  const addColumn = (field) => {
    if (!columns.includes(field)) setColumns([...columns, field]);
  };
  const removeColumn = (field) => setColumns(columns.filter(c => c !== field));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Report Builder</h1>
          <p className="text-sm text-muted-foreground mt-0.5">No SQL, no table names — just plain-language fields.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Save className="h-4 w-4 mr-2" /> Save as template</Button>
          <Button variant="outline"><Share2 className="h-4 w-4 mr-2" /> Share with team</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Field picker */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-base">Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {CATEGORIES.map(cat => (
              <div key={cat.name}>
                <button
                  onClick={() => setOpenCat(openCat === cat.name ? null : cat.name)}
                  className="flex items-center justify-between w-full py-2 px-2 rounded-md hover:bg-muted text-sm font-medium"
                >
                  {cat.name}
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openCat === cat.name ? "rotate-180" : ""}`} />
                </button>
                {openCat === cat.name && (
                  <div className="pb-1 pl-1 space-y-0.5">
                    {cat.fields.map(f => (
                      <button
                        key={f}
                        onClick={() => addColumn(f)}
                        disabled={columns.includes(f)}
                        className="flex items-center gap-2 w-full py-1.5 px-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-left"
                      >
                        <Plus className="h-3.5 w-3.5" /> {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Builder + preview */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Columns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {columns.map(c => (
                  <Badge key={c} variant="secondary" className="pl-3 pr-1 py-1.5 text-sm">
                    {c}
                    <button onClick={() => removeColumn(c)} className="ml-1.5 rounded-full hover:bg-muted-foreground/20 p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {columns.length === 0 && <span className="text-sm text-muted-foreground">Add fields from the left to build your report.</span>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Live preview</CardTitle>
              <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                <button onClick={() => setView("table")} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${view === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <Table2 className="h-3.5 w-3.5" /> Table
                </button>
                <button onClick={() => setView("chart")} className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${view === "chart" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  <BarChart3 className="h-3.5 w-3.5" /> Chart
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {view === "table" ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map(c => <TableHead key={c} className="whitespace-nowrap">{c}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PREVIEW.map((row, i) => (
                        <TableRow key={i}>
                          {columns.map(c => {
                            const map = {
                              "Student name": row.name, "Attendance %": row.att, "Module grade": row.grade,
                              "Status": row.status, "Funding source": row.funding,
                            };
                            const val = map[c] ?? "—";
                            return <TableCell key={c} className="whitespace-nowrap text-sm">{val}</TableCell>;
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex items-end gap-4 h-56 px-4">
                  {PREVIEW.map(r => {
                    const pct = parseInt(r.att);
                    return (
                      <div key={r.name} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-primary" style={{ height: `${pct}%` }} />
                        <span className="text-xs text-muted-foreground truncate max-w-full">{r.name.split(" ")[0]}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}