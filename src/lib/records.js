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
  { student_id: "STU-2021-4471", name: "Robert Whitfield", relationship: "Father", contact: "+44 7700 900123", sibling_student_id: null },
  { student_id: "STU-2021-4471", name: "Mary Whitfield", relationship: "Mother", contact: "mary.w@email.com", sibling_student_id: "STU-2023-9920" },
  { student_id: "STU-2021-3390", name: "Anita Nair", relationship: "Mother", contact: "+44 7700 900456", sibling_student_id: null },
  { student_id: "STU-2023-9981", name: "Kofi Osei", relationship: "Father", contact: "+44 7700 900789", sibling_student_id: null },
  { student_id: "STU-2022-1120", name: "Imran Khan", relationship: "Father", contact: "imran.khan@email.com", sibling_student_id: "STU-2021-7782" },
];

export const STAFF = [
  { id: "STF-001", name: "Dr. Helen Carter", role: "Senior Lecturer", cohorts: ["BSc Computer Science", "MSc Data Science"], units: ["Algorithms", "Machine Learning"], active: true },
  { id: "STF-002", name: "Prof. David Singh", role: "Professor", cohorts: ["BSc Data Science"], units: ["Data Structures", "Databases"], active: true },
  { id: "STF-003", name: "Maria Lopez", role: "Lecturer", cohorts: ["CertHE Computing"], units: ["Intro to Computing"], active: true },
  { id: "STF-004", name: "James O'Brien", role: "Registrar", cohorts: [], units: [], active: true },
  { id: "STF-005", name: "Sarah Chen", role: "Finance Officer", cohorts: [], units: [], active: false },
];

const ATTENDANCE_PATTERN = {
  "STU-2021-3390": [1, 1, 0, 1, 0, 1, 0, 0, 1, 0],
  "STU-2021-4471": [1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
  "STU-2023-9981": [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  "STU-2022-1120": [1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
  "STU-2021-7782": [1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  "STU-2023-4410": [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  "STU-2023-9920": [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
};

export const ATTENDANCE_RECORDS = STUDENTS.flatMap((s) =>
  Array.from({ length: 10 }, (_, i) => ({
    student_id: s.id,
    cohort: s.cohort,
    date: `Week ${i + 1}`,
    session: `Session ${i + 1}`,
    attended: ATTENDANCE_PATTERN[s.id] ? ATTENDANCE_PATTERN[s.id][i] === 1 : false,
  }))
);

export const FUNDING_STATUSES = [
  { student_id: "STU-2021-4471", funding_source: "Student Loan Company", stp_status: "Approved", learner_approved: true },
  { student_id: "STU-2021-3390", funding_source: "Student Loan Company", stp_status: "Pending", learner_approved: false },
  { student_id: "STU-2023-9981", funding_source: "Self-funded", stp_status: "N/A", learner_approved: true },
  { student_id: "STU-2022-1120", funding_source: "Student Loan Company", stp_status: "Approved", learner_approved: false },
  { student_id: "STU-2021-7782", funding_source: "Student Loan Company", stp_status: "Approved", learner_approved: true },
  { student_id: "STU-2023-4410", funding_source: "Student Loan Company", stp_status: "Pending", learner_approved: false },
  { student_id: "STU-2023-9920", funding_source: "Self-funded", stp_status: "N/A", learner_approved: true },
];

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