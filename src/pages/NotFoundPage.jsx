import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-semibold text-(--color-accent)">404</p>
      <h1 className="mt-3 text-xl font-semibold text-(--color-primary)">Page not found</h1>
      <p className="mt-2 text-sm text-(--color-secondary)">
        The page you&apos;re looking for doesn&apos;t exist or was moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-sm bg-(--color-primary) px-5 py-2.5 text-sm font-medium text-(--color-background) hover:bg-(--color-secondary) transition-colors"
      >
        <LuArrowLeft size={15} /> Back to home
      </Link>
    </div>
  );
}
