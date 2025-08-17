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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function GeneralEducationList() {
  const [infos, setInfos] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get("/api/general-education", {
        params: {
          page,
          pageSize,
          code,
          name,
        },
      })
      .then((res) => {
        setInfos(res.data.data);
        setTotal(res.data.total);
      });
  }, [page, pageSize, code, name]);

  return (
    <>
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>通識課程</CardTitle>
          <CardDescription>探索通識課程，拓展知識領域</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2 flex-wrap justify-end">
            <Input
              type="text"
              placeholder="課程代碼"
              value={code}
              onChange={(e) => {
                setPage(1);
                setCode(e.target.value);
              }}
              className="border rounded px-3 py-2 w-32"
            />
            <Input
              type="text"
              placeholder="課程名稱"
              value={name}
              onChange={(e) => {
                setPage(1);
                setName(e.target.value);
              }}
              className="border rounded px-3 py-2 w-40"
            />
          </div>
          <Table>
            <TableCaption>通識課程一覽</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">學期</TableHead>
                <TableHead className="text-center">學年</TableHead>
                <TableHead className="text-center">課程代碼</TableHead>
                <TableHead className="text-center">課程名稱</TableHead>
                <TableHead className="text-center">課程類型</TableHead>
                <TableHead className="text-center">上下學期學分</TableHead>
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
                    <Badge variant="secondary">
                      {item.course_type === 1
                        ? "必修"
                        : item.course_type === 2
                        ? "必選"
                        : item.course_type === 3
                        ? "選修"
                        : item.course_type}
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
