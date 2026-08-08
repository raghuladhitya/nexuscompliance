import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { UserPlus, CheckCircle2, Search, X } from "lucide-react";
import { logAudit } from "@/lib/auditLog";

const COURSES = ["BSc Computer Science", "BSc Data Science", "BEng Mechanical", "BA History", "MSc Data Science"];
const INTAKES = ["Sep 2026", "Jan 2027"];

export default function Admissions() {
  const { user } = useAuth();
  const institutionId = user?.institution_id || user?.data?.institution_id || "";
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", contact_email: "", person_code: "",
    date_of_birth: "", course_applied: COURSES[0], intake: INTAKES[0],
  });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const data = await base44.entities.Student.list("-created_date", 200);
      setStudents(data || []);
    } catch (e) {
      setStudents([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.first_name || !form.last_name || !form.person_code) {
      setError("First name, last name and person code are required.");
      return;
    }
    setSaving(true); setError("");
    try {
      const created = await base44.entities.Student.create({
        first_name: form.first_name,
        last_name: form.last_name,
        contact_email: form.contact_email || undefined,
        person_code: form.person_code,
        date_of_birth: form.date_of_birth || undefined,
        course_applied: form.course_applied,
        intake: form.intake,
        institution_id: institutionId,
      });
      await logAudit(user, {
        action: "create",
        entity_name: "Student",
        record_id: created?.id,
        source_team: "admissions",
        reason: `Induction intake — ${form.course_applied}, ${form.intake}`,
      });
      setForm({ first_name: "", last_name: "", contact_email: "", person_code: "", date_of_birth: "", course_applied: COURSES[0], intake: INTAKES[0] });
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e?.message || "Couldn't save the student record. (Ensure your user has an institution_id set.)");
    }
    setSaving(false);
  };

  const filtered = students.filter(s =>
    `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase().includes(query.toLowerCase()) ||
    (s.person_code || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admissions Workspace</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Induction list for the current intake — capture identity and course intent. This is where a Student record is first created.</p>
        </div>
        <Button onClick={() => setShowForm(v => !v)}><UserPlus className="h-4 w-4 mr-2" /> Enter new student</Button>
      </div>

      {showForm && (
        <Card className="animate-slide-up">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">New entrant</CardTitle>
              <CardDescription>Scoped to what Admissions knows at this stage — no attendance, funding or academic history yet.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>First name *</Label><Input value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Last name *</Label><Input value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Person code *</Label><Input value={form.person_code} onChange={e => setForm({ ...form, person_code: e.target.value })} placeholder="e.g. STU-2026-0001" /></div>
            <div className="space-y-1.5"><Label>Contact email</Label><Input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Date of birth</Label><Input type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Course applied for</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" value={form.course_applied} onChange={e => setForm({ ...form, course_applied: e.target.value })}>
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5"><Label>Intake / cohort</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" value={form.intake} onChange={e => setForm({ ...form, intake: e.target.value })}>
                {INTAKES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            {error && <div className="sm:col-span-2 text-sm text-destructive">{error}</div>}
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Create student record"}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Induction list — {INTAKES[0]}</CardTitle>
          <CardDescription>{filtered.length} entered · records created in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name or person code…" value={query} onChange={e => setQuery(e.target.value)} className="pl-9" />
          </div>
          {loading ? (
            <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No students entered yet for this intake. Use “Enter new student” to create the first record.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Person code</TableHead>
                    <TableHead>Course applied</TableHead><TableHead>Intake</TableHead><TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.first_name} {s.last_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">{s.person_code}</TableCell>
                      <TableCell className="text-sm">{s.course_applied || "—"}</TableCell>
                      <TableCell className="text-sm">{s.intake || "—"}</TableCell>
                      <TableCell><Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"><CheckCircle2 className="h-3 w-3 mr-1" /> Entered</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}