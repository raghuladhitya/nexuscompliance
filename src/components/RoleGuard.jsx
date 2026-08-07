import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { canAccess, homeForRole } from "@/lib/roles";

// Enforces role-based access per route. Data access is additionally
// restricted server-side by RLS on each entity.
export default function RoleGuard({ path, children }) {
  const { user } = useAuth();
  if (!canAccess(user?.role, path)) {
    return <Navigate to={homeForRole(user?.role)} replace />;
  }
  return children;
}