import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONES = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  warning: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  bad: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50",
  info: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50",
  neutral: "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100",
  violet: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50",
};

export function StatusBadge({ tone = "neutral", className, children }) {
  return <Badge className={cn(TONES[tone] || TONES.neutral, className)}>{children}</Badge>;
}

export default StatusBadge;