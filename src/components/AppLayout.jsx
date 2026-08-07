import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, CalendarCheck, FileCheck2, BarChart3,
  GitBranch, Wallet, MessageSquare, Settings, ScrollText,
  Building2, ChevronDown, LogOut, GraduationCap, Menu, X, ShieldCheck,
  UserPlus, CalendarRange, TrendingUp
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { ROLE_LABELS } from "@/lib/roles";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true, roles: ["admin"] },
  { to: "/director", label: "Director View", icon: TrendingUp, roles: ["admin", "management"] },
  { to: "/admissions", label: "Admissions", icon: UserPlus, roles: ["admin", "admissions"] },
  { to: "/academic-structure", label: "Academic Structure", icon: CalendarRange, roles: ["admin", "academic"] },
  { to: "/students", label: "Student 360", icon: Users, roles: ["admin", "admissions", "academic", "registry", "finance", "compliance"] },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck, roles: ["admin", "academic"] },
  { to: "/hesa", label: "HESA Return", icon: FileCheck2, roles: ["admin", "registry", "compliance"] },
  { to: "/reports", label: "Report Builder", icon: BarChart3, roles: ["admin", "compliance"] },
  { to: "/withdrawals", label: "Withdrawals", icon: GitBranch, roles: ["admin", "registry"] },
  { to: "/finance", label: "Finance & Plans", icon: Wallet, roles: ["admin", "finance"] },
  { to: "/communications", label: "Communications", icon: MessageSquare, roles: ["admin", "registry"] },
  { to: "/audit", label: "Audit Log", icon: ScrollText, roles: ["admin", "compliance"] },
  { to: "/settings", label: "Admin & Settings", icon: Settings, roles: ["admin"] },
];

const INSTITUTIONS = [
  { name: "Northbrook University", short: "NU" },
  { name: "Riverside College of FE", short: "RC" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || "user";
  const navItems = NAV.filter(n => n.roles.includes(role));
  const userName = user?.full_name || user?.email || "User";
  const roleLabel = ROLE_LABELS[role] || "Staff";
  const initials = userName.split(" ").map(p => p[0] || "").slice(0, 2).join("").toUpperCase();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [instOpen, setInstOpen] = useState(false);
  const [institution, setInstitution] = useState(INSTITUTIONS[0]);

  const handleLogout = async () => {
    await base44.auth.logout("/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-white text-[15px]">Luminate</div>
          <div className="text-[11px] text-sidebar-foreground/60">Compliance & Reporting</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-slate-900/50 z-40 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed inset-y-0 left-0 w-64 z-50 animate-slide-up">
            <SidebarContent />
          </aside>
        </>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-card/80 backdrop-blur px-4 lg:px-8">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          {/* Institution switcher */}
          <div className="relative">
            <button
              onClick={() => setInstOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-card pl-2.5 pr-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-semibold">
                {institution.short}
              </div>
              <span className="font-medium hidden sm:inline">{institution.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {instOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setInstOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 w-72 rounded-xl border border-border bg-popover shadow-lg z-40 animate-scale-in overflow-hidden">
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Switch institution
                  </div>
                  {INSTITUTIONS.map((inst) => (
                    <button
                      key={inst.name}
                      onClick={() => { setInstitution(inst); setInstOpen(false); }}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left ${
                        inst.name === institution.name ? "bg-muted" : ""
                      }`}
                    >
                      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-[11px] font-semibold">
                        {inst.short}
                      </div>
                      <span className="font-medium">{inst.name}</span>
                    </button>
                  ))}
                  <div className="px-3 py-2.5 border-t border-border text-[11px] text-muted-foreground">
                    Each institution's data is fully separate.
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Data isolated
            </div>
            <div className="flex items-center gap-2.5 rounded-lg pl-1.5 pr-3 py-1 border border-border bg-card">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xs font-semibold">
                {initials}
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-xs font-semibold">{userName}</div>
                <div className="text-[11px] text-muted-foreground">{roleLabel}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Persistent institution banner */}
        <div className="bg-primary/5 border-b border-border">
          <div className="flex items-center gap-2 px-4 lg:px-8 py-2 text-xs text-primary">
            <Building2 className="h-3.5 w-3.5" />
            <span>You are viewing: <strong className="font-semibold">{institution.name}</strong></span>
            <span className="text-muted-foreground">· data is fully isolated from other institutions</span>
          </div>
        </div>

        <main className="px-4 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}