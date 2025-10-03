"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
    ],
  },
  mobile: {
    quickLinks: [
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
    ],
  },
};

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center">
        {/* 手機版品牌 */}
        <div className="flex md:hidden">
          <Link className="flex items-center space-x-2" href="/">
            <span className="font-bold text-sm">{NAVBAR_CONFIG.brand}</span>
          </Link>
        </div>

        {/* 桌面版導航 */}
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">{NAVBAR_CONFIG.brand}</span>
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

        {/* 手機版快速連結 */}
        <div className="ml-auto flex md:hidden gap-2 items-center">
          {NAVBAR_CONFIG.mobile.quickLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-xs px-2 py-1 rounded hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
          <ModeToggle />
        </div>

        {/* 桌面版右側區域 */}
        <div className="ml-auto hidden md:flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
