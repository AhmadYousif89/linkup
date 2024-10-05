import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function MainHeader() {
  return (
    <header className="container border-b border-input">
      <div className="flex min-h-20 items-center justify-between px-4">
        <div className="text-2xl font-bold text-white">
          <Link to="/home">LinkUp</Link>
        </div>
        <nav>
          <ul className="flex gap-4 text-sm text-primary">
            <li>
              <Button size={"sm"} variant={"outline"} className="font text-xs">
                <Link to="#">Sign up</Link>
              </Button>
            </li>
            <li>
              <Button size={"sm"} variant={"outline"} className="font text-xs">
                <Link to="#">Sign in</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
