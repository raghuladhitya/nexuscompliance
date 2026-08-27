import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, ArrowLeft, Users, ChevronDown, ChevronRight } from "lucide-react";
import { STUDENTS, ATTENDANCE_STATUS_META, formatDateString } from "@/lib/records";
import {
  studentStats, studentStatsByUnit, studentStatsByTerm, studentSessionRecords
} from "@/lib/attendanceModel";

const FILTERS = [
  { key: "name", label: "Name", placeholder: "Search by name", type: "text" },
  { key: "email", label: "Email", placeholder: "Search by email", type: "email" },
  { key: "code", label: "Person Code", placeholder: "e.g. STU-2021-4471", type: "text", mono: true },
];

const STATUS_TONE = { present: "good", late: "warning", absent: "bad", authorized_absence: "info", no_record: "neutral" };
const pctTone = (p) => (p == null ? "neutral" : p >= 85 ? "good" : p >= 70 ? "warning" : "bad");
const pctColor = (p) => (p == null ? "text-muted-foreground" : p >= 85 ? "text-emerald-600" : p >= 70 ? "text-amber-600" : "text-rose-600");

function Count({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function BreakdownRow({ name, raw, adjusted, scheduled, attended, authorized, absent }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate">{name}</span>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge tone={pctTone(raw)}>{raw}%</StatusBadge>
          <span className="text-xs text-muted-foreground">adj {adjusted == null ? "—" : `${adjusted}%`}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {attended}/{scheduled} attended · {authorized} auth. · {absent} absent
      </div>
    </div>
  );
}

export default function StudentLookup() {
  const [filterKey, setFilterKey] = useState("name");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showSessions, setShowSessions] = useState(false);

  const filter = FILTERS.find((f) => f.key === filterKey);

  const runSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setSelected(null); return; }
    const matches = STUDENTS.filter((s) => {
      const field = filterKey === "code" ? s.id : s[filterKey];
      return field && field.toLowerCase().includes(q);
    });
    setResults(matches);
    setSelected(null);
  };

  if (selected) {
    const overall = studentStats(selected.id);
    const byUnit = studentStatsByUnit(selected.id);
    const byTerm = studentStatsByTerm(selected.id);
    const sessions = studentSessionRecords(selected.id);

    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to search
        </Button>

        <Card>
          <CardContent className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{selected.name}</h2>
                <div className="text-sm text-muted-foreground mt-0.5 font-mono">{selected.id}</div>
                <div className="text-sm text-muted-foreground">{selected.cohort}</div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Raw</div>
                  <div className={`text-3xl font-semibold ${pctColor(overall.raw)}`}>{overall.raw}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Adjusted</div>
                  <div className={`text-3xl font-semibold ${pctColor(overall.adjusted)}`}>
                    {overall.adjusted == null ? "—" : `${overall.adjusted}%`}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
              <Count label="Scheduled" value={overall.scheduled} />
              <Count label="Attended" value={overall.attended} />
              <Count label="Authorized" value={overall.authorized} />
              <Count label="Absent" value={overall.absent} />
            </div>
          </CardContent>
        </Card>

        <div className="grid-auto-panels">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">By unit</CardTitle>
              <CardDescription>Raw and adjusted attendance per enrolled unit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {byUnit.map((u) => (
                <BreakdownRow key={u.unit.id} name={u.unit.name} {...u} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">By term</CardTitle>
              <CardDescription>Raw and adjusted attendance per term.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {byTerm.map((t) => (
                <BreakdownRow key={t.term.id} name={t.term.name} {...t} />
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Session records</CardTitle>
              <CardDescription>{sessions.length} sessions within enrolment windows.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowSessions((v) => !v)}>
              {showSessions ? (<><ChevronDown className="h-4 w-4 mr-1" /> Hide</>) : (<><ChevronRight className="h-4 w-4 mr-1" /> Show</>)}
            </Button>
          </CardHeader>
          {showSessions && (
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-left font-medium py-2">Date</th>
                    <th className="text-left font-medium py-2">Unit</th>
                    <th className="text-left font-medium py-2">Term</th>
                    <th className="text-left font-medium py-2">Week</th>
                    <th className="text-left font-medium py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((r) => (
                    <tr key={r.session_id} className="border-b border-border last:border-0">
                      <td className="py-2 text-muted-foreground whitespace-nowrap">{formatDateString(r.date)}</td>
                      <td className="py-2">{r.unit}</td>
                      <td className="py-2 text-muted-foreground">{r.term}</td>
                      <td className="py-2 text-muted-foreground">{r.week}</td>
                      <td className="py-2">
                        <StatusBadge tone={STATUS_TONE[r.status] || "neutral"}>
                          {r.status === "no_record" ? "No record" : (ATTENDANCE_STATUS_META[r.status] || { label: r.status }).label}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Find a student</CardTitle>
          <CardDescription>Search by name, email or person code to view their attendance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="att-filter">Filter type</Label>
              <select
                id="att-filter"
                value={filterKey}
                onChange={(e) => { setFilterKey(e.target.value); setResults(null); }}
                className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
              >
                {FILTERS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="att-value">Search value</Label>
              <div className="flex gap-2">
                <Input
                  id="att-value"
                  type={filter.type}
                  placeholder={filter.placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  className={filter.mono ? "font-mono" : ""}
                />
                <Button onClick={runSearch}><Search className="h-4 w-4 mr-1" /> Search</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {results !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Results</CardTitle>
            <CardDescription>{results.length} student{results.length === 1 ? "" : "s"} found.</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
                <Users className="h-5 w-5" /> No students match your search.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {results.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSelected(s); setShowSessions(false); }}
                    className="flex w-full items-center gap-3 py-3 text-left hover:bg-muted/50 rounded-lg px-2 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                    </div>
                    <div className="text-sm text-muted-foreground hidden sm:block">{s.cohort}</div>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}