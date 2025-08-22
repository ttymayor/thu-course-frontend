"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Department } from "./types";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";

export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearchQuery = searchParams.get("search") || "";
  const currentSelectedDepartment = searchParams.get("department") || "";

  const [searchQuery, setSearchQuery] = useState(currentSearchQuery);
  const [selectedDepartment, setSelectedDepartment] = useState(
    currentSelectedDepartment
  );

  const [open, setOpen] = useState(false);

  const { data: departments, isLoading } = useSWR(
    "/api/departments",
    async (key: string) => {
      return (await fetch(key).then((res) => res.json())).data as Department[];
    }
  );

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
  const departmentsByCollege = departments?.reduce((acc, dept) => {
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
    if (!selectedDepartment || selectedDepartment === "all") return "所有系所";
    const dept = departments?.find(
      (d) => d.department_code === selectedDepartment
    );
    return dept ? dept.department_name : "所有系所";
  };

  // 更新 URL search params
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateSearchParams = (params: Record<string, string | null>) => {
    if (debounce.current) {
      clearTimeout(debounce.current);
    }
    debounce.current = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          current.delete(key);
        } else {
          current.set(key, value);
        }
      });

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`/course-info${query}`);
    }, 200);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    updateSearchParams({ search: e.target.value, page: null });
  };

  const handleDepartmentChange = (deptCode: string) => {
    setSelectedDepartment(deptCode);
    updateSearchParams({
      department: deptCode === "" ? null : deptCode,
      page: null,
    });
  };

  return (
    <div className="mb-4 flex gap-2 flex-wrap justify-end">
      {isLoading ? (
        <Skeleton className="w-full md:w-[270px] h-10" />
      ) : (
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
                      handleDepartmentChange("");
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedDepartment === "" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    所有系所
                  </CommandItem>
                </CommandGroup>
                {departmentsByCollege && Object.entries(departmentsByCollege)
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
                              handleDepartmentChange(dept.department_code);
                              setOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedDepartment === dept.department_code
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
      )}
      <Input
        id="search"
        type="text"
        placeholder="搜尋課程代碼、課程名稱或系所代碼..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="border w-full md:w-[270px] h-10 text-sm px-3 py-2"
      />
    </div>
  );
}
