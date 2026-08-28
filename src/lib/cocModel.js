// Mock StatusChangeEvent (COC) data.

export const COC_EVENT_TYPES = [
  { value: "intermission", label: "Intermission" },
  { value: "course_transfer", label: "Course Transfer" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "reinstatement", label: "Reinstatement" },
];

export const COC_EVENT_TYPE_LABEL = Object.fromEntries(COC_EVENT_TYPES.map((t) => [t.value, t.label]));

export const STATUS_CHANGE_EVENTS = [
  { id: "sce_001", student_id: "STU-2021-4471", student_name: "James Whitfield", event_type: "withdrawal", previous_status: "Active", new_status: "Withdrawn", effective_date: "2026-03-12", reason: "Voluntary withdrawal — personal circumstances", changed_by: "STF-004", external_tracking_ref: "COC-2026-0488" },
  { id: "sce_002", student_id: "STU-2021-4471", student_name: "James Whitfield", event_type: "intermission", previous_status: "Active", new_status: "Intermitting", effective_date: "2025-01-05", reason: "Medical intermission", changed_by: "STF-004", external_tracking_ref: "COC-2025-0112" },
  { id: "sce_003", student_id: "STU-2021-3390", student_name: "Priya Nair", event_type: "course_transfer", previous_status: "BSc Computer Science", new_status: "BSc Data Science", effective_date: "2026-09-02", reason: "Programme transfer", changed_by: "STF-004", external_tracking_ref: "COC-2026-0521" },
  { id: "sce_004", student_id: "STU-2023-9981", student_name: "Marcus Osei", event_type: "reinstatement", previous_status: "Intermitting", new_status: "Active", effective_date: "2026-09-15", reason: "Return from intermission", changed_by: "STF-004", external_tracking_ref: "COC-2026-0602" },
];

export function eventsForStudent(studentId) {
  return STATUS_CHANGE_EVENTS
    .filter((e) => e.student_id === studentId)
    .sort((a, b) => new Date(b.effective_date) - new Date(a.effective_date));
}