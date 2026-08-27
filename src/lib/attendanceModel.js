// Session-based attendance model mirroring the Course/Term/Unit/Enrolment/
// ScheduledSession/AttendanceRecord entities. Mock data is generated
// deterministically so the Attendance tab can compute real attendance
// from scheduled sessions, enrolment windows and recorded status.
import { STUDENTS } from "@/lib/records";

export const COURSES = [
  { id: "CRS-CS", course_code: "CS-101", name: "BSc Computer Science", institution_id: "INST-001", level: "undergraduate" },
  { id: "CRS-DS", course_code: "DS-201", name: "BSc Data Science", institution_id: "INST-001", level: "undergraduate" },
  { id: "CRS-CERT", course_code: "CERT-101", name: "CertHE Computing", institution_id: "INST-001", level: "foundation" },
  { id: "CRS-MSDS", course_code: "MSDS-301", name: "MSc Data Science", institution_id: "INST-001", level: "postgraduate" },
];

export const TERMS = [
  { id: "T1", name: "Term 1", academic_year: "2025/26", start_date: "2025-09-08", end_date: "2025-12-12", week_count: 12 },
  { id: "T2", name: "Term 2", academic_year: "2025/26", start_date: "2026-01-12", end_date: "2026-03-20", week_count: 10 },
  { id: "T3", name: "Term 3", academic_year: "2025/26", start_date: "2026-04-13", end_date: "2026-06-19", week_count: 10 },
];

export const UNITS = [
  { id: "U-CS-ALG", unit_code: "CS-ALG", name: "Algorithms", course_id: "CRS-CS", sessions_per_week: 1 },
  { id: "U-CS-PROG", unit_code: "CS-PROG", name: "Programming", course_id: "CRS-CS", sessions_per_week: 1 },
  { id: "U-DS-DS", unit_code: "DS-DS", name: "Data Structures", course_id: "CRS-DS", sessions_per_week: 1 },
  { id: "U-DS-DB", unit_code: "DS-DB", name: "Databases", course_id: "CRS-DS", sessions_per_week: 1 },
  { id: "U-CE-INTRO", unit_code: "CE-INTRO", name: "Intro to Computing", course_id: "CRS-CERT", sessions_per_week: 1 },
  { id: "U-CE-WEB", unit_code: "CE-WEB", name: "Web Fundamentals", course_id: "CRS-CERT", sessions_per_week: 1 },
  { id: "U-MS-AML", unit_code: "MS-AML", name: "Advanced ML", course_id: "CRS-MSDS", sessions_per_week: 1 },
  { id: "U-MS-BDS", unit_code: "MS-BDS", name: "Big Data Systems", course_id: "CRS-MSDS", sessions_per_week: 1 },
];

const COURSE_BY_COHORT = Object.fromEntries(COURSES.map((c) => [c.name, c.id]));
const UNITS_BY_COURSE = {};
UNITS.forEach((u) => { (UNITS_BY_COURSE[u.course_id] ||= []).push(u); });

// Late joiner starts mid-T1; withdrawn student's enrolment ends mid-T2.
const LATE_JOINERS = { "STU-2023-4410": "2025-10-06" };
const WITHDRAWN = { "STU-2021-4471": "2026-02-13" };

export const ENROLMENTS = STUDENTS.flatMap((s) => {
  const courseId = COURSE_BY_COHORT[s.cohort];
  const units = UNITS_BY_COURSE[courseId] || [];
  const start_date = LATE_JOINERS[s.id] || "2025-09-08";
  const end_date = WITHDRAWN[s.id] || null;
  const status = WITHDRAWN[s.id] ? "withdrawn" : "active";
  return units.map((u) => ({ student_id: s.id, unit_id: u.id, start_date, end_date, status }));
});

const STAFF_BY_COURSE = {
  "CRS-CS": "STF-001", "CRS-DS": "STF-002", "CRS-CERT": "STF-003", "CRS-MSDS": "STF-001",
};

function addDays(iso, days) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

let _sid = 0;
export const SCHEDULED_SESSIONS = [];
UNITS.forEach((u) => {
  TERMS.forEach((t) => {
    for (let w = 1; w <= t.week_count; w++) {
      _sid += 1;
      const cancelled = (w === 8 && t.id === "T1") || (w === 5 && t.id === "T2");
      SCHEDULED_SESSIONS.push({
        id: `SS-${_sid}`,
        unit_id: u.id,
        term_id: t.id,
        week_number: w,
        session_date: addDays(t.start_date, (w - 1) * 7),
        staff_id: STAFF_BY_COURSE[u.course_id],
        session_status: cancelled ? "cancelled" : "scheduled",
      });
    }
  });
});

// Per-student reliability drives the deterministic status pattern.
const RELIABILITY = {
  "STU-2021-4471": 0.4,
  "STU-2021-3390": 0.5,
  "STU-2023-9981": 0.9,
  "STU-2022-1120": 0.85,
  "STU-2021-7782": 0.95,
  "STU-2023-4410": 0.9,
  "STU-2023-9920": 0.8,
};

function statusFor(studentId, sessionId) {
  const r = RELIABILITY[studentId] ?? 0.85;
  const num = parseInt(sessionId.slice(3), 10);
  const seed = (num * 13 + studentId.length * 7) % 100;
  if (seed < r * 100) return seed % 7 === 0 ? "late" : "present";
  return seed % 3 === 0 ? "authorized_absence" : "absent";
}

