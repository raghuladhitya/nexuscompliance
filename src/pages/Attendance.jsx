import React, { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import CohortSummary from "@/components/attendance/CohortSummary";
import StudentDetail from "@/components/attendance/StudentDetail";
import { useRole } from "@/lib/RoleContext";
import { isAggregateOnlyRole } from "@/lib/roles";

export default function Attendance() {
  const { role } = useRole();
  const aggregateOnly = isAggregateOnlyRole(role);
  const [view, setView] = useState("cohort");

  const showStudentLookup = !aggregateOnly;
  const activeView = showStudentLookup ? view : "cohort";

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Attendance"
        description="Calculated from scheduled sessions, enrolment windows and recorded status — raw and adjusted (authorized absences excused)."
      />

      {showStudentLookup && (
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          <button
            onClick={() => setView("cohort")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeView === "cohort" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cohort Summary
          </button>
          <button
            onClick={() => setView("student")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeView === "student" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Student Detail
          </button>
        </div>
      )}

      {activeView === "cohort" ? <CohortSummary /> : <StudentDetail />}
    </div>
  );
}