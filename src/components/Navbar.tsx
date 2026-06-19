"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, MessageSquarePlus, Home } from "lucide-react";
import { Map, Bookmark } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

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

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed bottom-0 z-50 w-full sm:sticky sm:top-0 sm:p-4">
      <div className="border-muted bg-foreground/5 mx-auto flex h-16 max-w-7xl items-center justify-center rounded-none border-t border-t-white/10 px-4 py-2 backdrop-blur-lg sm:h-fit sm:rounded-md">
        {/* 桌面版導航 */}
        <div className="mr-4 hidden sm:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="flex items-center gap-2 text-lg font-bold">
              <Badge
                variant="default"
                className={cn(getAcademicYearAndSemester() ? "" : "hidden")}
              >
                {getAcademicYearAndSemester()}
              </Badge>
              {NAVBAR_CONFIG.brand}
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {NAVBAR_CONFIG.navigation.items.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    asChild
                    active={isActive(item.href)}
                    className={cn(
                      isActive(item.href) ? "bg-accent/50" : undefined,
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex flex-row items-center gap-2"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* 手機版選單 */}
        <div className="flex items-center gap-4 sm:hidden">
          <Button
            variant="ghost"
            className="gap-1 rounded-full"
            size="icon-lg"
            asChild
          >
            <Link href={"/"} className="flex flex-col items-center">
              <Home className="h-4 w-4" />
              <span className="text-[10px]">首頁</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="gap-1 rounded-full"
            size="icon-lg"
            asChild
          >
            <Link href={"/bookmarks"} className="flex flex-col items-center">
              <Bookmark className="h-4 w-4" />
              <span className="text-[10px]">書籤</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="gap-1 rounded-full"
            size="icon-lg"
            asChild
          >
            <Link href={"/school-map"} className="flex flex-col items-center">
              <Map className="h-4 w-4" />
              <span className="text-[10px]">地圖</span>
            </Link>
          </Button>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-1 rounded-full">
                {session.user?.image ? (
                  <>
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={16}
                      height={16}
                      className="rounded-full object-cover"
                    />
                    <span className="text-[10px]">帳戶</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    <span className="text-[10px]">帳戶</span>
                  </>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-9999">
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
            <Button
              variant="ghost"
              className="gap-1 rounded-full"
              size="icon-lg"
              asChild
            >
              <Link
                href={"/auth/signin"}
                className="flex flex-col items-center"
              >
                <LogIn className="h-4 w-4" />
                <span className="text-[10px]">登入</span>
              </Link>
            </Button>
          )}
        </div>

        {/* 桌面版右側區域 */}
        <div className="ml-auto hidden items-center gap-2 sm:flex">
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
              <DropdownMenuContent align="end" className="z-9999">
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
