export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 md:flex-row">
      {children}
    </div>
  );
}
