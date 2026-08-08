import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Loader2 } from "lucide-react";

// Shown to any signed-in user who hasn't been assigned a team role yet.
// If no admin exists anywhere in the app, this lets them set up the
// institution and become the first admin (see BootstrapFirstAdmin). If an
// admin already exists, it just explains that they need to be assigned a
// role by that admin — it doesn't let a second person self-promote.
export default function ClaimWorkspace() {
  const { user, checkUserAuth } = useAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!name.trim()) { setError("Institution name is required."); return; }
    setLoading(true); setError("");
    try {
      await base44.functions.invoke("BootstrapFirstAdmin", { institution_name: name.trim() });
      await checkUserAuth();
      window.location.href = "/";
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Couldn't complete setup.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /> Set up your workspace</CardTitle>
          <CardDescription>
            You're signed in as <strong>{user?.email}</strong>, but no team role has been assigned yet.
            If you're the first person here, name your institution to become its administrator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Institution name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Northbrook University" />
          </div>
          {error && (
            <div className="text-sm text-destructive rounded-lg bg-destructive/10 p-3">
              {error}
            </div>
          )}
          <Button className="w-full" onClick={submit} disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Setting up…</> : "Set up as administrator"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Already part of an institution here? Ask your administrator to assign your role from Admin &amp; Settings — this screen will update automatically once they do.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
