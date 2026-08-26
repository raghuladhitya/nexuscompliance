// Shared mock record data for Family, Staff, Attendance and Funding features.

export const STUDENTS = [
  { id: "STU-2021-4471", name: "James Whitfield", email: "j.whitfield@northbrook.ac.uk", course: "BSc Data Science", cohort: "BSc Data Science", status: "Withdrawn" },
  { id: "STU-2021-3390", name: "Priya Nair", email: "p.nair@northbrook.ac.uk", course: "BSc Computer Science", cohort: "BSc Computer Science", status: "At risk" },
  { id: "STU-2023-9981", name: "Marcus Osei", email: "m.osei@northbrook.ac.uk", course: "CertHE Computing", cohort: "CertHE Computing", status: "Active" },
  { id: "STU-2022-1120", name: "Aisha Khan", email: "a.khan@northbrook.ac.uk", course: "BSc Data Science", cohort: "BSc Data Science", status: "Active" },
  { id: "STU-2021-7782", name: "Liam Boyd", email: "l.boyd@northbrook.ac.uk", course: "BSc Computer Science", cohort: "BSc Computer Science", status: "Active" },
  { id: "STU-2023-4410", name: "Sara Müller", email: "s.muller@northbrook.ac.uk", course: "MSc Data Science", cohort: "MSc Data Science", status: "Active" },
  { id: "STU-2023-9920", name: "J. Whitfield", email: "jamesw@northbrook.ac.uk", course: "CertHE Computing", cohort: "CertHE Computing", status: "Active" },
];

export const GUARDIANS = [
  { student_id: "STU-2021-4471", name: "Robert Whitfield", relationship: "parent", contact_email: "", contact_phone: "+44 7700 900123", sibling_student_id: null },
  { student_id: "STU-2021-4471", name: "Mary Whitfield", relationship: "parent", contact_email: "mary.w@email.com", contact_phone: "", sibling_student_id: "STU-2023-9920" },
  { student_id: "STU-2021-3390", name: "Anita Nair", relationship: "parent", contact_email: "", contact_phone: "+44 7700 900456", sibling_student_id: null },
  { student_id: "STU-2023-9981", name: "Kofi Osei", relationship: "guardian", contact_email: "", contact_phone: "+44 7700 900789", sibling_student_id: null },
  { student_id: "STU-2022-1120", name: "Imran Khan", relationship: "parent", contact_email: "imran.khan@email.com", contact_phone: "", sibling_student_id: "STU-2021-7782" },
];

export const STAFF = [
  { id: "STF-001", name: "Dr. Helen Carter", role: "Senior Lecturer", cohorts: ["BSc Computer Science", "MSc Data Science"], units: ["Algorithms", "Machine Learning"], active: true },
  { id: "STF-002", name: "Prof. David Singh", role: "Professor", cohorts: ["BSc Data Science"], units: ["Data Structures", "Databases"], active: true },
  { id: "STF-003", name: "Maria Lopez", role: "Lecturer", cohorts: ["CertHE Computing"], units: ["Intro to Computing"], active: true },
  { id: "STF-004", name: "James O'Brien", role: "Registrar", cohorts: [], units: [], active: true },
  { id: "STF-005", name: "Sarah Chen", role: "Finance Officer", cohorts: [], units: [], active: false },
];

const COHORT_UNITS = {
  "BSc Data Science": ["Data Structures", "Databases", "Machine Learning", "Statistics", "Data Ethics"],
  "BSc Computer Science": ["Algorithms", "Programming", "Operating Systems", "Networks", "AI Foundations"],
  "CertHE Computing": ["Intro to Computing", "Web Fundamentals", "Maths for Computing"],
  "MSc Data Science": ["Advanced ML", "Big Data Systems", "Research Methods"],
};

