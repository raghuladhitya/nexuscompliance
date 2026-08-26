import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function AttentionList({ title = "Needs attention", items, empty, icon: Icon = AlertTriangle }) {
  const count = items.length;
  return (
    <Card className="border-amber-200/70">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </span>
          {title}
        </CardTitle>
        <StatusBadge tone={count ? "warning" : "good"}>
          {count} {count === 1 ? "item" : "items"}
        </StatusBadge>
      </CardHeader>
      <CardContent className="space-y-2">
        {count === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center gap-2 py-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {empty || "Nothing needs attention right now."}
          </div>
        ) : (
          items.map((item) => {
            const actions = item.actions || (item.action ? [item.action] : []);
            return (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  {item.description && <div className="text-xs text-muted-foreground truncate">{item.description}</div>}
                </div>
                {item.meta && (
                  <StatusBadge tone={item.tone || "neutral"} className="shrink-0 hidden sm:inline-flex">
                    {item.meta}
                  </StatusBadge>
                )}
                {actions.map((a, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={a.variant || "outline"}
                    onClick={a.onClick}
                    className="shrink-0"
                  >
                    {a.label}
                  </Button>
                ))}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}