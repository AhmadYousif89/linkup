import { CheckSquare, Loader, PlusSquare, Search, X } from "lucide-react";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
  Friend,
  useActiveTabStore,
  useFriendRequestStore,
  useProfilePanelStore,
  useUserDMsStore,
} from "../lib/store";
import { motion, useInView } from "framer-motion";

const getAllUsers = async (searchTerm: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
  const res = await fetch(`${VITE_SERVER_API}/user?search=${searchTerm}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await res.json();
  return users;
};

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
  const { setUserProfile, setIsOpen } = useProfilePanelStore();
  const { friendRequests, setFriendRequests } = useFriendRequestStore();
  const { setUserDMs } = useUserDMsStore();

  if (intialMessage) {
    return (
      <p className="mt-8 text-center font-bold text-muted-foreground">
        Start adding some friends
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

  const handleCreateDM = (user: User) => {
    setUserDMs(user);
    setActiveTab("Messages");
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
              <FriendRequest
                key={user.id}
                className="flex items-center justify-between rounded bg-muted-foreground/50 p-3"
              >
                <div className="flex items-center gap-4">
                  <div className="size-10 overflow-hidden rounded-full bg-secondary/50 p-1 text-xs">
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
              </FriendRequest>
            );
          })}
        </ul>
      </ScrollArea>
    </section>
  );
}

type FriendRequestProps = PropsWithChildren & { className?: string };
function FriendRequest({ children, className }: FriendRequestProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
    }
  }, [isInView, isVisible]);

  return (
    <motion.li
      ref={ref}
      initial={false}
      variants={{
        hidden: { opacity: 0, translateY: "25px" },
        visible: { opacity: 1, translateY: "0px" },
      }}
      animate={isVisible ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={className}
    >
      {children}
    </motion.li>
  );
}