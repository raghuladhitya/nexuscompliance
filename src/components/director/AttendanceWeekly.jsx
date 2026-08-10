import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROWS = [
  { name: "Aisha Khan", id: "STU-2022-3340", w: [95, 92, 90, 88], confirmed: "06 Aug 2026" },
  { name: "Priya Nair", id: "STU-2022-1188", w: [91, 88, 79, 72], confirmed: "06 Aug 2026" },
  { name: "Lena Vogt", id: "STU-2024-2210", w: [88, 90, 85, 83], confirmed: "06 Aug 2026" },
  { name: "Marcus Osei", id: "STU-2023-9920", w: [78, 84, 81, 86], confirmed: "06 Aug 2026" },
  { name: "James Whitfield", id: "STU-2021-4471", w: [82, 71, 58, 0], confirmed: "—" },
  { name: "Tom Brennan", id: "STU-2021-7751", w: [64, 55, 48, 40], confirmed: "—" },
];

const attClass = (v) =>
  v === 0 ? "text-muted-foreground" : v >= 85 ? "text-emerald-600" : v >= 70 ? "text-amber-600" : "text-rose-600";

const avg = (w) => Math.round(w.reduce((a, b) => a + b, 0) / w.length);

export default function AttendanceWeekly() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly attendance — August 2026</CardTitle>
        <CardDescription>Week 1–4 percentages per student, with the date each week's register was confirmed.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground border-b border-border">
              <th className="text-left font-medium py-2.5">Student</th>
              <th className="text-center font-medium py-2.5">W1<br /><span className="font-normal">03–09 Aug</span></th>
              <th className="text-center font-medium py-2.5">W2<br /><span className="font-normal">10–16 Aug</span></th>
              <th className="text-center font-medium py-2.5">W3<br /><span className="font-normal">17–23 Aug</span></th>
              <th className="text-center font-medium py-2.5">W4<br /><span className="font-normal">24–30 Aug</span></th>
              <th className="text-center font-medium py-2.5">Avg</th>
              <th className="text-left font-medium py-2.5 pl-4">Register confirmed</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="py-3">
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{r.id}</div>
                </td>
                {r.w.map((v, i) => (
                  <td key={i} className={`text-center py-3 font-semibold ${attClass(v)}`}>
                    {v === 0 ? "—" : `${v}%`}
                  </td>
                ))}
                <td className="text-center py-3 font-semibold">{avg(r.w)}%</td>
                <td className="py-3 pl-4">
                  {r.confirmed === "—" ? (
                    <Badge variant="outline" className="text-muted-foreground">Not confirmed</Badge>
                  ) : (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">{r.confirmed}</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}