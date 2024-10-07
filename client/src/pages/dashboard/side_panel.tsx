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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  PanelLeftClose,
  UsersRound,
  CircleEllipsis,
  Component,
  LogOut,
  Sun,
  Search,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SidePanel() {
  const [activeTab, setActiveTab] = useState("");

  return (
    <>
      <Tabs
        orientation="vertical"
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab((prevValue) => (prevValue === value ? "" : value));
        }}
      >
        <TabsList
          className={cn(
            "absolute z-50 h-full flex-col items-center justify-center gap-8 rounded-none bg-primary px-2.5 py-8",
            activeTab && "border-r",
          )}
        >
          <TabsTrigger
            value="Conversations"
            className="group size-8 bg-primary p-1.5 duration-300 ease-in-out hover:bg-indigo-500 data-[state=active]:bg-indigo-600"
          >
            <Component className="group-hover:text-primary" />
          </TabsTrigger>
          <TabsTrigger
            value="DMs"
            className="group size-8 bg-primary p-1.5 duration-300 ease-in-out hover:bg-indigo-500 data-[state=active]:bg-indigo-600"
          >
            <Mail className="group-hover:text-primary" />
          </TabsTrigger>
          <TabsTrigger
            value="Groups"
            className="group size-8 bg-primary p-1.5 duration-300 ease-in-out hover:bg-indigo-500 data-[state=active]:bg-indigo-600"
          >
            <UsersRound className="group-hover:text-primary" />
          </TabsTrigger>
          <TabsTrigger
            value="More"
            className="group size-8 bg-primary p-1.5 duration-300 ease-in-out hover:bg-indigo-500 data-[state=active]:bg-indigo-600"
          >
            <CircleEllipsis className="group-hover:text-primary" />
          </TabsTrigger>

          <div className="mt-auto flex flex-col items-center gap-4 border-t border-muted-foreground pt-8">
            <div>
              <Switch
                className="data-[state=checked]:bg-indigo-400"
                checked={true}
                onCheckedChange={() => {}}
              >
                <Sun className="size-3" />
              </Switch>
            </div>
            <Button className="group size-8 bg-primary p-2 text-muted-foreground transition-all duration-300 ease-in-out hover:bg-indigo-500">
              <LogOut className="group-hover:text-primary" />
            </Button>
          </div>
        </TabsList>

        {/* Backdrop Overlay */}
        <div
          onClick={() => setActiveTab("")}
          className={cn([
            "absolute left-0 top-0 z-30 h-full w-full bg-muted-foreground/50 backdrop-blur-sm transition duration-300",
            activeTab ? "translate-x-0 ease-out" : "-translate-x-full ease-in",
          ])}
        />
        <div
          className={cn([
            "absolute left-0 top-0 z-40 h-full w-[calc(100%-6rem)] min-w-60",
            "bg-primary text-secondary transition duration-500 ease-in-out",
            activeTab ? "translate-x-16" : "-translate-x-full",
          ])}
        >
          {/* Close Panel Button */}
          <Button
            size={"icon"}
            onClick={() => setActiveTab("")}
            className="absolute right-0 top-4 p-0 text-muted-foreground hover:text-muted"
          >
            <PanelLeftClose />
          </Button>
          <TabsContent value="Conversations">
            <div className="flex items-center gap-4 border-b border-muted-foreground">
              <h2 className="p-4 text-base font-semibold text-muted-foreground">
                Active Conversations
              </h2>
              <span className="flex size-5 items-center justify-center rounded border border-muted-foreground p-2 text-xs text-muted">
                1
              </span>
            </div>
            {/* Search Box */}
            <div className="p-4">
              <Label htmlFor="search" className="relative text-xs">
                <Input
                  id="search"
                  type="search"
                  placeholder="Search ..."
                  className="w-full border-none bg-muted/80 text-primary placeholder:text-primary"
                />
                <Search className="absolute right-2 top-2.5 size-5 text-primary" />
              </Label>
            </div>
            {/* Active User List */}
            <div className="mt-2">
              <ul>
                <li>
                  <div className="flex w-full items-center justify-between rounded-none bg-input p-3 text-primary hover:bg-muted/95">
                    <div className="flex items-center gap-4 text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="relative size-10 rounded-full bg-indigo-400 before:absolute before:bottom-0 before:left-0 before:size-3 before:rounded-full before:bg-green-400">
                          AY
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          alignOffset={-12}
                          sideOffset={12}
                          className="rounded-none rounded-br-lg pb-4"
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>
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
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="DMs"></TabsContent>
          <TabsContent value="Groups"></TabsContent>
          <TabsContent value="More"></TabsContent>
        </div>
      </Tabs>
    </>
  );
}
