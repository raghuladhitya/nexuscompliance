import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ArrowLeft, Users } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import PendingItemsProfile from "@/components/academic/PendingItemsProfile";
import { STUDENTS } from "@/lib/records";

const FILTERS = [
  { key: "name", label: "Name", placeholder: "Search by name", type: "text" },
  { key: "email", label: "Email", placeholder: "Search by email", type: "email" },
  { key: "code", label: "Person Code", placeholder: "e.g. STU-2021-4471", type: "text", mono: true },
];

export default function AcademicStudentSearch() {
  const [filterKey, setFilterKey] = useState("name");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);

  const filter = FILTERS.find((f) => f.key === filterKey);

  const runSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setSelected(null); return; }
    const matches = STUDENTS.filter((s) => {
      const field = filterKey === "code" ? s.id : s[filterKey];
      return field && field.toLowerCase().includes(q);
    });
    setResults(matches);
    setSelected(null);
  };

  if (selected) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to results
        </Button>
        <PendingItemsProfile student={selected} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Student search" description="Look up a student and review their consolidated pending items." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Search</CardTitle>
          <CardDescription>Choose a filter type, then enter a value and search.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="filter-type">Filter type</Label>
              <select
                id="filter-type"
                value={filterKey}
                onChange={(e) => { setFilterKey(e.target.value); setResults(null); }}
                className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm"
              >
                {FILTERS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="search-value">Search value</Label>
              <div className="flex gap-2">
                <Input
                  id="search-value"
                  type={filter.type}
                  placeholder={filter.placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  className={filter.mono ? "font-mono" : ""}
                />
                <Button onClick={runSearch}><Search className="h-4 w-4 mr-1" /> Search</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {results !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Results</CardTitle>
            <CardDescription>{results.length} student{results.length === 1 ? "" : "s"} found.</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
                <Users className="h-5 w-5" /> No students match your search.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {results.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="flex w-full items-center gap-3 py-3 text-left hover:bg-muted/50 rounded-lg px-2 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                    </div>
                    <div className="text-sm text-muted-foreground hidden sm:block">{s.cohort}</div>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}