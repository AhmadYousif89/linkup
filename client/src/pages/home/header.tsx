import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";

export function MainHeader() {
  return (
    <header className="container border-b border-input">
      <div className="flex min-h-16 items-center justify-between px-4">
        <div className="text-2xl font-bold text-white">
          <Link to="/home">LinkUp</Link>
        </div>
        <SignedOut>
          <nav>
            <ul className="flex gap-4 text-sm text-primary">
              <li>
                <Button
                  asChild
                  size={"sm"}
                  variant={"outline"}
                  className="font text-xs"
                >
                  <SignUpButton fallbackRedirectUrl={"/dashboard"}>
                    Sign up
                  </SignUpButton>
                </Button>
              </li>
              <li>
                <Button
                  asChild
                  size={"sm"}
                  variant={"outline"}
                  className="font text-xs"
                >
                  <SignInButton fallbackRedirectUrl={"/dashboard"}>
                    Sign in
                  </SignInButton>
                </Button>
              </li>
            </ul>
          </nav>
        </SignedOut>

        <SignedIn>
          <nav>
            <ul className="flex items-center gap-6">
              <li>
                <Button size={"sm"} className="w-20 p-0 text-xs font-semibold">
                  <Link
                    to="/dashboard"
                    className="flex size-full items-center justify-center"
                  >
                    Dashboard
                  </Link>
                </Button>
              </li>
              <li className="flex">
                <UserButton />
              </li>
            </ul>
          </nav>
        </SignedIn>
      </div>
    </header>
  );
}
