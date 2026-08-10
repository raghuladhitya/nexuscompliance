import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Plus, Trash2, ShieldCheck, Database, RefreshCw, CheckCircle2, XCircle
} from "lucide-react";

const ROLES = ["Registry", "Compliance", "Finance", "Academic", "Senior Mgmt"];
const PERMISSIONS = ["View students", "Edit records", "Withdrawals", "HESA submit", "Finance", "Audit log"];

const INITIAL_MATRIX = {
  Registry: [true, true, true, false, false, false],
  Compliance: [true, false, false, true, false, true],
  Finance: [true, false, false, false, true, false],
  Academic: [true, true, false, false, false, false],
  "Senior Mgmt": [true, false, false, true, true, true],
};

const FIELDS = [
  { name: "Crisis contact", type: "Text", entity: "Student" },
  { name: "Hall of residence", type: "Dropdown", entity: "Student" },
  { name: "Sponsor reference", type: "Text", entity: "Funding" },
  { name: "Visa expiry", type: "Date", entity: "Visa" },
];

export default function AdminSettings() {
  const [matrix, setMatrix] = useState(INITIAL_MATRIX);
  const [fields, setFields] = useState(FIELDS);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Text");

  const toggle = (role, idx) => {
    setMatrix(m => ({ ...m, [role]: m[role].map((v, i) => i === idx ? !v : v) }));
  };

  const addField = () => {
    if (!newName.trim()) return;
    setFields([...fields, { name: newName, type: newType, entity: "Student" }]);
    setNewName("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin & Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure roles, fields and data sources — no engineering work.</p>
      </div>

      {/* Data source status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> Data source connection</CardTitle>
          <CardDescription>Status of sync from your student records system (Tribal SITS).</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-4">
          {[
            { name: "Student records", status: "ok", last: "2 min ago", count: "6,223 records" },
            { name: "Module enrolments", status: "ok", last: "2 min ago", count: "4,102 records" },
            { name: "Funding & fees", status: "error", last: "Failed 14 min ago", count: "0 records synced" },
          ].map(s => {
            const Icon = s.status === "ok" ? CheckCircle2 : XCircle;
            const cls = s.status === "ok" ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50";
            const badge = s.status === "ok" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200";
            return (
              <div key={s.name} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${cls}`}><Icon className="h-5 w-5" /></div>
                  <Badge className={badge + " hover:opacity-90"}>{s.status === "ok" ? "Synced" : "Failed"}</Badge>
                </div>
                <div className="text-sm font-medium mt-3">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.count}</div>
                <div className="text-xs text-muted-foreground mt-1">Last sync: {s.last}</div>
                {s.status !== "ok" && <Button variant="outline" size="sm" className="mt-3 w-full"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry sync</Button>}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Permissions matrix */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Roles & permissions</CardTitle>
            <CardDescription>Toggle what each role can do — no custom code.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[460px]">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left font-medium pb-2">Permission</th>
                  {ROLES.map(r => <th key={r} className="font-medium pb-2 px-2 text-center">{r}</th>)}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((p, pi) => (
                  <tr key={p} className="border-t border-border">
                    <td className="py-2.5 text-sm font-medium">{p}</td>
                    {ROLES.map(r => (
                      <td key={r} className="text-center py-2.5">
                        <Switch checked={matrix[r][pi]} onCheckedChange={() => toggle(r, pi)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Custom fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Custom fields</CardTitle>
            <CardDescription>Add fields to student records without touching the core schema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {fields.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="text-sm font-medium">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.type} · {f.entity}</div>
                  </div>
                  <button onClick={() => setFields(fields.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-rose-600 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-dashed border-border p-3 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Add a field</div>
              <div className="flex gap-2">
                <Input placeholder="Field name" value={newName} onChange={e => setNewName(e.target.value)} className="flex-1" />
                <select value={newType} onChange={e => setNewType(e.target.value)} className="rounded-md border border-input bg-card px-3 text-sm">
                  {["Text", "Date", "Dropdown", "Number"].map(t => <option key={t}>{t}</option>)}
                </select>
                <Button size="icon" onClick={addField}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}