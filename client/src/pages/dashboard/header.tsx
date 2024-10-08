import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export function TopHeader() {
  return (
    <header className="border-b border-muted-foreground bg-primary">
      <div className="flex min-h-16 items-center justify-between px-6">
        <div className="text-xl font-bold text-secondary">
          <Link to="/home">LinkUp</Link>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
