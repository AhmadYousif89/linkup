import { TopHeader } from "./header";
import { SidePanel } from "./side_panel";
import { MainContent } from "./main_content";
import { ProfilePanel } from "./profile";

import { Button } from "@/components/ui/button";
import { PanelLeftClose, Phone, Video } from "lucide-react";
import { useProfilePanelStore } from "./lib/store";

export default function Dashboard() {
  const { isOpen, setIsOpen } = useProfilePanelStore();

  return (
    <>
      <main className="flex h-full flex-col justify-between bg-primary">
        <TopHeader />
        {/* Chat Header */}
        <header className="flex min-h-16 items-center justify-between border-b border-muted-foreground px-3 lg:pl-16">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-xs text-primary">
              JD
            </div>
            {/* Active User */}
            <div className="*:block">
              <span className="text-sm font-semibold text-muted">John Doe</span>
              <small className="text-xs font-medium text-muted-foreground">
                Reply to message
              </small>
            </div>
          </div>
          {/* Chat Tools */}
          <div className="flex items-center gap-2 lg:gap-4">
            <Button
              size={"icon"}
              className="size-6 p-1 text-muted-foreground hover:text-muted lg:size-7"
            >
              <Video />
            </Button>
            <Button
              size={"icon"}
              className="size-6 p-1 text-muted-foreground hover:text-muted lg:size-7"
            >
              <Phone />
            </Button>

            <Button
              size={"icon"}
              onClick={() => setIsOpen(!isOpen)}
              className="p-0 text-muted-foreground hover:text-secondary"
            >
              <PanelLeftClose className={`${isOpen ? "text-secondary" : ""}`} />
            </Button>
          </div>
        </header>
        {/* Main Content */}
        <div className="flex h-full">
          <SidePanel />
          <section className="basis-full border-l border-muted-foreground text-black">
            <MainContent />
          </section>
          <ProfilePanel />
        </div>
      </main>
    </>
  );
}
