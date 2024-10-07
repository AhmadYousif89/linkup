import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <header className="border-b border-muted-foreground [grid-area:header]">
      <div className="flex min-h-16 items-center justify-between px-8">
        <div className="text-xl font-bold text-secondary">
          <Link to="/home">LinkUp</Link>
        </div>
        <div className="">
          <UserButton />
        </div>
      </div>
    </header>
  );
}
