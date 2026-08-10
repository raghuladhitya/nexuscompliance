import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ComplianceSnapshot() {
  const navigate = useNavigate();
  const value = 87;
  const r = 54, c = 2 * Math.PI * r, off = c * (1 - value / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">HESA compliance</CardTitle>
        <CardDescription>2025/26 Student return</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative">
          <svg viewBox="0 0 128 128" className="w-32 h-32">
            <circle cx="64" cy="64" r={r} fill="none" stroke="hsl(214 32% 91%)" strokeWidth="11" />
            <circle cx="64" cy="64" r={r} fill="none" stroke="hsl(142 71% 45%)" strokeWidth="11"
              strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 64 64)" />
            <text x="64" y="62" textAnchor="middle" className="fill-foreground" fontSize="24" fontWeight="700">{value}%</text>
            <text x="64" y="80" textAnchor="middle" className="fill-muted-foreground" fontSize="10">validated</text>
          </svg>
        </div>
        <div className="w-full space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Student fields</span><span className="font-medium">5,418 / 6,223</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Blocking errors</span><Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50">4</Badge></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Warnings</span><Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">8</Badge></div>
        </div>
        <button onClick={() => navigate("/hesa")} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
          Open return <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </CardContent>
    </Card>
  );
}