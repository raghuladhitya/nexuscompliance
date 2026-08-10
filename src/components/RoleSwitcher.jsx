import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Check } from "lucide-react";
import { useRole } from "@/lib/RoleContext";
import { ROLE_LIST } from "@/lib/roles";

export default function RoleSwitcher() {
  const { role, roleConfig, setRole } = useRole();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 rounded-lg pl-1.5 pr-3 py-1 border border-border bg-card hover:bg-muted transition-colors"
      >
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-semibold">
          {roleConfig.initials}
        </div>
        <div className="hidden sm:block leading-tight text-left">
          <div className="text-xs font-semibold">{roleConfig.name}</div>
          <div className="text-[11px] text-muted-foreground">{roleConfig.label}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl border border-border bg-popover shadow-lg z-40 animate-scale-in overflow-hidden">
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Switch role (demo)
            </div>
            {ROLE_LIST.map((r) => (
              <button
                key={r.key}
                onClick={() => { setRole(r.key); setOpen(false); }}
                className={`flex items-start gap-3 w-full px-3 py-2.5 text-left hover:bg-muted transition-colors ${r.key === role ? "bg-muted" : ""}`}
              >
                <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-semibold shrink-0">
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    {r.label}
                    {r.key === role && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">{r.description}</div>
                </div>
              </button>
            ))}
            <div className="px-3 py-2.5 border-t border-border text-[11px] text-muted-foreground">
              Preview how each role experiences the platform.
            </div>
          </div>
        </>
      )}
    </div>
  );
}