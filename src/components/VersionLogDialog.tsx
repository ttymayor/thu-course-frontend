"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, GitBranch } from "lucide-react";
import { APP_VERSION, VERSION_LOGS, type VersionLog } from "@/config/version";

function VersionLogItem({ log }: { log: VersionLog }) {
  return (
    <div className="border-b pb-4 last:border-b-0">
      <div className="mb-2 flex items-center gap-2">
        <Tag className="h-3 w-3" />
        <Badge variant="outline" className="font-mono">
          {log.version}
        </Badge>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3" />
          {log.date}
        </div>
      </div>
      <ul className="list-inside list-disc space-y-1 text-sm">
        {log.changes.map((change, i) => (
          <li key={i} className="list-item items-start pl-4">
            <span className="leading-tight">{change}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface VersionLogDialogProps {
  children: React.ReactNode | ((version: string) => React.ReactNode);
}

export function VersionLogDialog({ children }: VersionLogDialogProps) {
  const trigger =
    typeof children === "function" ? children(APP_VERSION) : children;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            版本更新日誌
          </DialogTitle>
          <DialogDescription>
            查看東海課程資訊網站的版本更新歷程
          </DialogDescription>
        </DialogHeader>
        <div className="h-100 w-full overflow-y-auto rounded-md border p-4">
          <div className="space-y-4">
            {VERSION_LOGS.map((log) => (
              <VersionLogItem key={log.version} log={log} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
