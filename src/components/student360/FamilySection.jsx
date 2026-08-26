import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Users, Link2, Phone, Mail, Plus, ArrowRight } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { canSeeFamily } from "@/lib/roles";
import { guardiansForStudent, studentById, RELATIONSHIP_META } from "@/lib/records";

export default function FamilySection({ studentId }) {
  const navigate = useNavigate();
  const { role } = useRole();
  const canAdd = canSeeFamily(role) && (role === "admissions" || role === "registry_manager" || role === "admin" || role === "ceo" || role === "quality_manager");
  const [guardians, setGuardians] = useState(guardiansForStudent(studentId));
  const [adding, setAdding] = useState(false);

  const sibling = guardians
    .map((g) => g.sibling_student_id)
    .filter(Boolean)
    .map((id) => studentById(id))
    .find(Boolean);

  const handleAdd = (data) => {
    setGuardians((prev) => [
      ...prev,
      { student_id: studentId, sibling_student_id: null, ...data },
    ]);
    setAdding(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" /> Family & guardians</CardTitle>
        <CardDescription>Guardian records and sibling links for this student.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sibling && (
          <button
            onClick={() => navigate("/students")}
            className="flex w-full items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-left text-sm text-sky-800 hover:bg-sky-100 transition-colors"
          >
            <Link2 className="h-4 w-4 shrink-0" />
            <span>Linked to: <strong className="font-semibold">{sibling.name}</strong></span>
            <ArrowRight className="h-4 w-4 ml-auto" />
          </button>
        )}

        <div className="grid sm:grid-cols-2 gap-3">
          {guardians.length === 0 && (
            <div className="sm:col-span-2 rounded-lg border border-dashed border-border p-8 text-center">
              <Users className="h-6 w-6 text-muted-foreground mx-auto" />
              <div className="text-sm text-muted-foreground mt-2">No family contacts recorded</div>
              {canAdd && (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setAdding(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add guardian
                </Button>
              )}
            </div>
          )}
          {guardians.map((g, i) => {
            const meta = RELATIONSHIP_META[g.relationship] || RELATIONSHIP_META.other;
            return (
              <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-semibold">{g.name}</div>
                  <Badge className={meta.tone}>{meta.label}</Badge>
                </div>
                <div className="space-y-1.5">
                  {g.contact_email && (
                    <a href={`mailto:${g.contact_email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                      <Mail className="h-3.5 w-3.5" /> {g.contact_email}
                    </a>
                  )}
                  {g.contact_phone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" /> {g.contact_phone}
                    </div>
                  )}
                  {!g.contact_email && !g.contact_phone && (
                    <div className="text-xs text-muted-foreground">No contact details</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {guardians.length > 0 && canAdd && (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add guardian
          </Button>
        )}
      </CardContent>

      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add guardian</DialogTitle>
            <DialogDescription>Record a new family contact for this student.</DialogDescription>
          </DialogHeader>
          <GuardianForm onSave={handleAdd} onCancel={() => setAdding(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function GuardianForm({ onSave, onCancel }) {
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("parent");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      relationship,
      contact_email: email.trim(),
      contact_phone: phone.trim(),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="g-name">Name</Label>
        <Input id="g-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Robert Whitfield" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="g-rel">Relationship</Label>
        <select id="g-rel" value={relationship} onChange={(e) => setRelationship(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm">
          <option value="parent">Parent</option>
          <option value="guardian">Guardian</option>
          <option value="sibling_contact">Sibling Contact</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="g-email">Email</Label>
          <Input id="g-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="g-phone">Phone</Label>
          <Input id="g-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 …" />
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={submit}>Save guardian</Button>
      </div>
    </div>
  );
}