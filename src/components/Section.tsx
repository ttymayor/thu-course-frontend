"use client";

import { motion } from "motion/react";

export function Section({
  id,
  title,
  icon,
  children,
}: React.PropsWithChildren<{
  id: string;
  title?: string;
  icon?: React.ReactNode;
}>) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      id={id}
      className="mb-8 w-full max-w-4xl space-y-4"
    >
      {title && (
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      )}
      {children}
    </motion.section>
  );
}
