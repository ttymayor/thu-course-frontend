"use client";

import { motion } from "motion/react";

export function Section({
  id,
  children,
}: React.PropsWithChildren<{
  id: string;
}>) {
  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(2px)" }}
      whileInView={{ opacity: 1, filter: "blur(0)" }}
      viewport={{ once: true }}
      id={id}
      className="flex w-full flex-col items-start gap-4"
    >
      {children}
    </motion.section>
  );
}
