export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
      <main className="flex flex-col gap-8 sm:gap-[32px] items-center justify-center">
        {children}
      </main>
    </div>
  );
}
