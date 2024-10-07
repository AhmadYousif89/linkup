import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export function MainHeader() {
  return (
    <header className="container border-b border-input">
      <div className="flex min-h-16 items-center justify-between px-4">
        <div className="text-2xl font-bold text-white">
          <Link to="/home">LinkUp</Link>
        </div>
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
      </div>
    </header>
  );
}
