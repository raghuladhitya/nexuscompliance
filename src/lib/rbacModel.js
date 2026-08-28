// Mock RBAC data (Role, Permission, RolePermission) — institution-scoped.
// Institution id "NU" = Northbrook University (the active institution in AppLayout).

export const PERMISSIONS = [
  { name: "view_students", description: "View student records" },
  { name: "edit_records", description: "Edit student records" },
  { name: "manage_withdrawals", description: "Process withdrawals & COC" },
  { name: "hesa_submit", description: "Submit HESA returns" },
  { name: "manage_finance", description: "Manage finance & fees" },
  { name: "view_audit", description: "View audit log" },
  { name: "manage_staff", description: "Manage staff directory" },
  { name: "manage_roles", description: "Manage roles & permissions" },
];

export const ROLES = [
  { id: "role_001", name: "Registry", permission_names: ["view_students", "edit_records", "manage_withdrawals", "view_audit"] },
  { id: "role_002", name: "Compliance", permission_names: ["view_students", "hesa_submit", "view_audit"] },
  { id: "role_003", name: "Finance", permission_names: ["view_students", "manage_finance"] },
  { id: "role_004", name: "Academic", permission_names: ["view_students", "edit_records"] },
  { id: "role_005", name: "Senior Management", permission_names: ["view_students", "hesa_submit", "manage_finance", "view_audit", "manage_staff"] },
];

export const roleNames = () => ROLES.map((r) => r.name);
export const permissionByName = (name) => PERMISSIONS.find((p) => p.name === name);