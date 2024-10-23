import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CheckSquare, Loader, Ellipsis, Search, X } from "lucide-react";

import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useActiveTabStore,
  useFriendRequestStore,
} from "../stores/side-panels";
import { useCurrentChatStore } from "../stores/chat";
import { useProfilePanelStore } from "../stores/side-panels";
import { createUserDM, getAllUsers } from "@/lib/actions";
import { Card } from "@/components/ui/card";
import FadeUp from "@/components/fade_up";
import { cn } from "@/lib/utils";

export function AddFriend() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { friendRequests } = useFriendRequestStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setHasSearched(false);
        if (searchTerm) {
          const users = await getAllUsers(searchTerm.trim());
          setUsers(users);
          setHasSearched(true);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const intialMessage = !searchTerm && !isLoading && !friendRequests.length;
  const isError =
    !isLoading && hasSearched && users.length === 0 && searchTerm.length > 0;

  return (
    <TabsContent value="Connect">
      <header className="flex h-16 items-center justify-between gap-4 border-b px-4 dark:border-muted-foreground">
        <h2 className="font-medium">Connect with members</h2>
      </header>
      {/* Search Box */}
      <div className="relative px-2 py-4">
        <Label htmlFor="search">
          <Input
            id="search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="w-full rounded-none text-primary placeholder:text-xs dark:bg-muted-foreground dark:text-secondary dark:placeholder:text-muted"
          />
          <div className="absolute right-4 top-1/2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center text-clip bg-secondary p-1 text-primary dark:bg-muted-foreground">
            {searchTerm ? <X onClick={() => setSearchTerm("")} /> : <Search />}
          </div>
        </Label>
      </div>

      <SearchResult
        isError={isError}
        isLoading={isLoading}
        intialMessage={intialMessage}
        results={users}
      />
    </TabsContent>
  );
}

function SearchResult({
  isLoading,
  intialMessage,
  isError,
  results,
}: {
  isLoading: boolean;
  intialMessage: boolean;
  isError: boolean;
  results: User[];
}) {
  const setActiveTab = useActiveTabStore.getState().setActiveTab;
  const { setCurrentChat } = useCurrentChatStore();
  const { setUserProfile, setIsOpen } = useProfilePanelStore();
  const { friendRequests, setFriendRequests } = useFriendRequestStore();

  if (intialMessage) {
    return (
      <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
        Start connecting with your friends
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <Loader className="size-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
        No results found
      </p>
    );
  }

  const handleViewProfile = (user: User) => {
    setUserProfile(user);
    setIsOpen(true);
    if (window.innerWidth < 1024) setActiveTab("");
  };

  const handleCreateDM = async (user: User) => {
    try {
      const createdChat = await createUserDM(user.id);
      setCurrentChat(createdChat);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user DM");
    }

    if (window.innerWidth < 1024) setActiveTab("");
    else setActiveTab("Messages");
    toast.success(`You now have a DM with ${user.name}`);
  };

  const handleSendFriendRequest = async (friend: User) => {
    try {
      toast.success(`Friend request sent to ${friend.name}`);
      setFriendRequests(friend);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send friend request");
    }
  };

  const renderRecentConnections = !results.length && !isLoading && !isError;
  let content = renderRecentConnections ? friendRequests : results;

  return (
    <section className="border-t px-1 py-4 dark:border-muted-foreground">
      <p className="text-center text-sm font-medium text-muted-foreground">
        {results.length
          ? "Search results"
          : friendRequests.length
            ? "Recent connections"
            : null}
      </p>
      <ScrollArea
        thumbClassName="bg-indigo-400"
        className="h-[30rem] lg:h-[45rem]"
      >
        <ul className="mt-4 space-y-4">
          {content.map((user) => {
            const friendRequestSent = friendRequests.some(
              (friend) => friend.id === user.id,
            );
            return (
              <FadeUp key={user.id}>
                <Card className="flex items-center justify-between rounded p-2 dark:border dark:border-muted-foreground dark:bg-card/50">
                  <div className="flex items-center gap-2">
                    <div className="size-8 overflow-hidden rounded-full bg-gradient-to-br from-primary via-input to-indigo-500 p-[2px] text-xs">
                      <img
                        src={user.image || "/user.png"}
                        alt={user.name.slice(0, 2)}
                        className="grid size-full place-items-center rounded-full object-cover"
                      />
                    </div>
                    <div className="text-xs font-medium">
                      <p>{user.name}</p>
                      <p className="line-clamp-1 max-w-36 overflow-hidden text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        asChild
                        size="icon"
                        variant="outline"
                        className="size-6 p-1 hover:bg-muted"
                      >
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      alignOffset={10}
                      sideOffset={-9}
                      className={cn(
                        "z-[150] space-y-2 rounded-lg pb-4",
                        "data-[side=bottom]:rounded-tr-none data-[side=top]:rounded-br-none",
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={friendRequestSent}
                        onClick={() => handleSendFriendRequest(user)}
                        className="text-xs font-medium"
                      >
                        {friendRequestSent ? (
                          <span className="flex items-center gap-2">
                            Request sent{" "}
                            <CheckSquare className="size-5 text-green-500 dark:text-green-300" />
                          </span>
                        ) : (
                          "Send friend request"
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleViewProfile(user)}
                        className="text-xs font-medium"
                      >
                        View profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCreateDM(user)}
                        className="text-xs font-medium"
                      >
                        Create DM
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>
              </FadeUp>
            );
          })}
        </ul>
      </ScrollArea>
    </section>
  );
}
