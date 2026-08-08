// base44/shared/studentStatus.ts
// =============================================================================
// TRANSLATION LAYER — HESA computed student status.
// =============================================================================
// This module derives the plain-language status label shown to users PURELY from
// the underlying Engagement / SessionStatus / Leaver / QualificationAwarded
// records. The plain label is NEVER stored on any entity — it is always
// computed by computeStatusLabel() / recalcEngagement().
//
// RULES:
//  - If a Leaver record exists with NO linked QualificationAwarded, the computed
//    status is "Outcome Pending" and the student's HesaSubmissionState is forced
//    to `needs_review`. This state must NEVER silently resolve to "ready" until
//    Registry links an actual outcome (a QualificationAwarded record).
//  - Backend/engineering-facing screens may reference the real HESA entity
//    names (Engagement, SessionStatus, Leaver, QualificationAwarded). Every
//    Admissions/Academic/Registry/Management-facing screen must ONLY ever show
//    the plain-language derived label returned here.
//
// =============================================================================
// AUTOMATED HESA-READINESS RECALCULATION — NEVER MANUAL.
// =============================================================================
// HesaSubmissionState (and HesaSubmissionStatus) recalculate AUTOMATICALLY and
// IMMEDIATELY whenever a linked Engagement, SessionStatus, Leaver, or
// QualificationAwarded record changes. This is event-triggered via entity
// workflows (HESA Recalc on <Entity>) that call the ComputeStudentStatus backend
// function — NOT a button a person clicks. A nightly batch workflow
// (Nightly HESA Readiness Recalc -> NightlyHesaRecalc) recalculates across ALL
// records as a safety net to catch anything an event trigger missed (e.g.
// bulk imports or migrations).
//
// THERE IS NO MANUAL / ON-DEMAND RECALCULATION ANYWHERE IN THE APP, BY DESIGN.
// Do not add a "recalculate" button or a manual trigger. If a recalculation is
// needed, it happens via the workflows above or by writing to the triggering
// entities (which fires the event workflows).
// =============================================================================

export const STATUS_LABELS = [
  "Active",
  "Break in Study",
  "Resumed",
  "Withdrawn",
  "Transferred",
  "Completed — Full Award",
  "Completed — Intermediate Award",
  "Outcome Pending",
];

// Map a raw HESA SessionStatus value to its plain label (used when no Leaver).
const SESSION_LABEL = {
  active: "Active",
  break_in_study: "Break in Study",
  resumed: "Resumed",
  withdrawn: "Withdrawn",
  transferred: "Transferred",
};

// Pure compute. Inputs are arrays for a single engagement.
//   sessionStatuses: [{ status, valid_from }] (any order)
//   leaver: object | null
//   qualificationsAwarded: [{ award_type }] (award_type resolved from linked Qualification)
export function computeStatusLabel(sessionStatuses = [], leaver = null, qualificationsAwarded = []) {
  if (leaver) {
    if (!qualificationsAwarded || qualificationsAwarded.length === 0) {
      return "Outcome Pending";
    }
    const qa = qualificationsAwarded[0];
    return qa && qa.award_type === "intermediate"
      ? "Completed — Intermediate Award"
      : "Completed — Full Award";
  }
  if (!sessionStatuses || sessionStatuses.length === 0) return "Outcome Pending";
  const sorted = [...sessionStatuses].sort((a, b) =>
    (b.valid_from || "").localeCompare(a.valid_from || "")
  );
  const latest = sorted[0];
  return SESSION_LABEL[latest?.status] || "Outcome Pending";
}

// Map a computed label to the readiness state to enforce on the submission
// memory entities. "Outcome Pending" (and Withdrawn/Transferred leavers) force
// needs_review / resubmission_required — never "ready".
export function readinessStateForLabel(label) {
  if (label === "Outcome Pending") {
    return { hesaState: "needs_review", hesaStatus: "resubmission_required", changed: true };
  }
  if (label === "Withdrawn" || label === "Transferred") {
    return { hesaState: "needs_review", hesaStatus: "changed_since", changed: true };
  }
  if (label.startsWith("Completed")) {
    return { hesaState: "submitted_no_change_needed", hesaStatus: "submitted", changed: false };
  }
  return { hesaState: "submitted_no_change_needed", hesaStatus: "submitted", changed: false };
}

