import { cn } from "@/lib/utils";
import { useProfilePanelStore } from "./lib/store";

export function ProfilePanel() {
  const { isOpen } = useProfilePanelStore();

  return (
    <section
      className={cn([
        "fixed right-0 top-32 z-50 h-full w-5/12 flex-col overflow-hidden border-l border-muted-foreground bg-red-200 md:relative md:top-0",
        "transition-all duration-500 ease-in-out",
        "lg:flex",
        isOpen ? "basis-1/2 xl:basis-1/3" : "basis-0",
      ])}
    >
      <header className="flex h-16 items-center justify-between border-b border-muted-foreground">
        <h2 className="px-4 text-base font-semibold text-muted-foreground">
          Profile
        </h2>
      </header>
    </section>
  );
}
