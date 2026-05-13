interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
}

export function Loader({ size = "md", fullScreen, text }: LoaderProps) {
  const sizes = { sm: "size-5 border-2", md: "size-8 border-3", lg: "size-12 border-4" };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} animate-spin rounded-full border-primary-200 border-t-primary-500`} />
      {text && <p className="text-sm text-secondary-400">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">{spinner}</div>;
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}
