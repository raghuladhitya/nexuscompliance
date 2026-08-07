import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";

// Renders the plain-language status DERIVED by the translation layer
// (base44/shared/studentStatus.ts via the ComputeStudentStatus backend function).
// The label is never stored — it is always computed from Engagement /
// SessionStatus / Leaver / QualificationAwarded. Operational screens must
// only ever show this derived label, never a raw HESA status value.

const TONE = {
  "Active": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Break in Study": "bg-amber-50 text-amber-700 border-amber-200",
  "Resumed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Withdrawn": "bg-rose-50 text-rose-700 border-rose-200",
  "Transferred": "bg-violet-50 text-violet-700 border-violet-200",
  "Completed — Full Award": "bg-sky-50 text-sky-700 border-sky-200",
  "Completed — Intermediate Award": "bg-sky-50 text-sky-700 border-sky-200",
  "Outcome Pending": "bg-amber-50 text-amber-700 border-amber-200",
};

export default function StudentStatusBadge({ studentId, fallback }) {
  const [label, setLabel] = useState(fallback || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) { setLoading(false); return; }
    let alive = true;
    (async () => {
      try {
        const res = await base44.functions.invoke("ComputeStudentStatus", { student_id: studentId });
        const r = res?.data?.results?.[0];
        if (alive && r?.status_label) setLabel(r.status_label);
      } catch (e) {
        // keep fallback label
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [studentId]);

  if (!label) return null;
  const cls = TONE[label] || "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <Badge className={cls + " hover:opacity-90"}>
      {loading ? "Calculating…" : label}
    </Badge>
  );
}