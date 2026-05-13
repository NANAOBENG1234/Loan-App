import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-secondary-300 mb-4">404</p>
        <h1 className="text-xl font-bold mb-2">Page Not Found</h1>
        <p className="text-sm text-secondary-500 mb-6">The page you are looking for does not exist.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
