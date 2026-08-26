import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { staffByCohort, staffRoleTone } from "@/lib/records";

function initials(name) {
  return name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function TaughtByWidget({ cohort }) {
  const staff = staffByCohort(cohort);
  if (!staff.length) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            Taught by:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {staff.map((s) => (
              <Link
                key={s.id}
                to="/staff"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 hover:border-primary/40 hover:bg-muted transition-colors"
              >
                <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[11px] font-semibold flex items-center justify-center">
                  {initials(s.name)}
                </span>
                <span className="text-sm font-medium group-hover:text-primary">{s.name}</span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md border ${staffRoleTone(s.role)}`}>{s.role}</span>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}