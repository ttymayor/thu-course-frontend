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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

// 導航配置
const NAVBAR_CONFIG = {
  brand: "東海選課資訊",
  navigation: {
    items: [
      {
        label: "課程查詢",
        href: "/course-info",
      },
      {
        label: "排課模擬",
        href: "/schedule-simulator",
      },
      {
        label: "校園地圖",
        href: "/school-map",
      },
      {
        label: "我的書籤",
        href: "/bookmarks",
      },
    ],
  },
};

const getAcademicYearAndSemester = () => {
  const academicYear = process.env.NEXT_PUBLIC_ACADEMIC_YEAR as string;
  const academicSemester = process.env.NEXT_PUBLIC_ACADEMIC_SEMESTER as string;

  if (!academicYear || !academicSemester) {
    return "";
  }

  if (academicSemester === "1") {
    return `${academicYear} 上學期`;
  } else {
    return `${academicYear} 下學期`;
  }
};

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center">
        {/* 手機版品牌 */}
        <div className="flex md:hidden">
          <Link className="flex items-center space-x-2" href="/">
            <span className="font-bold text-base">{NAVBAR_CONFIG.brand}</span>
          </Link>
        </div>

        {/* 桌面版導航 */}
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  getAcademicYearAndSemester() === "" ? "hidden" : ""
                )}
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
                      isActive(item.href) ? "bg-accent/50" : undefined
                    )}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 手機版選單 */}
        <div className="ml-auto flex md:hidden gap-2 items-center">
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
                <SheetTitle>{NAVBAR_CONFIG.brand}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8 px-4">
                {NAVBAR_CONFIG.navigation.items.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* 桌面版右側區域 */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
