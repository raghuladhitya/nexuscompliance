import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShieldCheck, Info } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { VERIFICATION_TYPES, VERIFICATION_STATUS_META, DOCUMENT_VERIFICATIONS } from "@/lib/verificationModel";
import { STAFF } from "@/lib/records";

// Admissions, Registry and admin-equivalent roles can update verification statuses.
const canVerify = (r) => ["admissions", "registry_manager", "admin", "ceo", "quality_manager"].includes(r);

export default function VerificationSection({ studentId }) {
  const { role } = useRole();
  const editable = canVerify(role);
  const [records, setRecords] = useState(() => {
    const existing = DOCUMENT_VERIFICATIONS.filter((v) => v.student_id === studentId);
    return VERIFICATION_TYPES.map((t) => {
      const rec = existing.find((e) => e.verification_type === t.value);
      return rec || { student_id: studentId, verification_type: t.value, verification_status: "not_provided", verified_by: null, verified_date: null };
    });
  });

  const update = (type, status) => {
    setRecords((prev) => prev.map((r) => r.verification_type === type
      ? {
          ...r,
          verification_status: status,
          verified_by: status === "verified_clear" ? "STF-004" : r.verified_by,
          verified_date: status === "verified_clear" ? new Date().toISOString().slice(0, 10) : r.verified_date,
        }
      : r));
  };

  const staffName = (id) => { const s = STAFF.find((x) => x.id === id); return s ? s.name : id; };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Document verification</CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" /> Attestation only — verification happens outside this tool. No documents are uploaded here.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {records.map((r) => {
          const type = VERIFICATION_TYPES.find((t) => t.value === r.verification_type);
          const meta = VERIFICATION_STATUS_META[r.verification_status];
          return (
            <div key={r.verification_type} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{type.label}</div>
                <div className="text-xs text-muted-foreground">
                  {r.verified_by ? `Verified by ${staffName(r.verified_by)} · ${r.verified_date}` : "Not yet verified"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
                {editable && (
                  <select
                    value={r.verification_status}
                    onChange={(e) => update(r.verification_type, e.target.value)}
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                  >
                    {Object.entries(VERIFICATION_STATUS_META).map(([k, m]) => <option key={k} value={k}>{m.label}</option>)}
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}