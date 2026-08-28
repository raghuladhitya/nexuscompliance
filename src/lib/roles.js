export const ALL_PAGES = [
  "/", "/students", "/attendance", "/hesa", "/reports", "/withdrawals",
  "/finance", "/communications", "/settings", "/audit", "/staff", "/funding-status",
  "/roles", "/custom-fields",
];

const FULL = ALL_PAGES;

export const ROLES = {
  ceo: {
    key: "ceo", label: "CEO", name: "Alex Morgan", initials: "AM",
    description: "Full access to every tool and all institutional data.", home: "/", allowed: FULL,
  },
  quality_manager: {
    key: "quality_manager", label: "Quality Manager", name: "Sam Patel", initials: "SP",
    description: "Full access to every tool and all institutional data.", home: "/", allowed: FULL,
  },
  admin: {
    key: "admin", label: "Administrator", name: "Robin Hale", initials: "RH",
    description: "Manages staff, cohorts and system settings. Full access.", home: "/", allowed: FULL,
  },
  management: {
    key: "management", label: "Management", name: "Evelyn Brooks", initials: "EB",
    description: "Director-level oversight across attendance, funding and staff.",
    home: "/",
    allowed: ["/", "/students", "/attendance", "/finance", "/funding-status", "/staff", "/audit", "/reports", "/communications"],
  },
  registry_manager: {
    key: "registry_manager", label: "Registry Manager", name: "Dana Roberts", initials: "DR",
    description: "Student records, attendance, withdrawals, communications and funding status.",
    home: "/students",
    allowed: ["/students", "/attendance", "/withdrawals", "/communications", "/audit", "/funding-status", "/staff"],
  },
  admissions: {
    key: "admissions", label: "Admissions", name: "Chris Vaughan", initials: "CV",
    description: "Applicant and student records, family links and communications.",
    home: "/students",
    allowed: ["/students", "/attendance", "/communications", "/audit", "/staff"],
  },
  academic: {
    key: "academic", label: "Academic", name: "Dr. Helen Carter", initials: "HC",
    description: "Attendance records, student profiles and staff directory.",
    home: "/attendance",
    allowed: ["/students", "/attendance", "/staff", "/audit"],
  },
  finance_manager: {
    key: "finance_manager", label: "Finance Manager", name: "Jordan Lee", initials: "JL",
    description: "Student finance, payment plans, funding status and withdrawals.",
    home: "/finance",
    allowed: ["/finance", "/students", "/withdrawals", "/audit", "/funding-status", "/staff"],
  },
};

export const ROLE_LIST = Object.values(ROLES);

export function isAllowed(roleKey, path) {
  const role = ROLES[roleKey] || ROLES.ceo;
  return role.allowed.includes(path);
}

const FULL_ACCESS = ["ceo", "quality_manager", "admin"];
export const canSeeFamily = (r) => ["admissions", "registry_manager", ...FULL_ACCESS].includes(r);
export const canSeeDrillDown = (r) => ["academic", ...FULL_ACCESS].includes(r);
export const canSeeNotApproved = (r) => ["registry_manager", "management", "finance_manager", ...FULL_ACCESS].includes(r);
export const canEditStaff = (r) => r === "admin";

// Director-level oversight roles see aggregate counts only — never individual student names.
export const isAggregateOnlyRole = (r) => ["ceo", "management", "quality_manager"].includes(r);