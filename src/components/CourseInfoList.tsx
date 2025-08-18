"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type CourseTypeMap = Record<number, string>;

interface Department {
  department_code: string;
  department_name: string;
}

interface CourseInfoData {
  _id: string;
  academic_semester: string;
  academic_year: string;
  course_code: string;
  course_name: string;
  course_type: number;
  credits_1: number;
  credits_2: number;
  department_code: string;
  department_name: string;
}

export default function CourseInfoList() {
  const [infos, setInfos] = useState<CourseInfoData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const courseTypeMap: CourseTypeMap = {
    1: "必修",
    2: "必選",
    3: "選修",
  };

  // 學院映射
  const collegeMap = {
    1: "文學院",
    2: "理學院",
    3: "工學院",
    4: "管理學院",
    5: "社會科學院",
    6: "農學院",
    7: "創藝學院",
    8: "法律學院",
    9: "國際學院",
  };

  // 根據系所代碼獲取學院
  const getCollegeByDeptCode = (deptCode: string): number => {
    const firstDigit = parseInt(deptCode.charAt(0), 10);
    return firstDigit >= 1 && firstDigit <= 9 ? firstDigit : 0;
  };

  // 按學院分類系所
  const departmentsByCollege = departments.reduce((acc, dept) => {
    const collegeId = getCollegeByDeptCode(dept.department_code);
    if (collegeId > 0) {
      if (!acc[collegeId]) {
        acc[collegeId] = [];
      }
      acc[collegeId].push(dept);
    } else {
      // 其他分類 (使用 0 作為 key)
      if (!acc[0]) {
        acc[0] = [];
      }
      acc[0].push(dept);
    }
    return acc;
  }, {} as Record<number, Department[]>);

  // 獲取當前選中的系所名稱
  const getSelectedDeptName = () => {
    if (!selectedDept || selectedDept === "all") return "所有系所";
    const dept = departments.find((d) => d.department_code === selectedDept);
    return dept ? dept.department_name : "所有系所";
  };

  // 載入系所列表
  useEffect(() => {
    axios
      .get("/api/departments")
      .then((res) => {
        if (res.data.success) {
          setDepartments(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Failed to load departments:", error);
      });
  }, []);

  // 搜尋延遲處理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 延遲 500ms

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    };

    // 如果選擇了特定系所，直接使用系所篩選
    if (selectedDept) {
      params.department_code = selectedDept;
      // 在特定系所內搜尋時，只搜尋課程代碼和課程名稱
      if (debouncedSearchQuery) {
        params.course_code = debouncedSearchQuery;
        params.course_name = debouncedSearchQuery;
      }
    } else {
      // 沒有選擇系所時，使用統一搜尋（包含系所代碼）
      if (debouncedSearchQuery) {
        params.course_code = debouncedSearchQuery;
        params.course_name = debouncedSearchQuery;
        params.department_code = debouncedSearchQuery;
      }
    }

    setIsLoading(true);
    axios
      .get("/api/course-info", {
        params,
      })
      .then((res) => {
        setInfos(res.data.data);
        setTotal(res.data.total);
      })
      .catch((error) => {
        console.error("Failed to load course info:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page, pageSize, debouncedSearchQuery, selectedDept]);

  return (
    <>
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>選課資訊</CardTitle>
          <CardDescription>來看看選課資訊吧</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2 flex-wrap justify-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full md:w-[270px] cursor-pointer justify-between h-10 text-sm px-3 py-2"
                >
                  {getSelectedDeptName()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full md:w-[270px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="搜尋系所..."
                    className="h-10 text-sm px-3"
                  />
                  <CommandList>
                    <CommandEmpty>找不到系所。</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          setPage(1);
                          setSelectedDept("");
                          setOpen(false);
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedDept === "" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        所有系所
                      </CommandItem>
                    </CommandGroup>
                    {Object.entries(departmentsByCollege)
                      .sort(([a], [b]) => {
                        // 將其他分組(0)排在最後
                        if (parseInt(a) === 0) return 1;
                        if (parseInt(b) === 0) return -1;
                        return parseInt(a) - parseInt(b);
                      })
                      .map(([collegeId, depts]) => (
                        <CommandGroup
                          key={collegeId}
                          heading={
                            parseInt(collegeId) === 0
                              ? "其他"
                              : collegeMap[
                                  parseInt(collegeId) as keyof typeof collegeMap
                                ]
                          }
                        >
                          {depts
                            .sort((a, b) =>
                              a.department_code.localeCompare(b.department_code)
                            )
                            .map((dept) => (
                              <CommandItem
                                key={dept.department_code}
                                value={`${dept.department_name} ${dept.department_code}`}
                                onSelect={() => {
                                  setPage(1);
                                  setSelectedDept(dept.department_code);
                                  setOpen(false);
                                }}
                                className="cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "h-4 w-4",
                                    selectedDept === dept.department_code
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {dept.department_name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              id="search"
              type="text"
              placeholder="搜尋課程代碼、課程名稱或系所代碼..."
              value={searchQuery}
              onChange={(e) => {
                setPage(1);
                setSearchQuery(e.target.value);
              }}
              className="border w-full md:w-[270px] h-10 text-sm px-3 py-2"
            />
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableCaption>課程資訊一覽</TableCaption>
              <TableHeader>
                <TableRow>
                  {/* <TableHead className="text-center">學期</TableHead>
                  <TableHead className="text-center">學年</TableHead> */}
                  <TableHead className="text-center">課程代碼</TableHead>
                  <TableHead className="text-center">課程名稱</TableHead>
                  <TableHead className="text-center">類型</TableHead>
                  <TableHead className="text-center">學分</TableHead>
                  <TableHead className="text-center">系所代碼</TableHead>
                  <TableHead className="text-center">系所名稱</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading
                  ? // Loading skeleton rows
                    Array.from({ length: pageSize }).map((_, idx) => (
                      <TableRow key={`skeleton-${idx}`}>
                        {/* <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell> */}
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-32 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-6 w-12 mx-auto rounded-full" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-12 mx-auto" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-4 w-24 mx-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : infos.map((item, idx) => (
                      <TableRow key={idx}>
                        {/* <TableCell className="text-center">
                          {item.academic_semester}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.academic_year}
                        </TableCell> */}
                        <TableCell className="text-center">
                          {item.course_code}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            href={`/course-detail/${item.course_code}`}
                            className="underline"
                          >
                            {item.course_name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={"secondary"} className="text-xs">
                            {courseTypeMap[item.course_type] ||
                              item.course_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.credits_1}/{item.credits_2}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.department_code}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.department_name}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1 && !isLoading) setPage(page - 1);
                  }}
                  className={isLoading ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {(() => {
                const totalPages = Math.ceil(total / pageSize);
                const items = [];
                // 顯示第一頁
                if (totalPages > 0) {
                  items.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        href="#"
                        isActive={page === 1}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isLoading) setPage(1);
                        }}
                        className={
                          isLoading ? "pointer-events-none opacity-50" : ""
                        }
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                // 前面省略
                if (page > 3) {
                  items.push(<PaginationEllipsis key="start-ellipsis" />);
                }
                // 中間頁碼 (只顯示三頁: 前一頁、當前頁、後一頁)
                for (
                  let i = Math.max(2, page - 1);
                  i <= Math.min(totalPages - 1, page + 1);
                  i++
                ) {
                  items.push(
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isLoading) setPage(i);
                        }}
                        className={
                          isLoading ? "pointer-events-none opacity-50" : ""
                        }
                      >
                        {i}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                // 後面省略
                if (page < totalPages - 2) {
                  items.push(<PaginationEllipsis key="end-ellipsis" />);
                }
                // 顯示最後一頁
                if (totalPages > 1) {
                  items.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        href="#"
                        isActive={page === totalPages}
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isLoading) setPage(totalPages);
                        }}
                        className={
                          isLoading ? "pointer-events-none opacity-50" : ""
                        }
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return items;
              })()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < Math.ceil(total / pageSize) && !isLoading)
                      setPage(page + 1);
                  }}
                  className={isLoading ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </>
  );
}
