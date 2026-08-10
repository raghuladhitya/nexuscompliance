import DirectorKPIs from "@/components/director/DirectorKPIs";
import AttendanceWeekly from "@/components/director/AttendanceWeekly";
import RegistrationTracker from "@/components/director/RegistrationTracker";
import ChangeOfCircumstance from "@/components/director/ChangeOfCircumstance";
import ComplianceSnapshot from "@/components/director/ComplianceSnapshot";
import FinanceSnapshot from "@/components/director/FinanceSnapshot";
import RiskAlerts from "@/components/director/RiskAlerts";

export default function DirectorDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Director's overview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          The whole institution under one window — attendance, registration, compliance, finance and change of circumstance.
        </p>
      </div>

      <DirectorKPIs />

      <div className="grid lg:grid-cols-3 gap-6">
        <ComplianceSnapshot />
        <FinanceSnapshot />
        <RiskAlerts />
      </div>

      <AttendanceWeekly />

      <div className="grid lg:grid-cols-2 gap-6">
        <RegistrationTracker />
        <ChangeOfCircumstance />
      </div>
    </div>
  );
}