import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { ROLES } from "@/lib/roles";

const RoleContext = createContext({
  role: "ceo",
  roleConfig: ROLES.ceo,
  setRole: () => {},
  isDemo: false,
});
const STORAGE_KEY = "luminate.demoRole";

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();
  const [demoRole, setDemoRole] = useState(() => localStorage.getItem(STORAGE_KEY) || null);

  const mappedRole = (() => {
    const r = user?.role;
    return r && ROLES[r] ? r : null;
  })();

  const effectiveRole = demoRole || mappedRole || "ceo";

  useEffect(() => {
    if (demoRole) localStorage.setItem(STORAGE_KEY, demoRole);
    else localStorage.removeItem(STORAGE_KEY);
  }, [demoRole]);

  const setRole = (key) => setDemoRole(key);

  return (
    <RoleContext.Provider
      value={{
        role: effectiveRole,
        roleConfig: ROLES[effectiveRole],
        setRole,
        isDemo: !!demoRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);