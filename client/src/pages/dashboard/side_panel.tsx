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
import {
  Tab,
  useActiveTabStore,
  useProfilePanelStore,
} from "./stores/side-panels";
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
          "relative z-[100] flex min-w-16 flex-col border-r bg-secondary pb-5",
          "dark:border-muted-foreground",
        )}
      >
        <SocketConnectionState />

        <div className="mb-4 flex h-16 items-center justify-center text-base font-bold text-primary">
          <Link
            to="/home"
            className="flex size-full items-center justify-center"
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
          "transition-[width] ease-in-out",
          activeTab
            ? "w-80 duration-1000 md:w-full"
            : "w-0 [transition-duration:350ms]",
        ])}
      >
        {/* Backdrop Overlay */}
        <AnimatePresence>
          {activeTab && (
            <motion.div
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              initial={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
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
              animate={{ x: window.innerWidth < 768 ? 64 : 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35 }}
              className={cn([
                "fixed left-0 z-30 h-full overflow-hidden border-r bg-muted text-primary md:relative",
                "min-w-[75vw] dark:border-muted-foreground md:min-w-80",
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
                <header className="flex h-16 items-center gap-4 border-b">
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
  { value: "Groups", icon: Component, label: "Groups" },
  { value: "More", icon: CircleEllipsis, label: "More" },
];

function Triggers() {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const { setIsOpen } = useProfilePanelStore();

  const handleTrigger = (value: Tab) => {
    setActiveTab(value === activeTab ? "" : value);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      <div className="mb-auto flex flex-col items-center space-y-4 pb-8">
        {triggers.map(({ value, icon: Icon, label }) => (
          <Button
            key={value}
            variant="ghost"
            onClick={() => handleTrigger(value)}
            data-state={activeTab === value ? "active" : "inactive"}
            className="group relative grid h-full place-items-center gap-2 p-0 text-muted-foreground duration-300 ease-in-out"
          >
            {/* {label === "Requests" && (
                <span className="absolute right-0 top-0 -mr-1 -mt-1 size-3 rounded-full bg-green-300 before:absolute before:inset-0 before:size-3 before:animate-ping before:rounded-full before:bg-green-100" />
              )} */}
            <Icon
              className={cn(
                "size-8 rounded-md p-1.5 group-hover:bg-input",
                "group-data-[state=active]:bg-indigo-500 group-data-[state=active]:text-secondary",
                "dark:group-data-[state=active]:text-primary",
              )}
            />
            <small
              className={`text-xs font-medium ${activeTab === value ? "text-indigo-500 dark:text-indigo-300" : ""}`}
            >
              {label}
            </small>
          </Button>
        ))}
      </div>
      {/* Theme Switcher & Logout Button */}
      <div className="flex flex-col items-center gap-8 border-t pt-8 text-muted dark:border-muted-foreground">
        <UserButton />
        <ThemeSwitcher />
        <Button
          asChild
          variant="ghost"
          className={cn(
            "group size-8 border p-1 text-muted-foreground transition-colors duration-300 ease-in-out",
            "hover:border-none hover:bg-indigo-500 hover:text-secondary",
            "dark:border-muted-foreground dark:hover:text-primary",
          )}
        >
          <Link to="/home">
            <ArrowBigLeft />
          </Link>
        </Button>
      </div>
    </>
  );
}
