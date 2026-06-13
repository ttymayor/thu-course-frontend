"use client";

import { motion } from "motion/react";

export function Section({
  id,
  title,
  icon,
  action,
  children,
}: React.PropsWithChildren<{
  id: string;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}>) {
  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(2px)" }}
      whileInView={{ opacity: 1, filter: "blur(0)" }}
      viewport={{ once: true }}
      id={id}
      className="flex w-full flex-col items-start gap-4"
    >
      {title && (
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </motion.section>
  );
}
