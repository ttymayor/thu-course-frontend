export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <main className="flex flex-col items-center justify-center gap-8 sm:gap-[32px]">
        {children}
      </main>
    </div>
  );
}
