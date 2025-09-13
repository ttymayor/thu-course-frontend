export default function DetailFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl">
      {children}
    </div>
  );
}
