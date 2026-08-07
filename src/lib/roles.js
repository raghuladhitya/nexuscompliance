// Role -> route access map and helpers.
// Each route lists the roles allowed to access it. Sidebar nav items are
// filtered by the same roles, and RoleGuard enforces access server-side-aware
// at the route level (RLS on each entity enforces data access).

export const ROUTE_ROLES = {
  "/": ["admin"],
  "/director": ["admin", "management"],
  "/admissions": ["admin", "admissions"],
  "/academic-structure": ["admin", "academic"],
  "/students": ["admin", "admissions", "academic", "registry", "finance", "compliance"],
  "/attendance": ["admin", "academic"],
  "/hesa": ["admin", "registry", "compliance"],
  "/reports": ["admin", "compliance"],
  "/withdrawals": ["admin", "registry"],
  "/finance": ["admin", "finance"],
  "/communications": ["admin", "registry"],
  "/audit": ["admin", "compliance"],
  "/settings": ["admin"],
};

export const ROLE_LABELS = {
  admin: "Administrator",
  admissions: "Admissions",
  academic: "Academic",
  registry: "Registry",
  finance: "Finance",
  compliance: "Compliance",
  management: "Director",
  user: "Staff",
};

export function canAccess(role, path) {
  const allowed = ROUTE_ROLES[path];
  if (!allowed) return true;
  return allowed.includes(role || "user");
}

export function homeForRole(role) {
  const map = {
    admissions: "/admissions",
    academic: "/academic-structure",
    registry: "/students",
    finance: "/finance",
    compliance: "/hesa",
    management: "/director",
    admin: "/",
  };
  return map[role] || "/";
}