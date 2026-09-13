export default function BorrowerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-backdrop">
      <div className="app-shell">
        {children}
      </div>
    </div>
  );
}