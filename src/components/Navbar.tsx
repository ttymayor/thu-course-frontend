"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import ModeToggle from "./ModeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sendGAEvent } from "@next/third-parties/google";

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
        label: "排課模擬器",
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
        label: "排課模擬器",
        href: "/schedule-simulator",
      },
    ],
  },
};

export default function Navbar() {
  const handleReplayAnimation = () => {
    localStorage.removeItem("first-loading");
    window.location.reload();
    sendGAEvent("ReplayAnimation", "buttonClicked", {
      value: "ReplayAnimation",
    });
  };

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
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReplayAnimation}
                  className="cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>重播動畫</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
