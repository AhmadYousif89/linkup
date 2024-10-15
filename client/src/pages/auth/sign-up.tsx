import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <main className="grid">
      <h1 className="mb-4 p-4 text-2xl font-bold">
        <Link to="/home" className="hover:text-muted-foreground">
          LinkUp
        </Link>
      </h1>
      <div className="place-self-center">
        <SignUp path="/sign-up" />
      </div>
    </main>
  );
}
