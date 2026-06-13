export default function Frame({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 md:flex-row">{children}</div>;
}
