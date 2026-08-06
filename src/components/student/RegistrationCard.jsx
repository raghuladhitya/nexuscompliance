import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, UserCog } from "lucide-react";

export default function RegistrationCard() {
  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-sky-50 flex items-center justify-center"><Calendar className="h-4 w-4 text-sky-600" /></div>
          <div>
            <div className="text-xs text-muted-foreground">Registration date</div>
            <div className="text-sm font-medium">02 Sep 2021</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
          <div>
            <div className="text-xs text-muted-foreground">Reg confirmation</div>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Confirmed</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center"><UserCog className="h-4 w-4 text-violet-600" /></div>
          <div>
            <div className="text-xs text-muted-foreground">Student type</div>
            <div className="text-sm font-medium">Home / SFE funded</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-rose-50 flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-rose-600" /></div>
          <div>
            <div className="text-xs text-muted-foreground">Enrolment status</div>
            <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50">Withdrawn</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}