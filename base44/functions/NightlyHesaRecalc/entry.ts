import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { recalcEngagement } from "../../shared/studentStatus.ts";

// NightlyHesaRecalc — safety-net batch recalculation of HESA readiness across
// ALL engagement records. Invoked by the Nightly HESA Readiness Recalc workflow
// (scheduled). This catches anything the event-trigger workflows missed, e.g.
// bulk imports or migrations. Never manual / on-demand.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const svc = base44.asServiceRole;
    const academicYear = "2025/26";

    const results = [];
    let offset = 0;
    // Paginate through all engagements (500 per page).
    let page = await svc.entities.Engagement.list("-created_date", 500);
    while (page && page.length > 0) {
      for (const eng of page) {
        try {
          results.push(await recalcEngagement(svc, eng, academicYear));
        } catch (e) {
          results.push({ engagement_id: eng.id, error: e.message });
        }
      }
      offset += page.length;
      if (page.length < 500) break;
      page = await svc.entities.Engagement.list("-created_date", 500, offset);
    }

    return Response.json({ recalculated: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}