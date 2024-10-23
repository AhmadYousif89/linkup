import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mb-4 text-balance p-4 text-center text-muted-foreground md:text-xl">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/home"
        className="rounded-md bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
      >
        Back to home
      </Link>
    </main>
  );
}
