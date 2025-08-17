import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FOOTER_CONFIG = {
  github_thu_course_frontend: "https://github.com/ttymayor/thu-course-frontend",
  github_thu_course_crawler: "https://github.com/ttymayor/thu-course-crawler",
  github: "https://github.com/ttymayor",
};

export default function Footer() {
  return (
    <div className="w-full h-18 border-b bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-300/60">
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">東海選課資訊</span>
          <span className="text-sm text-muted-foreground">
            一個更好的課程資訊網
          </span>
        </div>
        <div className="flex items-center space-x-4 text-center">
          <span className="text-gray-700">
            Developed by{" "}
            <Tooltip>
              <TooltipTrigger>
                <a href={FOOTER_CONFIG.github} className="underline">
                  tantuyu
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>我真的不是電神...</p>
              </TooltipContent>
            </Tooltip>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href={FOOTER_CONFIG.github_thu_course_frontend}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            前端專案
          </a>
          <a
            href={FOOTER_CONFIG.github_thu_course_crawler}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            爬蟲專案
          </a>
          <a
            href={FOOTER_CONFIG.github}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
