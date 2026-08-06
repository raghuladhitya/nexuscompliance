import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, GitBranch, AlertTriangle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PANELS = [
  {
    title: "Registrations pending", icon: UserPlus, count: 14, tone: "sky",
    items: [
      { name: "Marcus Osei", detail: "MSc Data Science", status: "Awaiting docs" },
      { name: "Nina Costa", detail: "BEng Mechanical", status: "Awaiting payment" },
      { name: "Tom Reid", detail: "BA History", status: "Verifying" },
    ],
  },
  {
    title: "Change of circumstances", icon: GitBranch, count: 8, tone: "amber",
    items: [
      { name: "Aisha Khan", detail: "Fee change · SLC", status: "Pending" },
      { name: "James Whitfield", detail: "Withdrawal · SLC", status: "Actioned" },
      { name: "Liam Boyd", detail: "Cohort transfer", status: "Pending" },
    ],
  },
  {
    title: "At-risk students", icon: AlertTriangle, count: 18, tone: "rose",
    items: [
      { name: "Priya Nair", detail: "Attendance 52%", status: "High" },
      { name: "James Whitfield", detail: "Engagement 61%", status: "High" },
      { name: "Aisha Khan", detail: "Attendance 64%", status: "Medium" },
    ],
  },
];

const TONE = {
  sky: "bg-sky-50 text-sky-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function OperationsRow() {
  const navigate = useNavigate();
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {PANELS.map(p => (
        <Card key={p.title}>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${TONE[p.tone]}`}>
                <p.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">{p.title}</CardTitle>
                <CardDescription>{p.count} total</CardDescription>
              </div>
            </div>
            <button onClick={() => navigate("/students")} className="text-xs text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent className="space-y-0">
            {p.items.map(it => (
              <div key={it.name} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.detail}</div>
                </div>
                <Badge variant="outline" className="text-xs">{it.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}