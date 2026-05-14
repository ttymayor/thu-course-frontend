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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GitBranch, Calendar, Tag, ChevronDown } from "lucide-react";

interface VersionLog {
  version: string;
  date: string;
  changes: string[];
}

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

function VersionLogSkeleton() {
  return (
    <div className="space-y-3 border-b pb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  );
}

interface VersionLogDialogProps {
  children: React.ReactNode;
}

export function VersionLogDialog({ children }: VersionLogDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<VersionLog[]>([]);
  const [page, setPage] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const fetchPage = React.useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/git-log?page=${p}`);
      const data = await res.json();
      setLogs((prev) => (p === 0 ? data.logs : [...prev, ...data.logs]));
      setHasMore(data.hasMore);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open && logs.length === 0) fetchPage(0);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
            {logs.map((log) => (
              <VersionLogItem key={log.version} log={log} />
            ))}
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <VersionLogSkeleton key={i} />
              ))}
            {!loading && logs.length === 0 && (
              <p className="text-muted-foreground text-center text-sm">
                無法載入版本資訊
              </p>
            )}
          </div>
          {hasMore && !loading && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 w-full"
              onClick={() => fetchPage(page + 1)}
            >
              <ChevronDown className="mr-1 h-4 w-4" />
              顯示更多
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
