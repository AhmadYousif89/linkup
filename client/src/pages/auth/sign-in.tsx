import { SignIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function SignInPage() {
  return (
    <main className="grid">
      <h1 className="mb-4 p-4 text-2xl font-bold">
        <Link to="/home" className="hover:text-muted-foreground">
          LinkUp
        </Link>
      </h1>
      <div className="place-self-center">
        <SignIn path="/sign-in" />
      </div>
    </main>
  );
}
