import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Building2, Save } from "lucide-react";

const BLANK = {
  name: "", legal_name: "", ukprn: "", hesa_provider_code: "",
  address_line_1: "", town: "", postcode: "", country: "",
  website: "", main_contact_email: "", cost_centres: [],
};

export default function ProviderProfile() {
  const [inst, setInst] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(BLANK);

  const load = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Institution.list("-created_date", 10);
      setInst(data && data[0] ? data[0] : null);
    } catch (e) {
      setInst(null);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (inst) setForm({ ...BLANK, ...inst, cost_centres: inst.cost_centres || [] });
  }, [inst]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addCostCentre = () => setForm(f => ({ ...f, cost_centres: [...(f.cost_centres || []), { name: "", code: "" }] }));
  const setCostCentre = (i, k, v) => setForm(f => ({ ...f, cost_centres: f.cost_centres.map((c, j) => j === i ? { ...c, [k]: v } : c) }));
  const removeCostCentre = (i) => setForm(f => ({ ...f, cost_centres: f.cost_centres.filter((_, j) => j !== i) }));

  const save = async () => {
    if (!form.name) { setError("Provider name is required."); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        name: form.name,
        legal_name: form.legal_name || undefined,
        ukprn: form.ukprn || undefined,
        hesa_provider_code: form.hesa_provider_code || undefined,
        address_line_1: form.address_line_1 || undefined,
        town: form.town || undefined,
        postcode: form.postcode || undefined,
        country: form.country || undefined,
        website: form.website || undefined,
        main_contact_email: form.main_contact_email || undefined,
        cost_centres: (form.cost_centres || []).filter(c => c.name && c.code),
      };
      if (inst) await base44.entities.Institution.update(inst.id, payload);
      else await base44.entities.Institution.create(payload);
      await load();
    } catch (e) {
      setError(e?.message || "Couldn't save provider profile.");
    }
    setSaving(false);
  };

  if (loading) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading provider profile…</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Provider Profile</CardTitle>
        <CardDescription>Institution-wide HESA reference data — UKPRN, provider code, cost centres and address. Not student-level.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Provider name *</Label><Input value={form.name || ""} onChange={e => setField("name", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Legal name</Label><Input value={form.legal_name || ""} onChange={e => setField("legal_name", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>UKPRN</Label><Input value={form.ukprn || ""} onChange={e => setField("ukprn", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>HESA provider code</Label><Input value={form.hesa_provider_code || ""} onChange={e => setField("hesa_provider_code", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Address line 1</Label><Input value={form.address_line_1 || ""} onChange={e => setField("address_line_1", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Town</Label><Input value={form.town || ""} onChange={e => setField("town", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Postcode</Label><Input value={form.postcode || ""} onChange={e => setField("postcode", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Country</Label><Input value={form.country || ""} onChange={e => setField("country", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Website</Label><Input value={form.website || ""} onChange={e => setField("website", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Main contact email</Label><Input value={form.main_contact_email || ""} onChange={e => setField("main_contact_email", e.target.value)} /></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-medium">HESA Cost Centres</div>
              <div className="text-xs text-muted-foreground">Add, edit or remove cost centres for this institution.</div>
            </div>
            <Button variant="outline" size="sm" onClick={addCostCentre}><Plus className="h-4 w-4 mr-1" /> Add cost centre</Button>
          </div>
          <div className="space-y-2">
            {(form.cost_centres || []).map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Input placeholder="Name" value={c.name} onChange={e => setCostCentre(i, "name", e.target.value)} className="flex-1" />
                <Input placeholder="Code" value={c.code} onChange={e => setCostCentre(i, "code", e.target.value)} className="w-32" />
                <button onClick={() => removeCostCentre(i)} className="text-muted-foreground hover:text-rose-600 p-2"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            {(!form.cost_centres || form.cost_centres.length === 0) && <div className="text-xs text-muted-foreground">No cost centres yet.</div>}
          </div>
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}
        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}><Save className="h-4 w-4 mr-2" /> {saving ? "Saving…" : "Save provider profile"}</Button>
        </div>
      </CardContent>
    </Card>
  );
}