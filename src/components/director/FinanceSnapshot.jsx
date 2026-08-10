import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ROWS = [
  { label: "Fee collection", value: 91, note: "£4.2M of £4.6M billed" },
  { label: "SLC confirmed", value: 78, note: "£2.1M confirmed" },
  { label: "Overdue accounts", value: 23, note: "23 students > 30 days", tone: "amber" },
];

export default function FinanceSnapshot() {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Finance snapshot</CardTitle>
        <CardDescription>Term 1 · August 2026</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ROWS.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-medium">{r.note}</span>
            </div>
            <Progress value={typeof r.value === "number" && r.value <= 100 ? r.value : 0} className="h-2" />
          </div>
        ))}
        <div className="flex justify-between text-sm pt-2 border-t border-border">
          <span className="text-muted-foreground">Outstanding</span>
          <span className="font-semibold">£418,000</span>
        </div>
        <button onClick={() => navigate("/finance")} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
          Open finance <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardContent>
    </Card>
  );
}