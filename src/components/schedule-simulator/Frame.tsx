export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background mx-auto">
      <div className="flex flex-col gap-4 md:flex-row">{children}</div>
    </main>
  );
}
