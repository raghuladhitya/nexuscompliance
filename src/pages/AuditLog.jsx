import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ScrollText, Eye, Edit, Trash2, UserPlus, GitBranch } from "lucide-react";

const TYPE_META = {
  create: { icon: UserPlus, cls: "text-emerald-600 bg-emerald-50" },
  update: { icon: Edit, cls: "text-sky-600 bg-sky-50" },
  delete: { icon: Trash2, cls: "text-rose-600 bg-rose-50" },
  field_change: { icon: GitBranch, cls: "text-violet-600 bg-violet-50" },
  system: { icon: Eye, cls: "text-slate-600 bg-slate-100" },
};

export default function AuditLog() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [from, setFrom] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.AuditEntry.list("-created_date", 200);
        setEntries(data || []);
      } catch (e) {
        setEntries([]);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = entries.filter(e => {
    const hay = `${e.entity_name || ""} ${e.record_id || ""} ${e.action || ""} ${e.field_name || ""} ${e.changed_by_name || ""}`.toLowerCase();
    const matchesQuery = hay.includes(query.toLowerCase());
    const matchesUser = userFilter === "" || (e.changed_by_name || "").toLowerCase().includes(userFilter.toLowerCase());
    const matchesFrom = from === "" || (e.created_date || "") >= from;
    return matchesQuery && matchesUser && matchesFrom;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Append-only source of truth — every edit to a student or compliance-relevant record. History cannot disappear; corrections create new entries.</p>
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
              <Input placeholder="e.g. Dana Roberts" value={userFilter} onChange={e => setUserFilter(e.target.value)} />
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
          {loading ? (
            <div className="text-sm text-muted-foreground py-8 text-center">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No audit entries yet. Edits to student and compliance records will appear here automatically.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead>
                    <TableHead>Record</TableHead><TableHead>Change</TableHead><TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(l => {
                    const meta = TYPE_META[l.action] || TYPE_META.system;
                    return (
                      <TableRow key={l.id}>
                        <TableCell>
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${meta.cls}`}><meta.icon className="h-4 w-4" /></div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{l.changed_by_name || "—"}</TableCell>
                        <TableCell className="text-sm capitalize">{l.action?.replace("_", " ")}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{l.entity_name} · {l.record_id}</TableCell>
                        <TableCell className="text-sm">
                          {l.field_name ? (
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{l.field_name}: {l.old_value || "∅"} → {l.new_value || "∅"}</code>
                          ) : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {l.created_date ? new Date(l.created_date).toLocaleString("en-GB") : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}