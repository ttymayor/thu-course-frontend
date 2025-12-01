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
import { Search, CalendarDays, Map, Bookmark } from "lucide-react";

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
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        {/* 手機版品牌 */}
        <div className="flex md:hidden">
          <Link className="flex items-center space-x-2" href="/">
            <span className="text-base font-bold">{NAVBAR_CONFIG.brand}</span>
          </Link>
        </div>

        {/* 桌面版導航 */}
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="flex items-center gap-2 font-bold">
              <Badge
                variant="secondary"
                className={cn(
                  getAcademicYearAndSemester() === "" ? "hidden" : "",
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
            </SheetContent>
          </Sheet>
        </div>

        {/* 桌面版右側區域 */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
