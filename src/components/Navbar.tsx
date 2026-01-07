"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Menu, User, MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { Search, CalendarDays, Map, Bookmark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";

// 導航配置
const NAVBAR_CONFIG = {
  brand: "東海選課資訊",
  navigation: {
    items: [
      {
        label: "課程資訊",
        href: "/course-info",
        icon: <Search className="h-5 w-5" />,
      },
      {
        label: "選課模擬器",
        href: "/schedule-simulator",
        icon: <CalendarDays className="h-5 w-5" />,
      },
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

const getAcademicYearAndSemester = () => {
  const academicYear = process.env.NEXT_PUBLIC_ACADEMIC_YEAR as string;
  const academicSemester = process.env.NEXT_PUBLIC_ACADEMIC_SEMESTER as string;

  if (!academicYear || !academicSemester) {
    return null;
  }

  if (academicSemester === "1") {
    return `${academicYear} 上學期`;
  } else {
    return `${academicYear} 下學期`;
  }
};

export default function Navbar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* 手機版品牌 */}
        <div className="flex md:hidden">
          <Link className="flex items-center space-x-2" href="/">
            <span className="flex items-center gap-2 text-lg font-bold">
              <Badge
                variant="secondary"
                className={cn(getAcademicYearAndSemester() ? "" : "hidden")}
              >
                {getAcademicYearAndSemester()}
              </Badge>{" "}
              {NAVBAR_CONFIG.brand}
            </span>
          </Link>
        </div>

        {/* 桌面版導航 */}
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="flex items-center gap-2 text-lg font-bold">
              <Badge
                variant="secondary"
                className={cn(getAcademicYearAndSemester() ? "" : "hidden")}
              >
                {getAcademicYearAndSemester()}
              </Badge>{" "}
              {NAVBAR_CONFIG.brand}
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {NAVBAR_CONFIG.navigation.items.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    className={cn(
                      isActive(item.href) ? "bg-accent/50" : undefined,
                    )}
                  >
                    <Link href={item.href}>
                      <div className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 手機版選單 */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">切換選單</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="z-[9999]">
              <SheetHeader>
                <SheetTitle>
                  <div className="flex items-center gap-2">
                    <Menu className="h-5 w-5" />
                    選單
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-20 flex flex-col gap-4 px-4">
                {NAVBAR_CONFIG.navigation.items.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "hover:text-primary text-lg font-medium transition-colors",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {link.icon}
                      {link.label}
                    </div>
                  </Link>
                ))}
              </div>
              {session ? (
                <SheetFooter>
                  <Button variant="ghost" size="default" asChild>
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <User className="h-5 w-5" />
                      個人資料
                    </Link>
                  </Button>
                  <Button variant="ghost" size="default" asChild>
                    <Link href="/feedback" onClick={() => setIsOpen(false)}>
                      <MessageSquarePlus className="h-5 w-5" />
                      意見回饋
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    登出
                  </Button>
                </SheetFooter>
              ) : (
                <SheetFooter>
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={() => {
                      setIsOpen(false);
                    }}
                    asChild
                  >
                    <Link href="/auth/signin">
                      <LogIn className="h-5 w-5" />
                      登入
                    </Link>
                  </Button>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>

        {/* 桌面版右側區域 */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ModeToggle />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-9 cursor-pointer items-center justify-center">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[9999]">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="h-5 w-5" />
                  個人資料
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/feedback")}>
                  <MessageSquarePlus className="h-5 w-5" />
                  意見回饋
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-5 w-5" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth/signin">
                <LogIn className="h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
