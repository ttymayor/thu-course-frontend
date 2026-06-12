interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-0 lg:px-8">
      <main className="flex items-start justify-between gap-8 sm:gap-8">
        {children}
      </main>
    </div>
  );
}
