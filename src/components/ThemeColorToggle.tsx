"use client";

import * as React from "react";
import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeColor } from "@/components/ThemeColorProvider";
import { cn } from "@/lib/utils";

export default function ThemeColorToggle() {
  const { themeColor, setThemeColor } = useThemeColor();

  const colors = [
    { name: "coffee", label: "咖啡（Coffee）", color: "bg-[#ffdfb5]" },
    { name: "blue", label: "糖果藍 (Candy Blue)", color: "bg-[#a0d1e6]" },
    { name: "green", label: "靜默綠 (Silent Green)", color: "bg-[#7c9082]" },
    {
      name: "purple",
      label: "紫水晶薄霧 (Amethyst Haze)",
      color: "bg-[#a995c9]",
    },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 cursor-pointer px-0"
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">切換主題顏色</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color.name}
            onClick={() => setThemeColor(color.name)}
            className="flex cursor-pointer items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2">
              <div
                className={cn(
                  "h-4 w-4 rounded-full border",
                  color.name === "coffee" && "bg-[#ffdfb5]",
                  color.name === "blue" && "bg-[#a0d1e6]",
                  color.name === "green" && "bg-[#7c9082]",
                  color.name === "purple" && "bg-[#a995c9]",
                )}
              />
              {color.label}
            </span>
            {themeColor === color.name && (
              <span className="bg-primary h-2 w-2 rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
