import { SignUp } from "@clerk/clerk-react";
export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center">
      <SignUp path="/sign-up" />
    </main>
  );
}
