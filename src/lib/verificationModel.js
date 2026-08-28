// Mock DocumentVerification data.

export const VERIFICATION_TYPES = [
  { value: "identity_document", label: "Identity Document" },
  { value: "visa", label: "Visa / Immigration" },
  { value: "qualification_evidence", label: "Qualification Evidence" },
  { value: "attendance_authorization", label: "Attendance Authorization" },
];

export const VERIFICATION_STATUS_META = {
  verified_clear: { label: "Verified", tone: "good" },
  pending: { label: "Pending", tone: "warning" },
  not_provided: { label: "Not provided", tone: "neutral" },
  rejected: { label: "Rejected", tone: "bad" },
};

export const DOCUMENT_VERIFICATIONS = [
  { id: "dv_001", student_id: "STU-2021-4471", verification_type: "identity_document", verification_status: "verified_clear", verified_by: "STF-004", verified_date: "2021-09-03" },
  { id: "dv_002", student_id: "STU-2021-4471", verification_type: "visa", verification_status: "not_provided", verified_by: null, verified_date: null },
  { id: "dv_003", student_id: "STU-2021-4471", verification_type: "qualification_evidence", verification_status: "verified_clear", verified_by: "STF-001", verified_date: "2021-09-05" },
  { id: "dv_004", student_id: "STU-2021-4471", verification_type: "attendance_authorization", verification_status: "pending", verified_by: null, verified_date: null },
];

export function verificationsForStudent(studentId) {
  return DOCUMENT_VERIFICATIONS.filter((v) => v.student_id === studentId);
}