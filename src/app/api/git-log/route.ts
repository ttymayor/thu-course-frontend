import { execSync } from "child_process";
import { NextResponse } from "next/server";

interface VersionLog {
  version: string;
  date: string;
  changes: string[];
}

function runGit(cmd: string): string {
  return execSync(cmd, { encoding: "utf-8" }).trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(0, parseInt(searchParams.get("page") || "0"));
  const limit = 3;

  try {
    const tags = runGit("git tag --sort=-version:refname")
      .split("\n")
      .filter(Boolean);

    if (tags.length === 0) {
      return NextResponse.json({ logs: [], hasMore: false });
    }

    const start = page * limit;
    const pageTags = tags.slice(start, start + limit);
    const hasMore = start + limit < tags.length;

    const logs: VersionLog[] = pageTags.map((tag, i) => {
      const prevTag = tags[start + i + 1];

      const dateStr = runGit(`git log -1 --pretty=format:"%ai" "${tag}"`);
      const date = dateStr.replace(/"/g, "").split(" ")[0];

      const range = prevTag ? `"${prevTag}".."${tag}"` : `"${tag}"`;
      const raw = runGit(
        `git log ${range} --pretty=format:"%s" --no-merges`,
      );
      const changes = raw
        .replace(/"/g, "")
        .split("\n")
        .filter(Boolean);

      return { version: tag, date, changes };
    });

    return NextResponse.json({ logs, hasMore });
  } catch {
    return NextResponse.json({ logs: [], hasMore: false });
  }
}
