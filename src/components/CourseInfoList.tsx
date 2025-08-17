"use client";
import { useEffect, useState } from "react";
import axios from "axios";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
type CourseTypeMap = Record<number, string>;

interface Department {
  department_code: string;
  department_name: string;
}

export default function CourseInfoList() {
  const [infos, setInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
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

  // 載入系所列表
  useEffect(() => {
    axios.get("/api/departments").then((res) => {
      if (res.data.success) {
        setDepartments(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    // 根據選擇的系所設定過濾條件
    const deptFilter = selectedDept ? { department_code: selectedDept } : {};

    axios
      .get("/api/course-info", {
        params: {
          page,
          page_size: pageSize,
          course_code: courseCode,
          course_name: courseName,
          department_code: deptCode,
          ...deptFilter,
        },
      })
      .then((res) => {
        setInfos(res.data.data);
        setTotal(res.data.total);
      });
  }, [page, pageSize, courseCode, courseName, deptCode, selectedDept]);

  return (
    <>
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>選課資訊</CardTitle>
          <CardDescription>來看看選課資訊吧</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2 flex-wrap justify-end">
            <Select
              value={selectedDept}
              onValueChange={(value) => {
                setPage(1);
                setSelectedDept(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="選擇系所" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有系所</SelectItem>
                {Object.entries(departmentsByCollege)
                  .sort(([a], [b]) => {
                    // 將其他分組(0)排在最後
                    if (parseInt(a) === 0) return 1;
                    if (parseInt(b) === 0) return -1;
                    return parseInt(a) - parseInt(b);
                  })
                  .map(([collegeId, depts]) => (
                    <SelectGroup key={collegeId}>
                      <SelectLabel>
                        {parseInt(collegeId) === 0
                          ? "其他"
                          : collegeMap[
                              parseInt(collegeId) as keyof typeof collegeMap
                            ]}
                      </SelectLabel>
                      {depts
                        .sort((a, b) =>
                          a.department_code.localeCompare(b.department_code)
                        )
                        .map((dept) => (
                          <SelectItem
                            key={dept.department_code}
                            value={dept.department_code}
                          >
                            {dept.department_name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="課程代碼"
              value={courseCode}
              onChange={(e) => {
                setPage(1);
                setCourseCode(e.target.value);
              }}
              className="border px-3 py-2 w-32"
            />
            <Input
              type="text"
              placeholder="課程名稱"
              value={courseName}
              onChange={(e) => {
                setPage(1);
                setCourseName(e.target.value);
              }}
              className="border px-3 py-2 w-32"
            />
            <Input
              type="text"
              placeholder="系所代碼"
              value={deptCode}
              onChange={(e) => {
                setPage(1);
                setDeptCode(e.target.value);
              }}
              className="border px-3 py-2 w-32"
            />
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableCaption>課程資訊一覽</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">學期</TableHead>
                  <TableHead className="text-center">學年</TableHead>
                  <TableHead className="text-center">課程代碼</TableHead>
                  <TableHead className="text-center">課程名稱</TableHead>
                  <TableHead className="text-center">類型</TableHead>
                  <TableHead className="text-center">學分</TableHead>
                  <TableHead className="text-center">系所代碼</TableHead>
                  <TableHead className="text-center">系所名稱</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {infos.map((item: any, idx: number) => (
                  <TableRow key={item._id || idx}>
                    <TableCell className="text-center">
                      {item.academic_semester}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.academic_year}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.course_code}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.course_name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={"secondary"} className="text-xs">
                        {courseTypeMap[item.course_type] || item.course_type}
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
                    if (page > 1) setPage(page - 1);
                  }}
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
                          setPage(1);
                        }}
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
                          setPage(i);
                        }}
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
                          setPage(totalPages);
                        }}
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
                    if (page < Math.ceil(total / pageSize)) setPage(page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>
    </>
  );
}
