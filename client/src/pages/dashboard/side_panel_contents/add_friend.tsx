import { toast } from "sonner";
import { useEffect, useState } from "react";
import { CheckSquare, Loader, PlusSquare, Search, X } from "lucide-react";

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
import FadeUp from "@/components/fade_up";
import {
  Friend,
  useActiveTabStore,
  useFriendRequestStore,
} from "../stores/side-panels";
import { useCurrentChatStore } from "../stores/chat";
import { useProfilePanelStore } from "../stores/side-panels";
import { createUserDM, getAllUsers } from "@/lib/actions";

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
          console.log("users", users[2].clerkId);
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

    const debounce = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const intialMessage = !searchTerm && !isLoading && !friendRequests.length;
  const errorMessage =
    !isLoading && hasSearched && users.length === 0 && searchTerm.length > 0;

  return (
    <TabsContent value="Connect">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-muted-foreground px-4">
        <h2 className="font-medium text-muted">Connect with members</h2>
      </header>
      {/* Search Box */}
      <div className="relative px-1 py-4">
        <Label htmlFor="search">
          <Input
            id="search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members..."
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

      <SearchResult
        errorMessage={errorMessage}
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
  errorMessage,
  results,
}: {
  isLoading: boolean;
  intialMessage: boolean;
  errorMessage: boolean;
  results: User[];
}) {
  const { setActiveTab } = useActiveTabStore();
  const { setCurrentChat } = useCurrentChatStore();
  const { setUserProfile, setIsOpen } = useProfilePanelStore();
  const { friendRequests, setFriendRequests } = useFriendRequestStore();

  if (intialMessage) {
    return (
      <p className="mt-8 text-center text-sm font-bold text-muted-foreground">
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

  if (errorMessage) {
    return (
      <p className="mt-8 text-center font-bold text-muted-foreground">
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

  const handleSendFriendRequest = async (friend: Friend) => {
    try {
      toast.success(`Friend request sent to ${friend.name}`);
      setFriendRequests(friend);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send friend request");
    }
  };

  const renderRecentConnections =
    !results.length && !isLoading && !errorMessage;
  let content = renderRecentConnections ? friendRequests : results;

  return (
    <section className="border-t border-muted-foreground px-1 py-4">
      <p className="text-center text-sm font-medium text-muted-foreground">
        {results.length
          ? "Search results"
          : friendRequests.length
            ? "Recent connections"
            : null}
      </p>
      <ScrollArea
        thumbClassName="bg-muted-foreground"
        className="h-[30rem] lg:h-[45rem]"
      >
        <ul className="mt-4 space-y-4">
          {content.map((user) => {
            const friendRequestSent = friendRequests.some(
              (friend) => friend.id === user.id,
            );
            return (
              <FadeUp
                key={user.id}
                className="flex items-center justify-between rounded bg-muted-foreground/50 p-3"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 overflow-hidden rounded-full bg-secondary/50 p-[2px] text-xs">
                    <img
                      src={user.image || "/user.png"}
                      alt={user.name.slice(0, 2)}
                      className="flex size-full items-center justify-center rounded-full object-cover text-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-secondary">
                      {user.name}
                    </p>
                    <p className="line-clamp-1 max-w-36 overflow-hidden text-xs text-muted">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      asChild
                      className="size-8 p-1 text-xs hover:bg-muted-foreground hover:text-secondary"
                      variant={"ghost"}
                      size={"sm"}
                    >
                      <PlusSquare />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    alignOffset={6}
                    sideOffset={-4}
                    className="z-[150] space-y-2 rounded-lg rounded-tr-none pb-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      disabled={friendRequestSent}
                      onClick={() => handleSendFriendRequest(user as Friend)}
                      className="focus:bg-muted-foreground/50"
                    >
                      {friendRequestSent ? (
                        <span className="flex items-center gap-2">
                          Request sent{" "}
                          <CheckSquare className="size-5 text-green-300" />
                        </span>
                      ) : (
                        "Send friend request"
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleViewProfile(user)}
                      className="focus:bg-muted-foreground/50"
                    >
                      View profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCreateDM(user)}
                      className="focus:bg-muted-foreground/50"
                    >
                      Create DM
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </FadeUp>
            );
          })}
        </ul>
      </ScrollArea>
    </section>
  );
}
