import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, ShieldCheck, Trash2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { PERMISSIONS, ROLES } from "@/lib/rbacModel";

export default function RolesPermissions() {
  const [roles, setRoles] = useState(() => ROLES.map((r) => ({ ...r, permission_names: [...r.permission_names] })));
  const [newRoleName, setNewRoleName] = useState("");

  const toggle = (roleId, permName) => {
    setRoles((prev) => prev.map((r) => {
      if (r.id !== roleId) return r;
      const has = r.permission_names.includes(permName);
      return { ...r, permission_names: has ? r.permission_names.filter((p) => p !== permName) : [...r.permission_names, permName] };
    }));
  };

  const addRole = () => {
    if (!newRoleName.trim()) return;
    setRoles((prev) => [...prev, { id: `role_${Date.now()}`, name: newRoleName.trim(), permission_names: [] }]);
    setNewRoleName("");
  };

  const deleteRole = (roleId) => setRoles((prev) => prev.filter((r) => r.id !== roleId));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Roles & Permissions" description="Create institution roles and assign permissions — no code required." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Roles</CardTitle>
          <CardDescription>{roles.length} roles configured for this institution.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {roles.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.permission_names.length} permission{r.permission_names.length === 1 ? "" : "s"}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">{r.id}</Badge>
                <Button size="icon" variant="ghost" onClick={() => deleteRole(r.id)} title="Delete role"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Input placeholder="New role name (e.g. Admissions Officer)" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addRole()} className="flex-1" />
            <Button onClick={addRole}><Plus className="h-4 w-4 mr-1" /> Add role</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permission matrix</CardTitle>
          <CardDescription>Toggle each permission on or off per role.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="text-left font-medium pb-2">Permission</th>
                {roles.map((r) => <th key={r.id} className="font-medium pb-2 px-2 text-center align-bottom">{r.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.name} className="border-t border-border">
                  <td className="py-2.5 pr-2">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.description}</div>
                  </td>
                  {roles.map((r) => (
                    <td key={r.id} className="text-center py-2.5">
                      <Switch checked={r.permission_names.includes(p.name)} onCheckedChange={() => toggle(r.id, p.name)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}