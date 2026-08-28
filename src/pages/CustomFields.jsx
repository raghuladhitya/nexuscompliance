import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ListPlus } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { CUSTOM_FIELD_DEFINITIONS, ENTITY_OPTIONS, FIELD_TYPES } from "@/lib/customFieldsModel";

export default function CustomFields() {
  const [defs, setDefs] = useState(() => CUSTOM_FIELD_DEFINITIONS.map((d) => ({ ...d, select_options: d.select_options ? [...d.select_options] : [] })));
  const [entity, setEntity] = useState("Student");
  const [label, setLabel] = useState("");
  const [type, setType] = useState("text");
  const [options, setOptions] = useState("");

  const add = () => {
    if (!label.trim()) return;
    setDefs((prev) => [...prev, {
      id: `cf_${Date.now()}`,
      entity_name: entity,
      field_label: label.trim(),
      field_type: type,
      select_options: type === "select" ? options.split(",").map((o) => o.trim()).filter(Boolean) : [],
    }]);
    setLabel("");
    setOptions("");
  };

  const remove = (id) => setDefs((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Custom Fields" description="Define extra fields for any entity — they appear automatically on the relevant record pages." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><ListPlus className="h-4 w-4 text-primary" /> Define a new field</CardTitle>
          <CardDescription>Choose the entity, label and field type. For select fields, enter comma-separated options.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label>Entity</Label>
            <select value={entity} onChange={(e) => setEntity(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm">
              {ENTITY_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Field label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Sponsor reference" />
          </div>
          <div className="space-y-1.5">
            <Label>Field type</Label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm">
              {FIELD_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Options (select only)</Label>
            <Input value={options} onChange={(e) => setOptions(e.target.value)} placeholder="Option A, Option B" disabled={type !== "select"} />
          </div>
          <div className="sm:col-span-2 lg:col-span-4">
            <Button onClick={add}><Plus className="h-4 w-4 mr-1" /> Add field</Button>
          </div>
        </CardContent>
      </Card>

      {ENTITY_OPTIONS.map((ent) => {
        const list = defs.filter((d) => d.entity_name === ent);
        if (!list.length) return null;
        return (
          <Card key={ent}>
            <CardHeader>
              <CardTitle className="text-base">{ent} fields</CardTitle>
              <CardDescription>{list.length} custom field{list.length === 1 ? "" : "s"} defined.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {list.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-sm font-medium">{d.field_label}</div>
                    <Badge variant="outline" className="font-normal">{d.field_type}</Badge>
                    {d.field_type === "select" && <span className="text-xs text-muted-foreground">{(d.select_options || []).join(", ")}</span>}
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => remove(d.id)} title="Remove field"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}