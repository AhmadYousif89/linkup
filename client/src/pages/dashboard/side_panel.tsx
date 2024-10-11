import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Mail,
  User,
  Component,
  UsersRound,
  ArrowBigLeft,
  CircleEllipsis,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme_switcher";
import { Tab, useActiveTabStore, useProfilePanelStore } from "./lib/store";

import { UserDMs } from "./side_panel_contents/user_dms";
import { UserRooms } from "./side_panel_contents/user_rooms";
import { UserGroups } from "./side_panel_contents/user_groups";
import { AddFriend } from "./side_panel_contents/add_friend";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export function SidePanel() {
  const { activeTab, setActiveTab } = useActiveTabStore();

  return (
    <>
      {/* SideBar */}
      <aside
        className={cn(
          "z-50 flex flex-col bg-primary px-2 pb-5 md:border-r",
          activeTab ? "border-muted-foreground" : "border-transparent",
        )}
      >
        <div className="mb-4 flex h-16 items-center justify-center text-base font-bold text-secondary">
          <Link
            to="/home"
            className="flex size-full items-center justify-center hover:text-muted/85"
          >
            LinkUp
          </Link>
        </div>
        <Triggers />
      </aside>

      {/* Tabs Container */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as Tab)}
        orientation="vertical"
        className={cn([
          "fixed z-30 h-full overflow-hidden md:relative md:max-w-xs xl:max-w-sm",
          "transition-[width] ease-in-out",
          activeTab ? "w-80 duration-700 md:w-full" : "w-0 duration-300",
        ])}
      >
        {/* Backdrop Overlay */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", duration: 0.35 }}
              onClick={() => setActiveTab("")}
              className="fixed inset-0 z-20 bg-muted-foreground/50 backdrop-blur-sm md:hidden"
            />
          )}
        </AnimatePresence>
        {/* Tabs */}
        <AnimatePresence>
          {activeTab && (
            <motion.section
              exit={{ x: "-100%" }}
              initial={{ x: "-100%" }}
              animate={{ x: window.innerWidth > 768 ? 0 : 70 }}
              transition={{ type: "spring", duration: 1 }}
              className={cn([
                "fixed left-0 z-30 h-full overflow-hidden bg-primary text-secondary md:relative",
                activeTab ? "min-w-80 max-[390px]:min-w-64" : "min-w-0",
              ])}
            >
              <Button
                size="icon"
                onClick={() => setActiveTab("")}
                className="absolute right-3 top-3 p-0 hover:text-muted lg:text-muted-foreground"
              >
                <PanelLeftClose />
              </Button>
              {/* Connect with others */}
              <AddFriend />
              {/* User Direct Messages */}
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
            </motion.section>
          )}
        </AnimatePresence>
      </Tabs>
    </>
  );
}
type Trigger = {
  value: Tab;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
};
const triggers: Trigger[] = [
  { value: "Connect", icon: User, label: "Connect" },
  { value: "Messages", icon: Mail, label: "DMs" },
  { value: "Rooms", icon: Component, label: "Rooms" },
  { value: "Groups", icon: UsersRound, label: "Groups" },
  { value: "More", icon: CircleEllipsis, label: "More" },
];

function Triggers() {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const { setIsOpen } = useProfilePanelStore();

  return (
    <>
      {/* Triggers */}
      <div className="mb-auto space-y-6 pb-8">
        {triggers.map(({ value, icon: Icon, label }) => (
          <div key={value} className="flex flex-col items-center gap-1">
            <Button
              onClick={() => {
                setActiveTab(value === activeTab ? "" : value);
                if (window.innerWidth < 1024) {
                  setIsOpen(false);
                }
              }}
              data-state={activeTab === value ? "active" : "inactive"}
              className="group size-8 bg-primary p-1.5 text-muted-foreground duration-300 ease-in-out hover:text-muted data-[state=active]:bg-indigo-600"
            >
              <Icon className="group-data-[state=active]:text-primary" />
            </Button>
            <small
              className={`text-xs ${activeTab === value ? "font-semibold text-indigo-400" : "text-muted-foreground"}`}
            >
              {label}
            </small>
          </div>
        ))}
      </div>
      {/* Theme Switcher & Logout Button */}
      <div className="flex flex-col items-center gap-8 border-t border-muted-foreground pt-8 text-muted">
        <UserButton />
        <ThemeSwitcher />
        <Button
          asChild
          className="group size-8 border border-muted-foreground bg-primary p-1 text-muted-foreground transition-all duration-300 ease-in-out hover:border-none hover:bg-indigo-500"
        >
          <Link to="/home">
            <ArrowBigLeft className="group-hover:text-primary" />
          </Link>
        </Button>
      </div>
    </>
  );
}
