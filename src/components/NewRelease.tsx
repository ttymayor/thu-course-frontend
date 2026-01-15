"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MoveRight } from "lucide-react";
import { motion } from "motion/react";

export function NewRelease() {
  return (
    <motion.div
      id="new-release"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Link href={"/course-info"}>
        <Badge variant={"outline"} className="hover:bg-muted">
          <div className="size-2 rounded-full bg-blue-500"></div>
          你知道嗎？卡片模式點擊
          <ExternalLink className="size-4" /> 可透過 Dcard 搜尋相關文章
          <MoveRight className="size-4" />
        </Badge>
      </Link>
    </motion.div>
  );
}
