import { Link } from "react-router-dom";
import { SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons/github_icon";
import { SignUpButton, useUser } from "@clerk/clerk-react";

export function HeroSection() {
  const { user } = useUser();

  return (
    <section className="relative grid h-[80svh] place-items-center">
      <p className="absolute left-1/2 top-16 mb-4 flex w-full max-w-xs -translate-x-1/2 cursor-default items-center justify-center rounded-full border bg-gradient-to-br from-transparent to-secondary py-1.5 lg:top-32">
        <SparklesIcon
          aria-label="Sparkles icon"
          className="absolute left-4 size-4 text-indigo-400"
        />
        <span className="text-xs font-bold capitalize">
          The best digital meeting place
        </span>
      </p>
      {/* Hero content */}
      <div className="mx-auto max-w-screen-md py-16 text-center">
        <h1 className="grid animate-slideDown pb-4 text-4xl font-bold leading-normal text-white md:text-5xl md:leading-normal">
          <span className="bg-gradient-to-b from-indigo-400 to-primary bg-clip-text text-transparent">
            LinkUp Chat App
          </span>
          <span className="bg-gradient-to-br from-primary to-transparent bg-clip-text text-3xl text-transparent md:text-4xl">
            Connect with anyone, anywhere
          </span>
        </h1>

        <h3 className="mt-8 text-balance text-sm md:text-base">
          <span className="inline-block max-w-[80ch] text-primary dark:text-muted-foreground">
            Stay in touch with your loved ones, anywhere. Enjoy seamless
            messaging, group chats, and multimedia sharing.
          </span>
        </h3>

        {/* CTA */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <Button
            asChild
            size={"lg"}
            variant={"ghost"}
            className="h-10 w-28 rounded-lg border bg-primary/10 bg-gradient-to-br from-primary/10 via-muted/10 to-indigo-500 p-0 font-semibold text-secondary shadow hover:bg-muted/20 dark:border-primary dark:text-primary"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="flex size-full items-center justify-center"
              >
                Dashboard
              </Link>
            ) : (
              <span>
                <SignUpButton mode="modal">Join now</SignUpButton>
              </span>
            )}
          </Button>
          <Button
            variant={"ghost"}
            className="group h-10 w-28 gap-2 rounded-lg border bg-primary/10 font-semibold text-secondary shadow hover:bg-input/50 dark:border-primary dark:text-primary"
          >
            <GithubIcon className="size-5 fill-secondary group-hover:fill-primary dark:fill-primary" />
            <a
              href="https://github.com/AhmadYousif89/linkup"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </Button>
        </div>
      </div>
      {/* Hero background image */}
      <div className="hero-bg apply-mask absolute inset-x-0 bottom-[-60%] top-[-40%] z-[-1] animate-fadeIn [--to-bg-opacity:.6] lg:[--to-bg-opacity:.8]"></div>
    </section>
  );
}
