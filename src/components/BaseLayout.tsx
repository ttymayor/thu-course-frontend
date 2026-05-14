interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <main className="flex items-start justify-between gap-8 sm:gap-8">
          {children}
        </main>
      </div>
    </>
  );
}
