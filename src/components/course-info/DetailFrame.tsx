interface DetailFrameProps {
  children: React.ReactNode;
}

export default function DetailFrame({ children }: DetailFrameProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-0 lg:px-8">
      {children}
    </div>
  );
}
