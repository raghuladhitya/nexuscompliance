import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, ArrowLeft, Users } from "lucide-react";
import { STUDENTS, ATTENDANCE_STATUS_META, formatDateString } from "@/lib/records";
import {
  studentStats, studentStatsByTerm, studentStatsByWeek, studentSessionRecords, TERMS
} from "@/lib/attendanceModel";

const FILTERS = [
  { key: "name", label: "Name", placeholder: "Search by name", type: "text" },
  { key: "email", label: "Email", placeholder: "Search by email", type: "email" },
  { key: "code", label: "Person Code", placeholder: "e.g. STU-2021-4471", type: "text", mono: true },
];

const STATUS_TONE = { present: "good", late: "warning", absent: "bad", authorized_absence: "info", no_record: "neutral" };
const pctTone = (p) => (p == null ? "neutral" : p >= 85 ? "good" : p >= 70 ? "warning" : "bad");
const pctColor = (p) => (p == null ? "text-muted-foreground" : p >= 85 ? "text-emerald-600" : p >= 70 ? "text-amber-600" : "text-rose-600");
const pctBar = (p) => (p >= 85 ? "bg-emerald-500" : p >= 70 ? "bg-amber-500" : "bg-rose-500");

function Count({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function TermRow({ name, raw, adjusted, scheduled, attended, authorized, absent, emphasized }) {
  return (
    <div className={`rounded-lg border p-3 ${emphasized ? "border-primary/30 bg-primary/5" : "border-border"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm truncate ${emphasized ? "font-semibold" : "font-medium"}`}>{name}</span>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge tone={pctTone(raw)}>{raw}%</StatusBadge>
          <span className="text-xs text-muted-foreground w-16 text-right">adj {adjusted == null ? "—" : `${adjusted}%`}</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {attended}/{scheduled} attended · {authorized} auth. · {absent} absent
      </div>
    </div>
  );
}

function monthLabel(iso) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

function StudentDetailView({ student, onBack }) {
  const overall = studentStats(student.id);
  const byTerm = studentStatsByTerm(student.id).filter((t) => t.scheduled > 0);
  const sessions = studentSessionRecords(student.id);

  const lastTermId = byTerm.length ? byTerm[byTerm.length - 1].term.id : TERMS[TERMS.length - 1].id;
  const [weekTerm, setWeekTerm] = useState(lastTermId);
  const weeks = studentStatsByWeek(student.id, weekTerm);

  // Group daily records by month
  const monthGroups = {};
  sessions.forEach((r) => { (monthGroups[monthLabel(r.date)] ||= []).push(r); });
  const months = Object.keys(monthGroups).reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="outline" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to search
      </Button>

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <div className="text-sm text-muted-foreground mt-0.5 font-mono">{student.id}</div>
              <div className="text-sm text-muted-foreground">{student.cohort}</div>
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

      <Tabs defaultValue="termly">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="termly">Termly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
        </TabsList>

        <TabsContent value="termly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">By term</CardTitle>
              <CardDescription>Total attended ÷ total scheduled per term (true ratio, not an average of weeks).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {byTerm.map((t) => (
                <TermRow key={t.term.id} name={t.term.name} raw={t.raw} adjusted={t.adjusted} scheduled={t.scheduled} attended={t.attended} authorized={t.authorized} absent={t.absent} />
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <TermRow name="All terms" raw={overall.raw} adjusted={overall.adjusted} scheduled={overall.scheduled} attended={overall.attended} authorized={overall.authorized} absent={overall.absent} emphasized />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">By week</CardTitle>
                <CardDescription>Sessions attended out of sessions scheduled each week.</CardDescription>
              </div>
              <select
                value={weekTerm}
                onChange={(e) => setWeekTerm(e.target.value)}
                className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
              >
                {byTerm.map((t) => <option key={t.term.id} value={t.term.id}>{t.term.name}</option>)}
              </select>
            </CardHeader>
            <CardContent className="space-y-2">
              {weeks.length === 0 && (
                <div className="text-sm text-muted-foreground py-4 text-center">No scheduled sessions in this term.</div>
              )}
              {weeks.map((w) => (
                <div key={w.week} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Week {w.week}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{w.attended}/{w.scheduled}{w.authorized ? ` · ${w.authorized} auth.` : ""}</span>
                      <StatusBadge tone={pctTone(w.raw)}>{w.raw}%</StatusBadge>
                    </div>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${pctBar(w.raw)}`} style={{ width: `${w.raw}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily records</CardTitle>
              <CardDescription>{sessions.length} individual session records within enrolment windows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {months.length === 0 && (
                <div className="text-sm text-muted-foreground py-4 text-center">No session records.</div>
              )}
              {months.map((m) => (
                <div key={m}>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{m}</div>
                  <div className="space-y-1.5">
                    {monthGroups[m].map((r) => (
                      <div key={r.session_id} className="flex items-center gap-3 rounded-lg border border-border p-2.5">
                        <div className="text-xs text-muted-foreground w-24 shrink-0">{formatDateString(r.date)}</div>
                        <div className="flex-1 min-w-0 text-sm truncate">{r.unit}</div>
                        <StatusBadge tone={STATUS_TONE[r.status] || "neutral"}>
                          {r.status === "no_record" ? "No record" : (ATTENDANCE_STATUS_META[r.status] || { label: r.status }).label}
                        </StatusBadge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StudentDetail() {
  const [filterKey, setFilterKey] = useState("name");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);

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

  if (selected) return <StudentDetailView student={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Find a student</CardTitle>
          <CardDescription>Search by name, email or person code to view their attendance detail.</CardDescription>
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
                    onClick={() => setSelected(s)}
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