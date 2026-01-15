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
import { GitBranch, Calendar } from "lucide-react";
import { Tag } from "lucide-react";

interface VersionLog {
  version: string;
  date: string;
  changes: string[];
}

const VERSION_LOGS: VersionLog[] = [
  {
    version: "v1.4.0",
    date: "2026-01-16",
    changes: [
      "🔧 Update dependencies (Next.js 16.1.1 → 16.1.2, TypeScript, etc.)",
      "🎨 Improve course info components (DetailView, GradingPieChart)",
      "📝 Add AGENTS.md documentation with coding guidelines",
      "✨ Implement feedback feature with form and API integration",
      "🎯 Add theme color provider and toggle for enhanced UI customization",
      "📊 Enhance OG image generation for course information",
      "🆕 Add NewRelease component and enhance course list display",
      "📱 Enhance footer component with new layout and links",
    ],
  },
  {
    version: "v1.3.0",
    date: "2026-01-08",
    changes: [
      "🔐 Implement Google OAuth authentication with next-auth",
      "📚 Add bookmarks feature with BookmarkList component",
      "📱 Add mobile menu for improved navigation",
      "🔧 Refactor course service and API response handling",
      "✨ Implement course and department management with API routes",
      "⚡ Use lean() for get course schedules query to improve performance",
      "👤 Implement user creation in MongoDB during sign-in process",
    ],
  },
  {
    version: "v1.2.0",
    date: "2025-11-24",
    changes: [
      "🏠 Enhance layout with announcements, course schedule, school links, and FAQs",
      "📅 Implement schedule simulator with course display, sharing, and export",
      "🔢 Integrate vercount-react for site analytics",
      "🎨 Add accordion component for FAQ section",
      "📦 Update dependencies and add @radix-ui/react-label",
    ],
  },
  {
    version: "v1.1.0",
    date: "2025-10-22",
    changes: [
      "🔧 Upgrade Next.js to version 16.0.0",
      "⚙️ Enable reactCompiler option in configuration",
      "🕐 Add time progress indicator to ScheduleTable",
      "🛠️ Remove temporary data migration logic",
      "🔧 Correct path separator for Next.js type definitions",
    ],
  },
  {
    version: "v1.0.1",
    date: "2025-10-15",
    changes: [
      "🐛 Fix schedule simulator data migration logic",
      "🔄 Implement temporary data migration from localStorage",
      "📊 Add hoveredCourse prop to preview schedule",
      "🔧 Extract ScheduleTable component and create schedule lib",
      "🗺️ Fix DrawPolyline's issue with accessing ref during rendering",
      "🎨 Fix rendering warning on first load animation",
    ],
  },
  {
    version: "v1.0.0",
    date: "2025-10-13",
    changes: [
      "🎉 Initial release",
      "📋 Course information query functionality",
      "📊 Course detail view with grading and selection data",
      "📅 Schedule simulator with course selection",
      "🗺️ School map with bus routes and location marker",
      "🎨 Enhanced UI with loading skeletons and animations",
      "🔍 Implement search and filter functionality",
      "📈 Add charts for course grading and selection data",
    ],
  },
];

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
        {log.changes.map((change, index) => (
          <li key={index} className="list-item items-start pl-4">
            <span className="leading-tight">{change}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface VersionLogDialogProps {
  children: React.ReactNode;
}

export function VersionLogDialog({ children }: VersionLogDialogProps) {
  return (
    <Dialog>
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
            {VERSION_LOGS.map((log) => (
              <VersionLogItem key={log.version} log={log} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
