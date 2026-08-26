import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function StaffForm({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || "");
  const [role, setRole] = useState(initial?.role || "");
  const [cohorts, setCohorts] = useState((initial?.cohorts || []).join(", "));
  const [active, setActive] = useState(initial?.active ?? true);

  const submit = () => {
    if (!name.trim() || !role.trim()) return;
    onSave({
      id: initial?.id || `STF-${Math.floor(Math.random() * 900 + 100)}`,
      name: name.trim(),
      role: role.trim(),
      cohorts: cohorts.split(",").map((c) => c.trim()).filter(Boolean),
      units: initial?.units || [],
      active,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="sf-name">Name</Label>
        <Input id="sf-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Smith" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sf-role">Role</Label>
        <Input id="sf-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Lecturer" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="sf-cohorts">Assigned cohorts (comma-separated)</Label>
        <Input id="sf-cohorts" value={cohorts} onChange={(e) => setCohorts(e.target.value)} placeholder="BSc Computer Science, MSc Data Science" />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <Label htmlFor="sf-active">Active</Label>
        <Switch id="sf-active" checked={active} onCheckedChange={setActive} />
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={submit}>Save</Button>
      </div>
    </div>
  );
}