// Full recalculation for one engagement: loads linked records, computes the
// derived label, and upserts the readiness state (HesaSubmissionStatus per
// student + HesaSubmissionState per engagement). Runs as service role (svc).
export async function recalcEngagement(svc, eng, academicYear = "2025/26") {
  const [sessionStatuses, leavers, qas] = await Promise.all([
    svc.entities.SessionStatus.filter({ engagement_id: eng.id }, "-valid_from", 200),
    svc.entities.Leaver.filter({ engagement_id: eng.id }, "-end_date", 10),
    svc.entities.QualificationAwarded.filter({ engagement_id: eng.id }, "-award_date", 50),
  ]);

  // Enrich QualificationAwarded with award_type from the linked Qualification.
  const qualIds = [...new Set((qas || []).map(q => q.qualification_id).filter(Boolean))];
  const quals = [];
  for (const qid of qualIds) {
    const q = await svc.entities.Qualification.get(qid).catch(() => null);
    if (q) quals.push(q);
  }
  const qaEnriched = (qas || []).map(qa => ({
    ...qa,
    award_type: (quals.find(q => q.id === qa.qualification_id) || {}).award_type || "full",
  }));

  const leaver = (leavers || [])[0] || null;
  const label = computeStatusLabel(sessionStatuses || [], leaver, qaEnriched);
  const readiness = readinessStateForLabel(label);

  // Upsert HesaSubmissionStatus (per-student memory).
  const existing = await svc.entities.HesaSubmissionStatus.filter(
    { student_id: eng.student_id, academic_year: academicYear }, "-created_date", 1
  );
  const statusPayload = {
    student_id: eng.student_id,
    academic_year: academicYear,
    included_in_accepted_return: existing[0]?.included_in_accepted_return ?? false,
    last_submitted_date: existing[0]?.last_submitted_date,
    changed_since_submission: readiness.changed,
    change_summary: label,
    status: readiness.hesaStatus,
    institution_id: eng.institution_id,
  };
  if (existing[0]) {
    await svc.entities.HesaSubmissionStatus.update(existing[0].id, statusPayload);
  } else {
    await svc.entities.HesaSubmissionStatus.create(statusPayload);
  }

  // Upsert HesaSubmissionState (per-engagement; enrolment_id holds the engagement id).
  const existingState = await svc.entities.HesaSubmissionState.filter(
    { enrolment_id: eng.id, academic_year: academicYear }, "-created_date", 1
  );

  // PROVENANCE: if the derived label actually changed since the last
  // recalculation, write an immutable system audit entry. This is what makes
  // the readiness engine's decisions visible/auditable rather than a silent
  // background recompute. Best-effort — never blocks the recalculation.
  const previousLabel = existingState[0]?.change_trigger;
  if (previousLabel && previousLabel !== label) {
    await svc.entities.AuditEntry.create({
      action: "field_change",
      entity_name: "Engagement",
      record_id: eng.id,
      field_name: "status_label",
      old_value: previousLabel,
      new_value: label,
      changed_by_id: "system",
      changed_by_name: "HESA Readiness Engine",
      source_team: "system",
      reason: "Automatic recalculation triggered by an underlying HESA record change",
      institution_id: eng.institution_id,
    }).catch(() => {});
  }

  const statePayload = {
    enrolment_id: eng.id,
    academic_year: academicYear,
    status: readiness.hesaState,
    last_submitted_date: existingState[0]?.last_submitted_date,
    change_trigger: label,
    institution_id: eng.institution_id,
  };
  if (existingState[0]) {
    await svc.entities.HesaSubmissionState.update(existingState[0].id, statePayload);
  } else {
    await svc.entities.HesaSubmissionState.create(statePayload);
  }

  return { engagement_id: eng.id, student_id: eng.student_id, status_label: label, readiness };
}