import { DashboardHeader } from "./header";
import { SidePanel } from "./side_panel";
import { MainContent } from "./main_content";

export default function Dashboard() {
  return (
    <main className="grid bg-primary [grid-template-areas:'header_header_header''main_main_main']">
      <DashboardHeader />

      <div className="relative min-h-screen [grid-area:main]">
        <SidePanel />
      </div>
      <div className="ml-16 border-l text-black [grid-area:main]">
        <MainContent />
      </div>
    </main>
  );
}