const ATTENDANCE_PATTERN = {
  "STU-2021-3390": [1, 1, 0, 1, 0, 1, 0, 0, 1, 0],
  "STU-2021-4471": [1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
  "STU-2023-9981": [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  "STU-2022-1120": [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  "STU-2021-7782": [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  "STU-2023-4410": [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  "STU-2023-9920": [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(d) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
const START_DATE = new Date(2026, 0, 12);

export const ATTENDANCE_RECORDS = STUDENTS.flatMap((s) => {
  const units = COHORT_UNITS[s.cohort] || ["General"];
  return Array.from({ length: 10 }, (_, i) => {
    const present = ATTENDANCE_PATTERN[s.id] ? ATTENDANCE_PATTERN[s.id][i] === 1 : false;
    let status;
    if (present) status = i % 5 === 2 ? "late" : "present";
    else status = i % 2 === 0 ? "absent" : "authorized_absence";
    const d = new Date(START_DATE.getTime() + i * 7 * 24 * 60 * 60 * 1000);
    return {
      student_id: s.id,
      cohort: s.cohort,
      date: formatDate(d),
      session: `Session ${i + 1}`,
      unit: units[i % units.length],
      status,
      attended: status === "present" || status === "late",
    };
  });
});

export const FUNDING_STATUSES = [
  { student_id: "STU-2021-4471", funding_source: "Student Loan Company", stp_status: "confirmed", learner_approved: true, date_checked: "2026-08-12" },
  { student_id: "STU-2021-3390", funding_source: "Student Loan Company", stp_status: "pending", learner_approved: false, date_checked: "2026-08-14" },
  { student_id: "STU-2023-9981", funding_source: "Self-funded", stp_status: "n/a", learner_approved: true, date_checked: "2026-08-10" },
  { student_id: "STU-2022-1120", funding_source: "Student Loan Company", stp_status: "pending", learner_approved: false, date_checked: "2026-08-15" },
  { student_id: "STU-2021-7782", funding_source: "Student Loan Company", stp_status: "confirmed", learner_approved: true, date_checked: "2026-08-09" },
  { student_id: "STU-2023-4410", funding_source: "Student Loan Company", stp_status: "rejected", learner_approved: false, date_checked: "2026-08-16" },
  { student_id: "STU-2023-9920", funding_source: "Self-funded", stp_status: "n/a", learner_approved: true, date_checked: "2026-08-11" },
];

// Status metadata (labels + tone classes) shared across modules
export const ATTENDANCE_STATUS_META = {
  present: { label: "Present", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  late: { label: "Late", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  absent: { label: "Absent", tone: "bg-rose-50 text-rose-700 border-rose-200" },
  authorized_absence: { label: "Authorized Absence", tone: "bg-sky-50 text-sky-700 border-sky-200" },
};

export const STP_STATUS_META = {
  confirmed: { label: "Confirmed", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  rejected: { label: "Rejected", tone: "bg-rose-50 text-rose-700 border-rose-200" },
  "n/a": { label: "N/A", tone: "bg-slate-100 text-slate-600 border-slate-200" },
};

export const RELATIONSHIP_META = {
  parent: { label: "Parent", tone: "bg-sky-50 text-sky-700 border-sky-200" },
  guardian: { label: "Guardian", tone: "bg-violet-50 text-violet-700 border-violet-200" },
  sibling_contact: { label: "Sibling Contact", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  other: { label: "Other", tone: "bg-slate-100 text-slate-600 border-slate-200" },
};

export const STAFF_ROLE_TONE = {
  teaching: "bg-sky-50 text-sky-700 border-sky-200",
  registry: "bg-violet-50 text-violet-700 border-violet-200",
  finance: "bg-emerald-50 text-emerald-700 border-emerald-200",
  other: "bg-slate-100 text-slate-600 border-slate-200",
};

export function staffRoleTone(role) {
  const r = role.toLowerCase();
  if (r.includes("lecturer") || r.includes("professor")) return STAFF_ROLE_TONE.teaching;
  if (r.includes("registrar")) return STAFF_ROLE_TONE.registry;
  if (r.includes("finance")) return STAFF_ROLE_TONE.finance;
  return STAFF_ROLE_TONE.other;
}

// Helpers
export const studentById = (id) => STUDENTS.find((s) => s.id === id);

export function attendancePctForStudent(id) {
  const recs = ATTENDANCE_RECORDS.filter((r) => r.student_id === id);
  if (!recs.length) return 0;
  return Math.round((recs.filter((r) => r.attended).length / recs.length) * 100);
}

export function attendancePctForCohort(cohort) {
  const recs = ATTENDANCE_RECORDS.filter((r) => r.cohort === cohort);
  if (!recs.length) return 0;
  return Math.round((recs.filter((r) => r.attended).length / recs.length) * 100);
}

export function overallAttendancePct() {
  if (!ATTENDANCE_RECORDS.length) return 0;
  return Math.round((ATTENDANCE_RECORDS.filter((r) => r.attended).length / ATTENDANCE_RECORDS.length) * 100);
}

export function cohorts() {
  return [...new Set(STUDENTS.map((s) => s.cohort))];
}

export function recordsForStudent(id) {
  return ATTENDANCE_RECORDS.filter((r) => r.student_id === id);
}

export function guardiansForStudent(id) {
  return GUARDIANS.filter((g) => g.student_id === id);
}

export function fundingForStudent(id) {
  return FUNDING_STATUSES.find((f) => f.student_id === id);
}

export function notApprovedLearners() {
  return FUNDING_STATUSES
    .filter((f) => !f.learner_approved)
    .map((f) => ({ ...studentById(f.student_id), ...f }))
    .filter((x) => x.id);
}

export function familyLinkedStudentCount() {
  return new Set(GUARDIANS.map((g) => g.student_id)).size;
}

export function staffHeadcount() {
  return STAFF.filter((s) => s.active).length;
}

export function staffByCohort(cohort) {
  return STAFF.filter((s) => s.cohorts.includes(cohort));
}

export function formatDateString(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}