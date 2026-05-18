"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 cursor-pointer px-0"
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">切換主題</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer text-sm"
        >
          淺色模式
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer text-sm"
        >
          深色模式
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer text-sm"
        >
          跟隨系統
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModeToggleList() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const activeTheme = mounted ? theme : undefined;
  return (
    <div className="flex flex-row items-center gap-2 rounded-full px-2 py-1">
      <button
        onClick={() => setTheme("light")}
        className={`border-bg-foreground rounded-full border p-px ${activeTheme === "light" ? "bg-accent" : ""}`}
      >
        <Sun className="size-3" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`border-bg-foreground rounded-full border p-px ${activeTheme === "dark" ? "bg-accent" : ""}`}
      >
        <Moon className="size-3" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`border-bg-foreground rounded-full border p-px ${activeTheme === "system" ? "bg-accent" : ""}`}
      >
        <Monitor className="size-3" />
      </button>
    </div>
  );
}
