import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { TrendingDown } from "lucide-react";

const COHORTS = [
  { name: "BSc Computer Science", color: "#1e3a5f", data: [92, 90, 88, 85, 83, 81, 79, 76, 74, 71] },
  { name: "BSc Data Science", color: "#2dd4bf", data: [88, 87, 86, 84, 82, 80, 78, 76, 73, 70] },
  { name: "MSc Data Science", color: "#f59e0b", data: [94, 93, 92, 91, 90, 89, 88, 87, 86, 85] },
  { name: "CertHE Computing", color: "#f43f5e", data: [85, 83, 80, 78, 75, 72, 68, 64, 60, 56] },
];

const chartData = Array.from({ length: 10 }, (_, i) => {
  const row = { week: `W${i + 1}` };
  COHORTS.forEach((c) => { row[c.name] = c.data[i]; });
  return row;
});

export default function CohortTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><TrendingDown className="h-4 w-4 text-rose-500" /> Cohort attendance trend</CardTitle>
        <CardDescription>Weekly attendance % per cohort — spot drops early.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" />
              <YAxis domain={[40, 100]} tick={{ fontSize: 12 }} stroke="hsl(215 16% 47%)" unit="%" />
              <Tooltip />
              <Legend />
              {COHORTS.map((c) => (
                <Line key={c.name} type="monotone" dataKey={c.name} stroke={c.color} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}