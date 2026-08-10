export const ROLES = {
  ceo: {
    key: "ceo",
    label: "CEO",
    name: "Alex Morgan",
    initials: "AM",
    description: "Full access to every tool and all institutional data.",
    home: "/",
    allowed: ["/", "/students", "/attendance", "/hesa", "/reports", "/withdrawals", "/finance", "/communications", "/settings", "/audit"],
  },
  quality_manager: {
    key: "quality_manager",
    label: "Quality Manager",
    name: "Sam Patel",
    initials: "SP",
    description: "Full access to every tool and all institutional data.",
    home: "/",
    allowed: ["/", "/students", "/attendance", "/hesa", "/reports", "/withdrawals", "/finance", "/communications", "/settings", "/audit"],
  },
  registry_manager: {
    key: "registry_manager",
    label: "Registry Manager",
    name: "Dana Roberts",
    initials: "DR",
    description: "Student records, attendance, withdrawals and communications.",
    home: "/students",
    allowed: ["/students", "/attendance", "/withdrawals", "/communications", "/audit"],
  },
  finance_manager: {
    key: "finance_manager",
    label: "Finance Manager",
    name: "Jordan Lee",
    initials: "JL",
    description: "Student finance, payment plans and withdrawal finance.",
    home: "/finance",
    allowed: ["/finance", "/students", "/withdrawals", "/audit"],
  },
};

export const ROLE_LIST = Object.values(ROLES);

export function isAllowed(roleKey, path) {
  const role = ROLES[roleKey] || ROLES.ceo;
  return role.allowed.includes(path);
}