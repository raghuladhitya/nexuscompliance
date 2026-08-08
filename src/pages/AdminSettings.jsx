import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { logAudit } from "@/lib/auditLog";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus, Trash2, ShieldCheck, Database, RefreshCw, CheckCircle2, XCircle
} from "lucide-react";
import ProviderProfile from "@/components/admin/ProviderProfile";
import { ROLE_LABELS } from "@/lib/roles";

const ASSIGNABLE_ROLES = Object.keys(ROLE_LABELS).filter(r => r !== "user");

const FIELDS = [
  { name: "Crisis contact", type: "Text", entity: "Student" },
  { name: "Hall of residence", type: "Dropdown", entity: "Student" },
  { name: "Sponsor reference", type: "Text", entity: "Funding" },
  { name: "Visa expiry", type: "Date", entity: "Visa" },
];

export default function AdminSettings() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState(null);
  const [usersError, setUsersError] = useState("");
  const [fields, setFields] = useState(FIELDS);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Text");

  const loadUsers = async () => {
    setUsersLoading(true); setUsersError("");
    try {
      const data = await base44.entities.User.list("-created_date", 200);
      setUsers(data || []);
    } catch (e) {
      setUsers([]);
      setUsersError(e?.message || "Couldn't load users (admin access required).");
    }
    setUsersLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const changeRole = async (targetUser, newRole) => {
    if (newRole === targetUser.role) return;
    setSavingUserId(targetUser.id);
    try {
      await base44.entities.User.update(targetUser.id, { role: newRole });
      await logAudit(user, {
        action: "update",
        entity_name: "User",
        record_id: targetUser.id,
        field_name: "role",
        old_value: targetUser.role,
        new_value: newRole,
        source_team: "admin",
        reason: `Role changed for ${targetUser.full_name || targetUser.email}`,
      });
      await loadUsers();
    } catch (e) {
      setUsersError(e?.message || "Couldn't update role.");
    }
    setSavingUserId(null);
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

      <ProviderProfile />

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
        {/* Users & roles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Users & roles</CardTitle>
            <CardDescription>Every role change is written to the immutable audit log with who made it.</CardDescription>
          </CardHeader>
          <CardContent>
            {usersError && <div className="text-sm text-destructive mb-3">{usersError}</div>}
            {usersLoading ? (
              <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
            ) : users.length === 0 ? (
              <div className="text-sm text-muted-foreground py-8 text-center">No other users found yet for this institution.</div>
            ) : (
              <div className="space-y-2">
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{u.full_name || u.email || u.id}</div>
                      <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                    </div>
                    <select
                      className="rounded-md border border-input bg-card px-2 py-1.5 text-sm shrink-0"
                      value={u.role || "user"}
                      disabled={savingUserId === u.id}
                      onChange={e => changeRole(u, e.target.value)}
                    >
                      <option value="user">Staff (no workspace)</option>
                      {ASSIGNABLE_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
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