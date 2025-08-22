
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  total: number;
  pageSize?: number;
}

export default function Pagination({ total, pageSize = 10 }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const totalPages = Math.ceil(total / pageSize);

  // 更新 URL search params
  const updateSearchParams = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (page === 1) {
      current.delete("page");
    } else {
      current.set("page", page.toString());
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/course-info${query}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center mt-4">
      <UIPagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  updateSearchParams(currentPage - 1);
                }}
                aria-label={`前往第 ${currentPage - 1} 頁`}
              />
            ) : (
              <PaginationPrevious 
                className="pointer-events-none opacity-50"
                aria-label="目前已在第一頁"
              />
            )}
          </PaginationItem>
          
          {(() => {
            const items = [];
            
            // 顯示第一頁
            if (totalPages > 0) {
              items.push(
                <PaginationItem key={1}>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      updateSearchParams(1);
                    }}
                    isActive={currentPage === 1}
                    aria-label="前往第 1 頁"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              );
            }
            
            // 前面省略
            if (currentPage > 3) {
              items.push(<PaginationEllipsis key="start-ellipsis" />);
            }
            
            // 中間頁碼 (只顯示三頁: 前一頁、當前頁、後一頁)
            for (
              let i = Math.max(2, currentPage - 1);
              i <= Math.min(totalPages - 1, currentPage + 1);
              i++
            ) {
              items.push(
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      updateSearchParams(i);
                    }}
                    isActive={currentPage === i}
                    aria-label={`前往第 ${i} 頁`}
                  >
                    {i}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            
            // 後面省略
            if (currentPage < totalPages - 2) {
              items.push(<PaginationEllipsis key="end-ellipsis" />);
            }
            
            // 顯示最後一頁
            if (totalPages > 1) {
              items.push(
                <PaginationItem key={totalPages}>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      updateSearchParams(totalPages);
                    }}
                    isActive={currentPage === totalPages}
                    aria-label={`前往第 ${totalPages} 頁`}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            
            return items;
          })()}
          
          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  updateSearchParams(currentPage + 1);
                }}
                aria-label={`前往第 ${currentPage + 1} 頁`}
              />
            ) : (
              <PaginationNext
                className="pointer-events-none opacity-50"
                aria-label="目前已在最後一頁"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </UIPagination>
    </div>
  );
}
