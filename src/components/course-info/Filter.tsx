"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Department } from "@/types/department";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import {
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "../ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useDebounceTransition } from "@/lib/debounceTransition";
import { InputGroup } from "@/components/ui/input-group";

export default function Filter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearchQuery = searchParams.get("search") || "";
  const currentSelectedDepartment = searchParams.get("department") || "";

  const [searchQuery, setSearchQuery] = useState(currentSearchQuery);
  const [selectedDepartment, setSelectedDepartment] = useState(
    currentSelectedDepartment,
  );

  const [open, setOpen] = useState(false);
  const [isPending, debounceTransition] = useDebounceTransition();

  const { data: departments, isLoading } = useSWR(
    "/api/departments",
    async (key: string) => {
      return (await fetch(key).then((res) => res.json())).data as Department[];
    },
  );

  // 按學院分類系所 - 使用 category_code 和 category_name
  const departmentsByCollege = departments?.reduce(
    (acc, dept) => {
      const categoryCode = dept.category_code;
      if (!acc[categoryCode]) {
        acc[categoryCode] = {
          categoryName: dept.category_name,
          departments: [],
        };
      }
      acc[categoryCode].departments.push(dept);
      return acc;
    },
    {} as Record<string, { categoryName: string; departments: Department[] }>,
  );

  // 獲取當前選中的系所名稱
  const getSelectedDeptName = () => {
    if (!selectedDepartment || selectedDepartment === "all") return "所有系所";
    const dept = departments?.find(
      (d) => d.department_code === selectedDepartment,
    );
    return dept ? dept.department_name : "所有系所";
  };

  const buildCleanSearchParams = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("page");
    return current;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    debounceTransition(() => {
      const current = buildCleanSearchParams();
      if (e.target.value === "") {
        current.delete("search");
      } else {
        current.set("search", e.target.value);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathname}${query}`);
    });
  };

  const handleDepartmentChange = (deptCode: string) => {
    setSelectedDepartment(deptCode);
    debounceTransition(() => {
      const current = buildCleanSearchParams();
      if (deptCode === "") {
        current.delete("department");
      } else {
        current.set("department", deptCode);
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathname}${query}`);
    });
  };

  return (
    <div className="mb-2 flex flex-wrap items-center gap-2">
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full cursor-pointer justify-between px-3 py-2 text-sm"
            >
              {getSelectedDeptName()}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder="搜尋系所..."
                className="h-10 px-3 text-sm"
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
                        selectedDepartment === "" ? "opacity-100" : "opacity-0",
                      )}
                    />
                    所有系所
                  </CommandItem>
                </CommandGroup>
                {departmentsByCollege &&
                  Object.entries(departmentsByCollege)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(
                      ([
                        categoryCode,
                        { categoryName, departments: depts },
                      ]) => (
                        <CommandGroup key={categoryCode} heading={categoryName}>
                          {depts
                            .sort((a, b) =>
                              a.department_code.localeCompare(
                                b.department_code,
                              ),
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
                                      : "opacity-0",
                                  )}
                                />
                                {dept.department_name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      ),
                    )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      <InputGroup className="w-full">
        <InputGroupAddon>
          {isPending ? <Spinner /> : <Search className="h-4 w-4" />}
        </InputGroupAddon>
        <InputGroupInput
          id="search"
          type="text"
          placeholder="搜尋課程代碼或課程名稱..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="h-10 w-full px-3 py-2 text-sm"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            className="cursor-pointer"
            disabled={!searchQuery}
            onClick={() => {
              setSearchQuery("");
              if (searchQuery) {
                debounceTransition(() => {
                  const current = buildCleanSearchParams();
                  current.delete("search");
                  const search = current.toString();
                  const query = search ? `?${search}` : "";
                  router.replace(`${pathname}${query}`);
                });
              }
            }}
          >
            <X className="h-4 w-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
