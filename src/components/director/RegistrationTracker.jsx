import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROWS = [
  { name: "Marcus Osei", prog: "MSc Data Science", regDate: "18 Aug 2026", status: "Confirmed", confDate: "20 Aug 2026" },
  { name: "Lena Vogt", prog: "BSc Computer Science", regDate: "21 Aug 2026", status: "Confirmed", confDate: "22 Aug 2026" },
  { name: "Noah Clarke", prog: "MSc Cyber Security", regDate: "25 Aug 2026", status: "Confirmed", confDate: "25 Aug 2026" },
  { name: "Ravi Patel", prog: "BA Business", regDate: "23 Aug 2026", status: "Pending", confDate: "—" },
  { name: "Sofia Marin", prog: "BEng Mechanical", regDate: "24 Aug 2026", status: "Pending", confDate: "—" },
];

export default function RegistrationTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Registration tracking</CardTitle>
        <CardDescription>Student registration dates and confirmation status.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left font-medium py-2.5">Student</th>
              <th className="text-left font-medium py-2.5">Programme</th>
              <th className="text-left font-medium py-2.5">Reg. date</th>
              <th className="text-left font-medium py-2.5">Confirmation</th>
              <th className="text-left font-medium py-2.5">Confirmed on</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-3 font-medium">{r.name}</td>
                <td className="py-3 text-muted-foreground">{r.prog}</td>
                <td className="py-3">{r.regDate}</td>
                <td className="py-3">
                  {r.status === "Confirmed" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Confirmed</Badge>
                  ) : (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Pending</Badge>
                  )}
                </td>
                <td className="py-3 text-muted-foreground">{r.confDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}