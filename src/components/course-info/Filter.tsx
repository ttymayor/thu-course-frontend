"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox";
import { Search, X } from "lucide-react";
import { useSession } from "next-auth/react";
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

interface DepartmentOption {
  label: string;
  value: string;
  searchValue: string;
}

interface DepartmentGroup {
  label: string;
  sortKey: string;
  items: DepartmentOption[];
}

function guessStudentDeptCode(email: string | null | undefined): string | null {
  if (!email) return null;
  const id = email.split("@")[0].toUpperCase();
  const match = id.match(/^[A-Z]\d{2}(\d{3})\d{3}$/);
  return match ? match[1] : null;
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

export default function Filter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const currentSearchQuery = searchParams.get("search") || "";
  const currentSelectedDepartment = searchParams.get("department") || "";

  const [searchQuery, setSearchQuery] = useState(currentSearchQuery);
  const [selectedDepartment, setSelectedDepartment] = useState(
    currentSelectedDepartment,
  );
  const [departmentQuery, setDepartmentQuery] = useState("");

  const [isPending, debounceTransition] = useDebounceTransition();

  const { data: departments, isLoading } = useSWR(
    "/api/departments",
    async (key: string) => {
      return (await fetch(key).then((res) => res.json())).data as Department[];
    },
  );

  const guessedDeptCode = guessStudentDeptCode(session?.user?.email);
  const guessedDept = guessedDeptCode
    ? departments?.find((d) => d.department_code === guessedDeptCode)
    : null;

  const guessedDepartmentOptions: DepartmentOption[] = guessedDept
    ? [
        {
          label: guessedDept.department_name,
          value: guessedDept.department_code,
          searchValue: `${guessedDept.department_name} ${guessedDept.department_code}`,
        },
      ]
    : [];

  const departmentGroupsByCollege = (departments ?? [])
    .filter((dept) => dept.department_code !== guessedDept?.department_code)
    .reduce(
      (acc, dept) => {
        if (!acc[dept.category_code]) {
          acc[dept.category_code] = {
            label: dept.category_name,
            sortKey: dept.category_code,
            items: [],
          };
        }

        acc[dept.category_code].items.push({
          label: dept.department_name,
          value: dept.department_code,
          searchValue: `${dept.department_name} ${dept.department_code} ${dept.category_name}`,
        });

        return acc;
      },
      {} as Record<string, DepartmentGroup>,
    );

  const departmentGroups: DepartmentGroup[] = [
    ...(guessedDepartmentOptions.length > 0
      ? [
          {
            label: "猜你喜歡",
            sortKey: "",
            items: guessedDepartmentOptions,
          },
        ]
      : []),
    ...Object.values(departmentGroupsByCollege)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map((group) => ({
        ...group,
        items: group.items.sort((a, b) => a.value.localeCompare(b.value)),
      })),
  ];

  const departmentOptions = departmentGroups.flatMap((group) => group.items);
  const normalizedDepartmentQuery = normalizeSearchText(departmentQuery);
  const filteredDepartmentGroups = normalizedDepartmentQuery
    ? departmentGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((dept) =>
            normalizeSearchText(dept.searchValue).includes(
              normalizedDepartmentQuery,
            ),
          ),
        }))
        .filter((group) => group.items.length > 0)
    : departmentGroups;

  const selectedDepartmentOption = selectedDepartment
    ? (departmentOptions.find((dept) => dept.value === selectedDepartment) ??
      null)
    : null;
  const selectedDepartmentLabel = selectedDepartmentOption?.label ?? "";

  useEffect(() => {
    if (selectedDepartmentLabel) {
      setDepartmentQuery(selectedDepartmentLabel);
    }
  }, [selectedDepartmentLabel]);

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

  const handleDepartmentInputChange = (value: string) => {
    setDepartmentQuery(value);
    if (selectedDepartmentOption && value !== selectedDepartmentOption.label) {
      handleDepartmentChange("");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Combobox
          items={departmentOptions}
          value={selectedDepartmentOption}
          inputValue={departmentQuery}
          onValueChange={(dept) => {
            setDepartmentQuery(dept?.label ?? "");
            handleDepartmentChange(dept?.value ?? "");
          }}
          onInputValueChange={handleDepartmentInputChange}
          itemToStringValue={(dept) => dept.searchValue}
          itemToStringLabel={(dept) => dept.label}
          isItemEqualToValue={(item, value) => item.value === value.value}
          filter={null}
          autoHighlight
        >
          <ComboboxInput
            placeholder="搜尋系所..."
            className="w-full"
            showClear
          />
          <ComboboxContent>
            <ComboboxList>
              {filteredDepartmentGroups.length > 0 ? (
                filteredDepartmentGroups.map((group, index) => (
                  <ComboboxGroup key={group.label}>
                    <ComboboxLabel>{group.label}</ComboboxLabel>
                    {group.items.map((dept) => (
                      <ComboboxItem key={dept.value} value={dept}>
                        <span className="truncate">{dept.label}</span>
                      </ComboboxItem>
                    ))}
                    {index < filteredDepartmentGroups.length - 1 && (
                      <ComboboxSeparator className="bg-foreground/10" />
                    )}
                  </ComboboxGroup>
                ))
              ) : (
                <div className="text-muted-foreground py-2 text-center text-sm">
                  找不到系所。
                </div>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
      <InputGroup className="w-full">
        <InputGroupAddon>
          {isPending ? <Spinner /> : <Search className="size-4" />}
        </InputGroupAddon>
        <InputGroupInput
          id="search"
          type="text"
          placeholder="搜尋課程代碼、課程名稱或授課教師..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="h-10 w-full px-3 py-2 text-sm"
        />
        {searchQuery && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              className="cursor-pointer"
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
        )}
      </InputGroup>
    </div>
  );
}
