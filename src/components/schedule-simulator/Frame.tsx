export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row">{children}</div>
    </main>
  );
}
