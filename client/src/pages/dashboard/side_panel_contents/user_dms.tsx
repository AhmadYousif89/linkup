import { useEffect, useState } from "react";
import { Loader, Search, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FadeUp from "@/components/fade_up";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

import { User } from "@/lib/types";
import { cn, formatApiData, formatDate } from "@/lib/utils";
import { useCurrentChatStore, useUserDMsStore } from "../stores/chat";
import { useActiveTabStore, useProfilePanelStore } from "../stores/side-panels";
import { createUserDM } from "@/lib/actions";
import { useSocketStore } from "@/lib/store";

const getUserDMs = async () => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
  const res = await fetch(`${VITE_SERVER_API}/chat`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  const chats = formatApiData(data, "CHAT", "Array");
  return chats;
};

export function UserDMs() {
  const { userDMs, setUserDMs } = useUserDMsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const chats = await getUserDMs();
        const actualUsers = chats.map((chat) => chat.users).flat();
        setUserDMs(actualUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounce);
  }, []);

  const renderUserDMs = searchTerm
    ? userDMs.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : userDMs;

  return (
    <TabsContent value="Messages">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-muted-foreground px-4">
        <h2 className="font-medium text-muted">Direct Messages</h2>
        <span className="flex size-5 items-center justify-center rounded border border-muted-foreground p-2 text-xs text-muted">
          {renderUserDMs.length}
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
            placeholder="Filter activity..."
            className="w-full rounded-none border-none bg-muted/80 text-primary placeholder:text-xs placeholder:text-primary"
          />
          {searchTerm ? (
            <X
              className="absolute right-3 top-1/2 size-4 -translate-y-1/2 cursor-pointer text-primary"
              onClick={() => setSearchTerm("")}
            />
          ) : (
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
          )}
        </Label>
      </div>
      {/* Active User List */}
      <ScrollArea
        thumbClassName="bg-muted-foreground"
        className="h-[30rem] lg:h-[45rem]"
      >
        {isLoading ? (
          <div className="mt-8 flex justify-center">
            <Loader className="size-8 animate-spin" />
          </div>
        ) : (
          <RenderDMsResult userDMs={renderUserDMs} searchTerm={searchTerm} />
        )}
      </ScrollArea>
    </TabsContent>
  );
}

type RenderDMsResultProps = {
  userDMs: User[];
  searchTerm: string;
};

function RenderDMsResult({ userDMs, searchTerm }: RenderDMsResultProps) {
  const { setActiveTab } = useActiveTabStore();
  const { setUserProfile, setIsOpen } = useProfilePanelStore();
  const { currentChat, setCurrentChat, currentChatUser } =
    useCurrentChatStore();
  const { userStatus, emitLeaveChat } = useSocketStore();

  const errorMessage =
    searchTerm && userDMs.length === 0 ? "No results found" : "";
  const renderMessage =
    !searchTerm && userDMs.length > 0
      ? "Recent activity"
      : !errorMessage && searchTerm
        ? "Search results"
        : "";

  const handleStartChat = async (user: User) => {
    if (currentChat && user.id === currentChatUser?.id) return;
    if (currentChat && user.id !== currentChatUser?.id) {
      emitLeaveChat(currentChat?.id);
      setCurrentChat(null);
    }
    try {
      const userFetchedChat = await createUserDM(user.id);
      setCurrentChat(userFetchedChat);
    } catch (error) {
      console.error(error);
    }
    if (window.innerWidth < 1024) setActiveTab("");
  };

  const handleCloseDM = () => {
    if (!currentChat) return;
    emitLeaveChat(currentChat.id);
    setCurrentChat(null);
  };

  const handleViewProfile = (user: User) => {
    setUserProfile(user);
    setIsOpen(true);
    if (window.innerWidth < 1024) setActiveTab("");
  };

  return (
    <div className="border-t border-muted-foreground px-1 py-4">
      {errorMessage && (
        <div className="flex flex-col items-center justify-center text-center text-sm font-semibold text-muted-foreground">
          {errorMessage}
        </div>
      )}

      {renderMessage && (
        <div className="flex flex-col items-center justify-center text-center text-sm font-semibold text-muted-foreground">
          {renderMessage}
        </div>
      )}

      {userDMs.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {userDMs.map((user) => {
            return (
              <FadeUp.li
                key={user.id}
                className="cursor-pointer bg-muted-foreground/50 hover:bg-muted-foreground/60"
              >
                <div
                  onClick={() => handleStartChat(user)}
                  className="flex items-center justify-between rounded p-3 text-primary"
                >
                  <div className="relative flex items-center gap-4 text-left">
                    {/* Status Indecator */}
                    <span
                      className={cn(
                        "absolute bottom-0 left-1 size-2 rounded-full ring-2 ring-primary",
                        userStatus[user.id] === "online"
                          ? "bg-green-500"
                          : "bg-red-500",
                      )}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="size-10 overflow-hidden rounded-full bg-secondary/50 p-[2px] text-xs">
                        <img
                          src={user.image || "/user.png"}
                          alt={user.name}
                          className="aspect-square size-full rounded-full object-cover"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        alignOffset={6}
                        className="z-[150] space-y-2 rounded-lg rounded-tl-none pb-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewProfile(user)}
                          className="focus:bg-muted-foreground/50"
                        >
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleCloseDM}
                          className="focus:bg-muted-foreground/50"
                        >
                          Close DM
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-secondary">
                        {user.name}
                      </p>
                      <p className="line-clamp-1 max-w-36 overflow-hidden text-xs text-muted">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-muted/70">
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
              </FadeUp.li>
            );
          })}
        </ul>
      ) : (
        !errorMessage && (
          <div className="mt-8 flex flex-col items-center justify-center text-balance text-center font-bold text-muted-foreground">
            No recent activity found
          </div>
        )
      )}
    </div>
  );
}
