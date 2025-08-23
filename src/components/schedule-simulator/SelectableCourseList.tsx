"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CourseInfoData, CourseTypeMap } from "@/components/course-info/types";

interface SelectableCourseListProps {
  infos: CourseInfoData[];
  selectedCourseCodes: Set<string>;
  onSelectionChange: (course: CourseInfoData, isSelected: boolean) => void;
  onCourseHover?: (course: CourseInfoData | null) => void;
}

export default function SelectableCourseList({
  infos,
  selectedCourseCodes,
  onSelectionChange,
  onCourseHover,
}: SelectableCourseListProps) {
  const courseTypeMap: CourseTypeMap = {
    1: "必修",
    2: "必選",
    3: "選修",
  };

  return (
    <TooltipProvider>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="h-12">
              <TableHead className="w-12 px-4"></TableHead>
              <TableHead className="">課程</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {infos.map((item: CourseInfoData) => (
              <TableRow
                key={item.course_code}
                className={`h-12 ${item.is_closed ? "opacity-30" : ""}`}
                onMouseEnter={() => onCourseHover?.(item)}
                onMouseLeave={() => onCourseHover?.(null)}
              >
                <TableCell className="text-center">
                  <Checkbox
                    checked={selectedCourseCodes.has(item.course_code)}
                    onCheckedChange={(checked) => {
                      onSelectionChange(item, !!checked);
                    }}
                    disabled={item.is_closed}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <div>
                      <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {item.course_code}
                      </code>
                    </div>
                    <div className="flex flex-col">
                      <div>
                        {item.is_closed ? (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="line-through">
                                {item.course_name}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>已停開...</span>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Link
                            href={`/course-detail/${item.course_code}`}
                            className="underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.course_name}
                          </Link>
                        )}
                        <Badge variant={"secondary"} className="ml-2 text-xs">
                          {courseTypeMap[item.course_type] || item.course_type}{" "}
                          {item.credits_1}-{item.credits_2}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.teachers?.length
                          ? `${item.teachers.join("、")}`
                          : "-"}
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
