import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-primary">
      <h1 className="text-6xl font-bold text-secondary">404</h1>
      <p className="mb-8 text-balance p-4 text-center text-gray-600 md:text-xl">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/home"
        className="rounded-md bg-secondary px-6 py-3 text-white transition-colors hover:bg-muted-foreground"
      >
        Back to homepage
      </Link>
    </main>
  );
}
