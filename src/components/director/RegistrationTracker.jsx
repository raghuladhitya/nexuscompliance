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

function ConfBadge({ status }) {
  return status === "Confirmed" ? (
    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Confirmed</Badge>
  ) : (
    <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">Pending</Badge>
  );
}

function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

export default function RegistrationTracker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Registration tracking</CardTitle>
        <CardDescription>Student registration dates and confirmation status.</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Wide: single row, 5 evenly-spaced columns */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium py-2.5 px-2">Student</th>
                <th className="text-left font-medium py-2.5 px-2">Programme</th>
                <th className="text-left font-medium py-2.5 px-2">Reg. date</th>
                <th className="text-left font-medium py-2.5 px-2">Confirmation</th>
                <th className="text-left font-medium py-2.5 px-2">Confirmed on</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 px-2 font-medium">{r.name}</td>
                  <td className="py-3 px-2 text-muted-foreground">{r.prog}</td>
                  <td className="py-3 px-2">{r.regDate}</td>
                  <td className="py-3 px-2"><ConfBadge status={r.status} /></td>
                  <td className="py-3 px-2 text-muted-foreground">{r.confDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tablet: 2 per row (2+2+1); Mobile: 1 per row, full width */}
        <div className="lg:hidden space-y-3">
          {ROWS.map((r, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <Field label="Student" value={r.name} />
                <Field label="Programme" value={r.prog} />
                <Field label="Reg. date" value={r.regDate} />
                <Field label="Confirmation" value={<ConfBadge status={r.status} />} />
                <Field label="Confirmed on" value={r.confDate} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}