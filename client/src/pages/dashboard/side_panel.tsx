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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme_switcher";

import { UserDMs } from "./side_panel_contents/user_dms";
import { UserRooms } from "./side_panel_contents/user_rooms";
import { UserRequests } from "./side_panel_contents/user_requests";
import { AddFriend } from "./side_panel_contents/add_friend";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Tab, useActiveTabStore } from "./stores/side-panel";
import { useProfilePanelStore } from "./stores/profile-panel";
import { useSocketStore } from "@/lib/store";

function SocketConnectionState() {
  const { isConnected } = useSocketStore();

  return (
    <div
      className={cn(
        "absolute left-1/2 top-[62px] z-[500] h-[2px] w-14 -translate-x-1/2 rounded-full",
        isConnected ? "bg-green-500" : "bg-red-600",
      )}
    />
  );
}

export function SidePanel() {
  const { activeTab, setActiveTab } = useActiveTabStore();

  return (
    <>
      {/* SideBar */}
      <aside
        className={cn(
          "relative z-50 flex min-w-20 flex-col bg-primary pb-5 md:border-r",
          activeTab ? "border-muted-foreground" : "border-transparent",
        )}
      >
        <SocketConnectionState />

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
          "fixed z-30 h-full overflow-hidden md:relative md:left-0 md:max-w-xs xl:max-w-sm",
          "transition-[width] duration-500 ease-in-out",
          activeTab ? "w-80 md:w-full" : "w-0",
        ])}
      >
        {/* Backdrop Overlay */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              initial={{ x: "-100%" }}
              transition={{ duration: 0.2 }}
              onClick={() => setActiveTab("")}
              className="fixed inset-0 z-20 overflow-hidden bg-muted-foreground/50 backdrop-blur-sm md:hidden"
            />
          )}
        </AnimatePresence>
        {/* Tabs */}
        <AnimatePresence>
          {activeTab && (
            <motion.section
              initial={{ x: "-100%" }}
              animate={{ x: window.innerWidth < 768 ? 81 : 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4 }}
              className={cn([
                "fixed left-0 z-30 h-full overflow-hidden bg-primary text-secondary md:relative",
                "min-w-[75vw] ease-in-out md:min-w-80",
              ])}
            >
              {/* Connect with others */}
              <AddFriend />
              {/* User Direct Messages */}
              <UserDMs />
              {/* Friend Requests */}
              <UserRequests />
              {/* Rooms */}
              <UserRooms />
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
  { value: "Requests", icon: UsersRound, label: "Requests" },
  { value: "Messages", icon: Mail, label: "DMs" },
  { value: "Rooms", icon: Component, label: "Rooms" },
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
              className="group relative size-8 bg-primary p-1.5 text-muted-foreground duration-300 ease-in-out hover:text-muted data-[state=active]:bg-indigo-600"
            >
              {/* {label === "Requests" && (
                <span className="absolute right-0 top-0 -mr-1 -mt-1 size-3 rounded-full bg-green-300 before:absolute before:inset-0 before:size-3 before:animate-ping before:rounded-full before:bg-green-100" />
              )} */}
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
