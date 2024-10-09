import { ProfilePanel } from "./profile";
import { SidePanel } from "./side_panel";
import { MainContent } from "./main_content";

export default function Dashboard() {
  return (
    <main className="flex h-full bg-primary">
      <SidePanel />

      <section className="z-50 flex flex-grow flex-col border-x border-muted-foreground text-black">
        <MainContent />
      </section>

      <ProfilePanel />
    </main>
  );
}
