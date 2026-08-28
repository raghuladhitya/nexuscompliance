// Mock TutorAssignment data.
import { STAFF } from "@/lib/records";

export const TUTOR_ASSIGNMENTS = [
  { id: "ta_001", student_id: "STU-2021-4471", staff_id: "STF-001", start_date: "2024-09-01", end_date: null },
  { id: "ta_002", student_id: "STU-2021-4471", staff_id: "STF-002", start_date: "2021-09-01", end_date: "2024-08-31" },
];

export function currentTutorAssignment(studentId) {
  return TUTOR_ASSIGNMENTS.find((a) => a.student_id === studentId && !a.end_date);
}

export function tutorHistory(studentId) {
  return TUTOR_ASSIGNMENTS
    .filter((a) => a.student_id === studentId)
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
}

export function staffById(id) {
  return STAFF.find((s) => s.id === id);
}