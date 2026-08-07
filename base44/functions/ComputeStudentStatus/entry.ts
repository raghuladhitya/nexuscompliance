import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { recalcEngagement } from "../../shared/studentStatus.ts";

// ComputeStudentStatus — the translation layer entry point.
// Recalculates the derived plain-language status for a student/engagement and
// upserts the HESA readiness state. Invoked automatically by the entity-trigger
// workflows (HESA Recalc on <Entity>) and by the nightly batch — never manually.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const engagementId = body.engagement_id;
    const studentId = body.student_id;
    const academicYear = body.academic_year || "2025/26";

    if (!engagementId && !studentId) {
      return Response.json({ error: "engagement_id or student_id required" }, { status: 400 });
    }

    const svc = base44.asServiceRole;
    let engagements = [];
    if (engagementId) {
      const eng = await svc.entities.Engagement.get(engagementId).catch(() => null);
      if (eng) engagements = [eng];
    } else {
      engagements = await svc.entities.Engagement.filter({ student_id: studentId }, "-start_date", 50);
    }
    if (!engagements || engagements.length === 0) {
      return Response.json({ error: "No engagement found" }, { status: 404 });
    }

    const results = [];
    for (const eng of engagements) {
      results.push(await recalcEngagement(svc, eng, academicYear));
    }
    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}