import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import {
  CircleEllipsis,
  Component,
  LogOut,
  Mail,
  User,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme_switcher";
import { Tab, useActiveTabStore } from "../lib/store";

const triggers = [
  { value: "AddFriend", icon: User, label: "Connect" },
  { value: "Messages", icon: Mail, label: "DMs" },
  { value: "Rooms", icon: Component, label: "Rooms" },
  { value: "Groups", icon: UsersRound, label: "Groups" },
  { value: "More", icon: CircleEllipsis, label: "More" },
];

export function SideBar() {
  const { activeTab, setActiveTab } = useActiveTabStore();

  return (
    <div
      className={cn(
        "sticky top-0 z-[100] flex h-screen flex-col bg-primary px-2 pb-5",
        activeTab && "border-r border-muted-foreground",
      )}
    >
      {/* Home Logo */}
      <div className="mb-4 flex h-16 items-center justify-center text-base font-bold text-secondary">
        <Link
          to="/home"
          className="flex size-full items-center justify-center hover:text-muted/85"
        >
          LinkUp
        </Link>
      </div>

      {/* Triggers */}
      <div className="mb-auto space-y-6 pb-8">
        {triggers.map(({ value, icon: Icon, label }) => (
          <div key={value} className="flex flex-col items-center gap-1">
            <Button
              onClick={() =>
                setActiveTab(value === activeTab ? "" : (value as Tab))
              }
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
        <Button className="group size-8 bg-primary p-2 text-muted-foreground transition-all duration-300 ease-in-out hover:bg-indigo-500">
          <LogOut className="group-hover:text-primary" />
        </Button>
      </div>
    </div>
  );
}