export const ATTENDANCE_RECORDS = [];
ENROLMENTS.forEach((e) => {
  SCHEDULED_SESSIONS.forEach((ss) => {
    if (ss.unit_id !== e.unit_id) return;
    if (ss.session_status === "cancelled") return;
    if (ss.session_date < e.start_date) return;
    if (e.end_date && ss.session_date > e.end_date) return;
    ATTENDANCE_RECORDS.push({ student_id: e.student_id, session_id: ss.id, status: statusFor(e.student_id, ss.id) });
  });
});

// --- Lookups ---
export const courseById = (id) => COURSES.find((c) => c.id === id);
export const termById = (id) => TERMS.find((t) => t.id === id);
export const unitById = (id) => UNITS.find((u) => u.id === id);
export const enrolmentsForStudent = (sid) => ENROLMENTS.filter((e) => e.student_id === sid);

function inWindow(ss, e) {
  if (ss.session_date < e.start_date) return false;
  if (e.end_date && ss.session_date > e.end_date) return false;
  return true;
}

export function attendanceForSession(studentId, sessionId) {
  return ATTENDANCE_RECORDS.find((r) => r.student_id === studentId && r.session_id === sessionId);
}

// Non-cancelled scheduled sessions within the student's enrolment window,
// optionally restricted to a single term.
export function expectedSessions(studentId, termId) {
  const enrolls = enrolmentsForStudent(studentId);
  const out = [];
  enrolls.forEach((e) => {
    SCHEDULED_SESSIONS.forEach((ss) => {
      if (ss.unit_id !== e.unit_id) return;
      if (ss.session_status === "cancelled") return;
      if (termId && ss.term_id !== termId) return;
      if (!inWindow(ss, e)) return;
      out.push(ss);
    });
  });
  return out;
}

// Raw % = attended / scheduled. Adjusted % = attended / (scheduled - authorized).
export function computeStats(sessions, studentId) {
  let scheduled = sessions.length;
  let attended = 0, present = 0, late = 0, absent = 0, authorized = 0, noRecord = 0;
  sessions.forEach((ss) => {
    const rec = attendanceForSession(studentId, ss.id);
    if (!rec) { noRecord += 1; return; }
    if (rec.status === "present") { present += 1; attended += 1; }
    else if (rec.status === "late") { late += 1; attended += 1; }
    else if (rec.status === "absent") absent += 1;
    else if (rec.status === "authorized_absence") authorized += 1;
  });
  const raw = scheduled ? Math.round((attended / scheduled) * 100) : 0;
  const adjDenom = scheduled - authorized;
  const adjusted = adjDenom > 0 ? Math.round((attended / adjDenom) * 100) : null;
  return { scheduled, attended, present, late, absent, authorized, noRecord, raw, adjusted };
}

export function studentStats(studentId, termId) {
  return computeStats(expectedSessions(studentId, termId), studentId);
}

export function studentStatsByUnit(studentId, termId) {
  return enrolmentsForStudent(studentId).map((e) => {
    const unit = unitById(e.unit_id);
    const sessions = SCHEDULED_SESSIONS.filter(
      (ss) => ss.unit_id === e.unit_id && ss.session_status !== "cancelled" && (!termId || ss.term_id === termId) && inWindow(ss, e)
    );
    return { unit, ...computeStats(sessions, studentId) };
  });
}

export function studentStatsByTerm(studentId) {
  return TERMS.map((t) => ({ term: t, ...studentStats(studentId, t.id) }));
}

export function studentSessionRecords(studentId, termId) {
  return expectedSessions(studentId, termId)
    .map((ss) => {
      const unit = unitById(ss.unit_id);
      const rec = attendanceForSession(studentId, ss.id);
      return {
        session_id: ss.id,
        date: ss.session_date,
        unit: unit ? unit.name : "—",
        term: termById(ss.term_id)?.name,
        week: ss.week_number,
        status: rec ? rec.status : "no_record",
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Cohort aggregate: total attended / total scheduled across all students (not an average of %).
export function cohortStats(cohortName, termId) {
  const students = STUDENTS.filter((s) => s.cohort === cohortName);
  let scheduled = 0, attended = 0, authorized = 0, absent = 0;
  students.forEach((s) => {
    const sessions = expectedSessions(s.id, termId);
    scheduled += sessions.length;
    sessions.forEach((ss) => {
      const rec = attendanceForSession(s.id, ss.id);
      if (!rec) return;
      if (rec.status === "present" || rec.status === "late") attended += 1;
      else if (rec.status === "authorized_absence") authorized += 1;
      else if (rec.status === "absent") absent += 1;
    });
  });
  const raw = scheduled ? Math.round((attended / scheduled) * 100) : 0;
  const adjDenom = scheduled - authorized;
  const adjusted = adjDenom > 0 ? Math.round((attended / adjDenom) * 100) : null;
  return { scheduled, attended, authorized, absent, raw, adjusted, studentCount: students.length };
}

export function cohortStatsByTerm(cohortName) {
  return TERMS.map((t) => ({ term: t, ...cohortStats(cohortName, t.id) }));
}