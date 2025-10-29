"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useVercount } from "vercount-react";

const FOOTER_CONFIG = {
  github_thu_course_frontend: "https://github.com/ttymayor/thu-course-frontend",
  github_thu_course_crawler: "https://github.com/ttymayor/thu-course-crawler",
  github: "https://github.com/ttymayor",
};

export default function Footer() {
  const [touchTimes, setTouchTimes] = useState(0);
  const { sitePv, siteUv } = useVercount();

  return (
    <div className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 品牌資訊 */}
          <div className="flex flex-col items-center md:items-start space-y-1">
            <span
              className="font-bold text-foreground cursor-pointer select-none"
              onClick={() => setTouchTimes(touchTimes + 1)}
            >
              東海課程資訊{" "}
              {touchTimes > 0 && touchTimes < 3
                ? "點什麼點？"
                : touchTimes === 3
                ? "給你看瀏覽次數"
                : touchTimes > 3 && touchTimes < 10
                ? "別點了"
                : touchTimes >= 10 && touchTimes < 20
                ? "？"
                : touchTimes >= 20
                ? "6"
                : ""}
            </span>
            <span className="text-sm text-muted-foreground">
              一個更好的東海課程資訊網站
            </span>
          </div>

          {/* 開發者資訊 */}
          <div className="flex flex-col items-center text-center space-y-1">
            {touchTimes === 3 && (
              <span className="text-sm text-muted-foreground">
                From 2025/10/30
                <br />
                Site Page Views: {sitePv}
                <br />
                Unique Visitors: {siteUv}
              </span>
            )}

            <span className="text-sm text-muted-foreground">
              Developed by{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={FOOTER_CONFIG.github}
                    className="text-primary hover:text-primary/80 underline font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    tantuyu
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>我真的不是電神...</p>
                </TooltipContent>
              </Tooltip>
            </span>

            {/* contributor */}
            <span className="text-sm text-muted-foreground">
              Contributor:{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://github.com/pan93412"
                    className="text-primary hover:text-primary/80 underline font-medium transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pan
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>這才是真的電神...</p>
                </TooltipContent>
              </Tooltip>
            </span>
          </div>

          {/* 連結區域 */}
          <div className="flex items-center space-x-6">
            <a
              href={FOOTER_CONFIG.github_thu_course_frontend}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              前端專案
            </a>
            <a
              href={FOOTER_CONFIG.github_thu_course_crawler}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              爬蟲專案
            </a>
            <a
              href={FOOTER_CONFIG.github}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
