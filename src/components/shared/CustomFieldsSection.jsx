import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ListPlus, Save } from "lucide-react";
import { CUSTOM_FIELD_DEFINITIONS, CUSTOM_FIELD_VALUES } from "@/lib/customFieldsModel";

// Renders institution-defined custom fields for a given entity record as editable inputs.
// Values are sourced from CustomFieldValue (mock store) and edited locally.
export default function CustomFieldsSection({ entityName, entityId }) {
  const defs = CUSTOM_FIELD_DEFINITIONS.filter((d) => d.entity_name === entityName);
  const [values, setValues] = useState(() => {
    const map = {};
    CUSTOM_FIELD_VALUES.filter((v) => v.entity_id === entityId).forEach((v) => { map[v.field_definition_id] = v.value; });
    return map;
  });
  const [saved, setSaved] = useState(false);

  if (!defs.length) return null;

  const setVal = (id, val) => { setValues((p) => ({ ...p, [id]: val })); setSaved(false); };
  const save = () => setSaved(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><ListPlus className="h-4 w-4 text-primary" /> Custom fields</CardTitle>
        <CardDescription>Institution-defined fields for this {entityName.toLowerCase()} record.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {defs.map((d) => (
          <div key={d.id} className="space-y-1.5">
            <Label htmlFor={`cf-${d.id}`}>{d.field_label}</Label>
            {d.field_type === "boolean" ? (
              <div className="flex items-center gap-2 h-9">
                <Switch id={`cf-${d.id}`} checked={values[d.id] === "true"} onCheckedChange={(v) => setVal(d.id, v ? "true" : "false")} />
                <span className="text-sm text-muted-foreground">{values[d.id] === "true" ? "Yes" : "No"}</span>
              </div>
            ) : d.field_type === "select" ? (
              <select id={`cf-${d.id}`} value={values[d.id] || ""} onChange={(e) => setVal(d.id, e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm">
                <option value="">Select…</option>
                {(d.select_options || []).map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <Input id={`cf-${d.id}`} type={d.field_type === "number" ? "number" : d.field_type === "date" ? "date" : "text"} value={values[d.id] || ""} onChange={(e) => setVal(d.id, e.target.value)} />
            )}
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" onClick={save}><Save className="h-4 w-4 mr-1" /> Save values</Button>
          {saved && <span className="text-xs text-emerald-600">Saved</span>}
        </div>
      </CardContent>
    </Card>
  );
}