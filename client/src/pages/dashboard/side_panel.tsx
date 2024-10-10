import { cn } from "@/lib/utils";
import { usePreventScroll } from "@/hooks/use_prevent_scroll";

import { Tabs, TabsContent } from "@/components/ui/tabs";

import { SideBar } from "./side_panel_contents/sidebar";
import { UserDMs } from "./side_panel_contents/user_dms";
import { UserRooms } from "./side_panel_contents/user_rooms";
import { UserGroups } from "./side_panel_contents/user_groups";
import { AddFriend } from "./side_panel_contents/add_friend";
import { Tab, useActiveTabStore } from "./lib/store";

export function SidePanel() {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const preventWindowScroll = activeTab && window.innerWidth < 768;
  usePreventScroll(preventWindowScroll);

  return (
    <>
      {/* Side Panel */}
      <SideBar />

      {/* Backdrop Overlay */}
      <div
        onClick={() => setActiveTab("")}
        className={cn([
          "fixed left-0 z-[60] size-full bg-muted-foreground/50 backdrop-blur-sm transition duration-300",
          activeTab ? "translate-x-0 ease-out" : "-translate-x-full ease-in",
          "md:hidden",
        ])}
      />

      {/* Tabs Container */}
      <Tabs
        orientation="vertical"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as Tab);
        }}
      >
        <div
          className={cn([
            "fixed z-[70] h-full max-w-80 bg-primary text-secondary transition-all duration-500 ease-in-out md:relative",
            activeTab
              ? "visible ml-0 min-w-72 opacity-100 md:min-w-80"
              : "invisible -ml-72 opacity-0 md:-ml-80",
          ])}
        >
          {/* Messages */}
          <div className="sticky top-0">
            <AddFriend />
            {/* User ACtive Messages */}
            <UserDMs />

            {/* Rooms */}
            <UserRooms />

            {/* Groups */}
            <UserGroups />

            {/* More */}
            <TabsContent value="More">
              <header className="flex h-16 items-center gap-4 border-b border-muted-foreground">
                <h2 className="p-4 font-medium text-muted">Settings</h2>
              </header>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </>
  );
}
