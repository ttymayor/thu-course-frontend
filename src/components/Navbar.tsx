"use client";

import { useState, type ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import {
  Bookmark,
  CalendarRange,
  Home,
  LogIn,
  LogOut,
  Map,
  Menu,
  MessageSquarePlus,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";

import { cn } from "@/lib/utils";
import {
  dedupeCourseTerms,
  getConfiguredCourseTerm,
  parseTermParams,
} from "@/lib/courseIdentity";
// 導航配置
const NAVBAR_CONFIG = {
  brand: "東海選課資訊",
  navigation: {
    items: [
      {
        label: "校園地圖",
        href: "/school-map",
        icon: <Map className="h-5 w-5" />,
      },
      {
        label: "我的書籤",
        href: "/bookmarks",
        icon: <Bookmark className="h-5 w-5" />,
      },
    ],
  },
};

interface MobileNavItemProps {
  href: string;
  label: string;
  active: boolean;
  reload?: boolean;
  children: ReactNode;
}

function MobileNavItem({
  href,
  label,
  active,
  reload = false,
  children,
}: MobileNavItemProps) {
  return (
    <DrawerClose
      nativeButton={false}
      render={
        <Link
          href={href}
          onClick={
            reload
              ? (event) => {
                  event.preventDefault();
                  window.location.assign(href);
                }
              : undefined
          }
          className={cn(
            "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium hover:bg-accent",
            active && "bg-accent text-accent-foreground",
          )}
        >
          {children}
          {label}
        </Link>
      }
    />
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isTermDialogOpen, setIsTermDialogOpen] = useState(false);

  const { data: termsResult } = useSWR(
    "/api/course-terms",
    async (url: string) => fetch(url).then((response) => response.json()),
  );
  const terms = dedupeCourseTerms(termsResult?.data ?? []);
  const items = terms.map((term) => ({
    label: `${term.academic_year} 學年度第 ${term.academic_semester} 學期`,
    value: `${term.academic_year}-${term.academic_semester}`,
  }));
  const selectedTerm =
    parseTermParams(searchParams) ??
    getConfiguredCourseTerm() ??
    terms[0] ??
    null;

  const isActive = (href: string) => pathname === href;

  const handleTermChange = (value: string | null) => {
    if (!value) return;

    const [academicYear, academicSemester] = value.split("-").map(Number);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("page");
    current.delete("codes");
    current.set("year", String(academicYear));
    current.set("semester", String(academicSemester));
    router.replace(`${pathname}?${current.toString()}`);
    setIsTermDialogOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full p-2 sm:p-4">
      <div className="border-muted mx-auto flex h-14 max-w-7xl items-center rounded-lg border bg-white/2 px-3 shadow-sm backdrop-blur-lg sm:px-4">
        <Dialog open={isTermDialogOpen} onOpenChange={setIsTermDialogOpen}>
          <DialogTrigger
            render={
              <Button
                variant="default"
                size="sm"
                className="mr-2 max-w-28 gap-1.5 rounded-full tabular-nums sm:mr-4 sm:max-w-none"
                aria-label="選擇學期"
                disabled={terms.length === 0}
              >
                <span className="truncate">
                  {selectedTerm
                    ? `${selectedTerm.academic_year} ${selectedTerm.academic_semester === 1 ? "上" : "下"}學期`
                    : "選擇學期"}
                </span>
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                  <CalendarRange className="size-5" />
                </span>
                選擇學期
              </DialogTitle>
              <DialogDescription>
                選擇要瀏覽及編輯課表的學年度與學期。
              </DialogDescription>
            </DialogHeader>
            <Field className="">
              <FieldLabel
                htmlFor="navbar-term-select"
                className="text-muted-foreground text-xs"
              >
                學年度／學期
              </FieldLabel>
              <Select
                value={
                  selectedTerm
                    ? `${selectedTerm.academic_year}-${selectedTerm.academic_semester}`
                    : undefined
                }
                onValueChange={handleTermChange}
                items={items}
                disabled={terms.length === 0}
              >
                <SelectTrigger
                  id="navbar-term-select"
                  className="w-full tabular-nums"
                >
                  <SelectValue placeholder="選擇學期">
                    {(value) =>
                      items.find((item) => item.value === value)?.label ??
                      "選擇學期"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  align="start"
                  alignItemWithTrigger={false}
                  className="min-w-(--anchor-width)"
                >
                  <SelectGroup>
                    {items.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.value}
                        className="tabular-nums"
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </DialogContent>
        </Dialog>

        <Link className="flex min-w-0 items-center gap-2" href="/">
          <span className="truncate text-base font-bold sm:text-lg">
            {NAVBAR_CONFIG.brand}
          </span>
        </Link>

        <nav
          aria-label="主要導覽"
          className="ml-6 hidden items-center gap-1 sm:flex"
        >
          {NAVBAR_CONFIG.navigation.items.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "outline" : "ghost"}
              nativeButton={false}
              render={
                <Link
                  href={item.href}
                  onClick={
                    item.href === "/school-map"
                      ? (event) => {
                          event.preventDefault();
                          window.location.assign(item.href);
                        }
                      : undefined
                  }
                  className="gap-2"
                >
                  {item.icon}
                  {item.label}
                </Link>
              }
            />
          ))}
        </nav>

        <div className="ml-auto hidden items-center sm:flex">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-md">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="使用者頭像"
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="size-5" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="size-5" />
                  個人資料
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/feedback")}>
                  <MessageSquarePlus className="size-5" />
                  意見回饋
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="size-5" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              nativeButton={false}
              aria-label="登入"
              render={
                <Link href="/auth/signin">
                  <LogIn className="size-5" />
                </Link>
              }
            />
          )}
        </div>

        <Drawer swipeDirection="right">
          <DrawerTrigger
            className="ml-auto flex size-9 items-center justify-center rounded-md sm:hidden"
            aria-label="開啟導覽選單"
          >
            <Menu className="size-5" />
          </DrawerTrigger>
          <DrawerContent
            style={{ "--drawer-inset": "10px" } as React.CSSProperties}
          >
            <DrawerHeader className="flex-row items-center justify-between border-b p-4">
              <DrawerTitle>選單</DrawerTitle>
              <DrawerDescription>前往網站各功能頁面</DrawerDescription>
              <DrawerClose
                className="hover:bg-accent flex size-9 items-center justify-center rounded-md"
                aria-label="關閉導覽選單"
              >
                <X className="size-5" />
              </DrawerClose>
            </DrawerHeader>

            <nav
              aria-label="手機版主要導覽"
              className="flex flex-col gap-1 p-3"
            >
              <MobileNavItem href="/" label="首頁" active={isActive("/")}>
                <Home className="size-5" />
              </MobileNavItem>
              {NAVBAR_CONFIG.navigation.items.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActive(item.href)}
                  reload={item.href === "/school-map"}
                >
                  {item.icon}
                </MobileNavItem>
              ))}
              <div className="my-2 border-t" />
              {session ? (
                <>
                  <MobileNavItem
                    href="/profile"
                    label="個人資料"
                    active={isActive("/profile")}
                  >
                    <User className="size-5" />
                  </MobileNavItem>
                  <MobileNavItem
                    href="/feedback"
                    label="意見回饋"
                    active={isActive("/feedback")}
                  >
                    <MessageSquarePlus className="size-5" />
                  </MobileNavItem>
                  <DrawerClose
                    className="text-destructive hover:bg-accent flex h-11 items-center gap-3 rounded-md px-3 text-sm"
                    onClick={() => signOut()}
                  >
                    <LogOut className="size-5" />
                    登出
                  </DrawerClose>
                </>
              ) : (
                <MobileNavItem
                  href="/auth/signin"
                  label="登入"
                  active={isActive("/auth/signin")}
                >
                  <LogIn className="size-5" />
                </MobileNavItem>
              )}
            </nav>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
}
