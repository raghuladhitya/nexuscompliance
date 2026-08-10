import React, { useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import {
  Search, Filter, ScrollText, Eye, Edit, Trash2, UserPlus, GitBranch
} from "lucide-react";

const LOG = [
  { user: "Dana Roberts", action: "Updated HESA field", target: "James Whitfield (STU-2021-4471)", field: "MSTUFEE → 1", date: "2026-08-06 09:42", type: "edit" },
  { user: "System", action: "Sync completed", target: "Student records", field: "6,223 records", date: "2026-08-06 09:40", type: "system" },
  { user: "Mark Patel", action: "Created payment plan", target: "Marcus Osei (STU-2023-9981)", field: "3 instalments", date: "2026-08-06 09:15", type: "create" },
  { user: "Dana Roberts", action: "Sent communication", target: "James Whitfield", field: "Withdrawal confirmation", date: "2026-08-06 09:02", type: "system" },
  { user: "Sarah Lin", action: "Initiated withdrawal", target: "Aisha Khan (STU-2022-1120)", field: "Reason: Financial", date: "2026-08-05 16:30", type: "withdrawal" },
  { user: "System", action: "Possible duplicate flagged", target: "STU-2021-4471 / STU-2023-9920", field: "DOB + name match", date: "2026-08-05 14:10", type: "system" },
  { user: "Mark Patel", action: "Deleted custom field", target: "Previous sponsor", field: "—", date: "2026-08-05 11:22", type: "delete" },
  { user: "Dana Roberts", action: "Updated permission", target: "Role: Academic", field: "Edit records = ON", date: "2026-08-04 15:00", type: "edit" },
];

const TYPE_META = {
  edit: { icon: Edit, cls: "text-sky-600 bg-sky-50" },
  create: { icon: UserPlus, cls: "text-emerald-600 bg-emerald-50" },
  delete: { icon: Trash2, cls: "text-rose-600 bg-rose-50" },
  system: { icon: Eye, cls: "text-slate-600 bg-slate-100" },
  withdrawal: { icon: GitBranch, cls: "text-amber-600 bg-amber-50" },
};

export default function AuditLog() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState("");
  const [from, setFrom] = useState("");

  const filtered = LOG.filter(l =>
    (l.target.toLowerCase().includes(query.toLowerCase()) || l.action.toLowerCase().includes(query.toLowerCase())) &&
    (user === "" || l.user.toLowerCase().includes(user.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Who changed what, when, on which record — OfS-inspection ready.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4 text-primary" /> Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Search record / action</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Student, ID, action…" value={query} onChange={e => setQuery(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Filter by user</Label>
              <Input placeholder="e.g. Dana Roberts" value={user} onChange={e => setUser(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>From date</Label>
              <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><ScrollText className="h-4 w-4 text-primary" /> Activity trail</CardTitle>
          <CardDescription>{filtered.length} entries · immutable record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead>
                  <TableHead>Record</TableHead><TableHead>Change</TableHead><TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l, i) => {
                  const meta = TYPE_META[l.type];
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${meta.cls}`}><meta.icon className="h-4 w-4" /></div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{l.user}</TableCell>
                      <TableCell className="text-sm">{l.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{l.target}</TableCell>
                      <TableCell className="text-sm"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{l.field}</code></TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{l.date}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}