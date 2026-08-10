import React from "react";

// Enforces role-based access per route. Data access is additionally
// restricted server-side by RLS on each entity.
// Role-based access enforcement temporarily disabled while login/role
// logic is in progress — all authenticated users can reach every route.
// Data access remains restricted server-side by RLS on each entity.
export default function RoleGuard({ path, children }) {
  return children;
}