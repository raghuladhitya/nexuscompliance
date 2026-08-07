import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { Plus, X } from "lucide-react";

export default function AcademicStructure() {
  const { user } = useAuth();
  const institutionId = user?.institution_id || user?.data?.institution_id || "";
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [cohorts, setCohorts] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("cohorts");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", start_date: "", end_date: "" });

  const loadCourses = async () => {
    try {
      const data = await base44.entities.Course.list("-created_date", 100);
      setCourses(data || []);
      if (data && data.length && !courseId) setCourseId(data[0].id);
    } catch (e) {
      setCourses([]);
    }
  };

  const loadStructure = async () => {
    if (!courseId) { setCohorts([]); setUnits([]); setLoading(false); return; }
    setLoading(true);
    try {
      const [c, u] = await Promise.all([
        base44.entities.Cohort.filter({ course_id: courseId }, "-start_date", 100),
        base44.entities.Unit.filter({ course_id: courseId }, "-start_date", 100),
      ]);
      setCohorts(c || []); setUnits(u || []);
    } catch (e) {
      setCohorts([]); setUnits([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { loadStructure(); }, [courseId]);

  const submit = async () => {
    if (!form.name || !form.start_date || !courseId) {
      setError("Name and start date are required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const payload = {
        name: form.name,
        code: form.code || undefined,
        course_id: courseId,
        start_date: form.start_date,
        end_date: form.end_date || undefined,
        institution_id: institutionId,
      };
      if (tab === "cohorts") await base44.entities.Cohort.create(payload);
      else await base44.entities.Unit.create(payload);
      setForm({ name: "", code: "", start_date: "", end_date: "" });
      setShowForm(false);
      await loadStructure();
    } catch (e) {
      setError(e?.message || "Couldn't save. (Ensure your user has an institution_id set.)");
    }
    setSaving(false);
  };

  const rows = tab === "cohorts" ? cohorts : units;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Academic Structure Setup</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Define cohorts and units per course, with start/end dates — done once per course per term, before teaching begins. Attendance reads these structures rather than assuming they exist.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course</CardTitle>
          <CardDescription>Select the course whose structure you’re defining.</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 text-center">No courses exist yet. Create courses before defining cohorts and units.</div>
          ) : (
            <select className="flex h-9 w-full sm:max-w-md rounded-md border border-input bg-transparent px-3 text-sm" value={courseId} onChange={e => setCourseId(e.target.value)}>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}{c.code ? ` · ${c.code}` : ""}</option>)}
            </select>
          )}
        </CardContent>
      </Card>

      {courseId && (
        <>
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-lg border border-border p-1 bg-card">
              <button onClick={() => setTab("cohorts")} className={`px-4 py-1.5 text-sm rounded-md ${tab === "cohorts" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Cohorts</button>
              <button onClick={() => setTab("units")} className={`px-4 py-1.5 text-sm rounded-md ${tab === "units" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>Units</button>
            </div>
            <Button onClick={() => setShowForm(v => !v)}><Plus className="h-4 w-4 mr-2" /> Add {tab === "cohorts" ? "cohort" : "unit"}</Button>
          </div>

          {showForm && (
            <Card className="animate-slide-up">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">New {tab === "cohorts" ? "cohort" : "unit"}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={tab === "cohorts" ? "e.g. Sep 2026 intake" : "e.g. Algorithms"} /></div>
                <div className="space-y-1.5"><Label>Code</Label><Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Start date *</Label><Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>End date</Label><Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} /></div>
                {error && <div className="sm:col-span-2 text-sm text-destructive">{error}</div>}
                <div className="sm:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{tab === "cohorts" ? "Cohorts" : "Units"}</CardTitle>
              <CardDescription>{tab === "cohorts" ? "Student groups running this course." : "Teaching units scheduled within the course."}</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
              ) : rows.length === 0 ? (
                <div className="text-sm text-muted-foreground py-8 text-center">No {tab} defined yet for this course.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map(r => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground font-mono">{r.code || "—"}</TableCell>
                          <TableCell className="text-sm">{r.start_date || "—"}</TableCell>
                          <TableCell className="text-sm">{r.end_date || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}