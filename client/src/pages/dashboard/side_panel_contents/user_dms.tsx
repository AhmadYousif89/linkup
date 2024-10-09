import { useState } from "react";
import { Search } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const DUMMY_USERS_DMs = [
  {
    id: 1,
    name: "John Doe",
    message: "Hey, how are you?",
    time: "12:00 PM",
  },
  {
    id: 2,
    name: "Jane Smith",
    message: "Did you finish the project?",
    time: "1:30 PM",
  },
  {
    id: 3,
    name: "Mike Johnson",
    message: "Let's meet for lunch",
    time: "11:45 AM",
  },
  {
    id: 4,
    name: "Emily Brown",
    message: "Can you help me with this task?",
    time: "3:15 PM",
  },
  {
    id: 5,
    name: "David Wilson",
    message: "Don't forget about the meeting tomorrow",
    time: "5:00 PM",
  },
  {
    id: 6,
    name: "Sarah Davis",
    message: "Thanks for your help earlier",
    time: "7:20 PM",
  },
  {
    id: 7,
    name: "Alex Turner",
    message: "Did you see the latest project update?",
    time: "9:10 AM",
  },
  {
    id: 8,
    name: "Olivia Parker",
    message: "Can we reschedule our call?",
    time: "2:45 PM",
  },
  {
    id: 9,
    name: "Chris Evans",
    message: "I've sent you the files you requested",
    time: "4:30 PM",
  },
  {
    id: 10,
    name: "Sophie Lee",
    message: "Great job on the presentation!",
    time: "6:55 PM",
  },
  {
    id: 11,
    name: "Ryan Garcia",
    message: "Are we still on for the team dinner?",
    time: "8:15 PM",
  },
];

type UserDMsProps = {
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

export function UserDMs({ setActiveTab }: UserDMsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const renderUserDMs = searchTerm
    ? DUMMY_USERS_DMs.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : DUMMY_USERS_DMs;

  return (
    <TabsContent value="Messages">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-muted-foreground px-4">
        <h2 className="font-medium text-muted">Active Messages</h2>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ..."
            className="w-full rounded-none border-none bg-muted/80 text-primary placeholder:text-xs placeholder:text-primary"
          />
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
        </Label>
      </div>
      {/* Active User List */}
      <ScrollArea
        thumbClassName="bg-muted-foreground"
        className="h-[33rem] lg:h-[45rem]"
      >
        <div className="px-1">
          <ul className="space-y-4 border-t border-muted-foreground py-4">
            {renderUserDMs.map((user) => (
              <li key={user.id}>
                <div
                  onClick={() => setActiveTab("")}
                  className="flex w-full cursor-pointer items-center justify-between rounded-none bg-muted-foreground/50 p-3 text-primary transition-colors duration-300 ease-in-out hover:bg-muted-foreground/90"
                >
                  <div className="flex items-center gap-4 text-left">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="relative size-10 rounded-full bg-indigo-400 text-xs before:absolute before:bottom-0 before:right-1 before:size-2 before:rounded-full before:bg-green-400 before:ring-2 before:ring-muted">
                        {user.name.slice(0, 2)}
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
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-secondary">
                        {user.name}
                      </p>
                      <p className="line-clamp-1 max-w-36 overflow-clip text-xs text-muted">
                        {user.message}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-secondary">{user.time}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </TabsContent>
  );
}
