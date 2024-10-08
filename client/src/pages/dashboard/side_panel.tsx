import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Mail,
  PanelLeftClose,
  UsersRound,
  CircleEllipsis,
  Component,
  LogOut,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeSwitcher } from "./theme_switcher";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use_media_query";

const triggers = [
  { value: "Messages", icon: Mail, label: "DMs" },
  { value: "Rooms", icon: Component, label: "Rooms" },
  { value: "Groups", icon: UsersRound, label: "Groups" },
  { value: "More", icon: CircleEllipsis, label: "More" },
];

export function SidePanel() {
  const isMobile = useMediaQuery("(min-width: 768px)");
  const [activeTab, setActiveTab] = useState(isMobile ? "Messages" : "");

  return (
    <>
      <div
        className={cn(
          "relative z-50 flex h-full flex-col items-center justify-between gap-8 rounded-none bg-primary px-2.5 py-8",
          activeTab && "border-r border-muted-foreground",
        )}
      >
        {triggers.map(({ value, icon: Icon, label }) => (
          <div key={value} className="flex flex-col items-center gap-1">
            <Button
              onClick={() =>
                setActiveTab((prevValue) => (prevValue === value ? "" : value))
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
        <div className="mt-auto flex flex-col items-center gap-4 border-t border-muted-foreground pt-8 text-muted">
          <ThemeSwitcher />
          <Button className="group size-8 bg-primary p-2 text-muted-foreground transition-all duration-300 ease-in-out hover:bg-indigo-500">
            <LogOut className="group-hover:text-primary" />
          </Button>
        </div>
      </div>
      {/* Backdrop Overlay */}
      <div
        onClick={() => setActiveTab("")}
        className={cn([
          "fixed left-0 z-30 size-full bg-muted-foreground/50 backdrop-blur-sm transition duration-300",
          activeTab ? "translate-x-0 ease-out" : "-translate-x-full ease-in",
          "md:hidden",
        ])}
      />

      <Tabs
        orientation="vertical"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab((prevValue) => (prevValue === value ? "" : value));
        }}
      >
        {/* Tabs Container */}
        <div
          className={cn([
            "fixed z-40 h-full min-w-72 bg-primary text-secondary transition-all duration-500 ease-in-out md:relative lg:min-w-80",
            activeTab ? "ml-0" : "-ml-72 lg:-ml-80",
          ])}
        >
          {/* Close Panel Button */}
          <Button
            size={"icon"}
            onClick={() => setActiveTab("")}
            className="absolute right-0 top-3 p-0 text-muted-foreground hover:text-muted"
          >
            <PanelLeftClose />
          </Button>

          {/* Messages */}
          <TabsContent value="Messages">
            <header className="flex h-16 items-center gap-4 border-b border-muted-foreground">
              <h2 className="px-4 text-base font-semibold text-muted-foreground">
                Active Messages
              </h2>
              <span className="flex size-5 items-center justify-center rounded border border-muted-foreground p-2 text-xs text-muted">
                1
              </span>
            </header>
            {/* Search Box */}
            <div className="relative px-1 py-4">
              <Label htmlFor="search">
                <Input
                  id="search"
                  type="search"
                  placeholder="Search ..."
                  className="w-full rounded-none border-none bg-muted/80 text-primary placeholder:text-xs placeholder:text-primary"
                />
                <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
              </Label>
            </div>
            {/* Active User List */}
            <ScrollArea
              thumbClassName="bg-muted-foreground"
              className="h-[25rem] lg:h-[40rem]"
            >
              <div className="px-1">
                <ul className="space-y-4 border-t border-muted-foreground py-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i}>
                      <div
                        onClick={() => setActiveTab("")}
                        className="flex w-full cursor-pointer items-center justify-between rounded-none bg-muted p-3 text-primary hover:bg-muted/95"
                      >
                        <div className="flex items-center gap-4 text-left">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="relative size-10 rounded-full bg-indigo-400 before:absolute before:bottom-0 before:right-0 before:size-3 before:rounded-full before:bg-green-400 before:ring before:ring-muted">
                              AY
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              alignOffset={-12}
                              sideOffset={12}
                              className="rounded-none rounded-br-lg pb-4"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="focus:bg-muted-foreground/50">
                                View profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-muted-foreground/50">
                                Send friend request
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div>
                            <p className="text-sm font-medium">John Doe</p>
                            <p className="text-xs text-muted-foreground">
                              Hey, how are you?
                            </p>
                          </div>
                        </div>
                        <div className="text-xs">12:00 PM</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Rooms */}
          <TabsContent value="Rooms">
            <div className="flex items-center gap-4 border-b border-muted-foreground">
              <h2 className="p-4 text-base font-semibold text-muted-foreground">
                My Rooms
              </h2>
              <span className="flex size-5 items-center justify-center rounded border border-muted-foreground p-2 text-xs text-muted">
                0
              </span>
            </div>
          </TabsContent>

          {/* Groups */}
          <TabsContent value="Groups">
            <div className="flex items-center gap-4 border-b border-muted-foreground">
              <h2 className="p-4 text-base font-semibold text-muted-foreground">
                My Groups
              </h2>
              <span className="flex size-5 items-center justify-center rounded border border-muted-foreground p-2 text-xs text-muted">
                0
              </span>
            </div>
          </TabsContent>

          {/* More */}
          <TabsContent value="More">
            <div className="flex items-center gap-4 border-b border-muted-foreground">
              <h2 className="p-4 text-base font-semibold text-muted-foreground">
                Settings
              </h2>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
