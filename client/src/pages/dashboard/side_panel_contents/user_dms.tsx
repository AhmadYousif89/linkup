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
import { cn, formatDate } from "@/lib/utils";
import { useCurrentChatStore } from "../stores/chat";
import { useActiveTabStore, useProfilePanelStore } from "../stores/side-panels";
import { closeChat, createUserDM, getUserDMs } from "@/lib/actions";
import { useSocketStore } from "@/lib/store";
import { Card } from "@/components/ui/card";

export function UserDMs() {
  const [userDMs, setUserDMs] = useState<{ chatId: string; user: User }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { activeTab } = useActiveTabStore();

  useEffect(() => {
    if (activeTab !== "Messages") return;
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const chats = await getUserDMs();
        const newUserDMs = chats.flatMap((chat) => {
          const users = chat.users.filter((user) => user.id !== chat.id);
          return users.map((user) => ({ chatId: chat.id, user }));
        });
        setUserDMs(newUserDMs);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [activeTab]);

  const renderUserDMs = searchTerm
    ? userDMs.filter((data) =>
        data.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : userDMs;

  return (
    <TabsContent value="Messages">
      <header className="flex h-16 items-center justify-between gap-4 border-b px-4 dark:border-muted-foreground">
        <h2 className="font-medium">Direct Messages</h2>
        <span className="flex size-5 items-center justify-center rounded border p-2 text-xs dark:border-muted-foreground">
          {renderUserDMs.length}
        </span>
      </header>
      {/* Search Box */}
      <div className="relative px-2 py-4">
        <Label htmlFor="search">
          <Input
            id="search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter messages..."
            className="w-full rounded-none text-primary placeholder:text-xs dark:bg-muted-foreground dark:text-secondary dark:placeholder:text-muted"
          />
          <div className="absolute right-4 top-1/2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center text-clip bg-secondary p-1 text-primary dark:bg-muted-foreground">
            {searchTerm ? <X onClick={() => setSearchTerm("")} /> : <Search />}
          </div>
        </Label>
      </div>

      {/* Active User List */}
      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <Loader className="size-8 animate-spin" />
        </div>
      ) : (
        <RenderDMsResult userDMs={renderUserDMs} searchTerm={searchTerm} />
      )}
    </TabsContent>
  );
}

type RenderDMsResultProps = {
  userDMs: {
    chatId: string;
    user: User;
  }[];
  searchTerm: string;
};

function RenderDMsResult({ userDMs, searchTerm }: RenderDMsResultProps) {
  const setActiveTab = useActiveTabStore.getState().setActiveTab;
  const { userStatus, emitLeaveChat } = useSocketStore();
  const { setUserProfile, setIsOpen } = useProfilePanelStore();
  const { currentChat, setCurrentChat, currentChatUser } =
    useCurrentChatStore();

  const isError = searchTerm && userDMs.length === 0 ? "No results found" : "";
  const renderMessage =
    !searchTerm && userDMs.length > 0
      ? "Recent messages"
      : !isError && searchTerm
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

  const handleCloseDM = async (chatId: string) => {
    try {
      setCurrentChat(null);
      emitLeaveChat(chatId);
      await closeChat(chatId);
      if (window.innerWidth < 1024) setActiveTab("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewProfile = (user: User) => {
    setUserProfile(user);
    setIsOpen(true);
    if (window.innerWidth < 1024) setActiveTab("");
  };

  return (
    <div className="border-t px-1 py-4 dark:border-muted-foreground">
      {isError && (
        <div className="flex flex-col items-center justify-center text-center text-sm font-medium text-muted-foreground">
          {isError}
        </div>
      )}

      {renderMessage && (
        <div className="mb-4 flex flex-col items-center justify-center text-center text-sm font-medium text-muted-foreground">
          {renderMessage}
        </div>
      )}

      <ScrollArea
        thumbClassName="bg-indigo-400"
        className="h-[30rem] md:h-[36rem] xl:h-[40rem]"
      >
        {userDMs.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {userDMs.map(({ user, chatId }) => {
              return (
                <FadeUp key={user.id}>
                  <Card
                    onClick={() => handleStartChat(user)}
                    className="flex cursor-pointer items-center justify-between rounded p-2 text-primary hover:bg-muted dark:border dark:border-muted-foreground dark:bg-card/50 dark:hover:bg-card/80"
                  >
                    <div className="relative flex items-center gap-4 text-left">
                      <span
                        className={cn(
                          "absolute bottom-0 left-0 size-2.5 rounded-full border",
                          userStatus[user.id] === "online"
                            ? "bg-green-500"
                            : userStatus[user.id] === "offline"
                              ? "bg-destructive"
                              : "bg-muted-foreground",
                        )}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger className="size-8 overflow-hidden rounded-full bg-primary/50 p-[2px] text-xs">
                          <img
                            src={user.image || "/user.png"}
                            alt={user.name}
                            className="aspect-square size-full rounded-full object-cover"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          alignOffset={10}
                          sideOffset={-9}
                          className={cn(
                            "z-[150] space-y-2 rounded-lg pb-4",
                            "data-[side=bottom]:rounded-tl-none data-[side=top]:rounded-bl-none",
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(user)}
                            className="text-xs font-medium"
                          >
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCloseDM(chatId)}
                            className="text-xs font-medium"
                          >
                            Close DM
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div className="text-xs font-medium">
                        <p>{user.name}</p>
                        <p className="line-clamp-1 max-w-36 overflow-hidden text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(user.updatedAt)}
                    </p>
                  </Card>
                </FadeUp>
              );
            })}
          </ul>
        ) : (
          !isError && (
            <div className="mt-8 flex flex-col items-center justify-center text-balance text-center font-bold text-muted-foreground">
              No recent activity found
            </div>
          )
        )}
      </ScrollArea>
    </div>
  );
}
