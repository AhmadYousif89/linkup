import { Loader, Plus, PlusSquare, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { User } from "@/lib/types";
import { createGroupChat, fetchGroupChats, getAllUsers } from "@/lib/actions";

import FadeUp from "@/components/fade_up";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGroupChatStore } from "../stores/chat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserRooms() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { groupChats, setGroupChats } = useGroupChatStore();

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

  const errorMessage =
    !isLoading && hasSearched && users.length === 0 && searchTerm.length > 0;

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupName) {
      toast.error("Group name is required");
      return;
    }

    if (!selectedUsers.length || selectedUsers.length < 2) {
      toast.error("Add at least 2 users to the group");
      return;
    }

    // Create group chat
    const group = {
      name: groupName,
      users: selectedUsers,
    };

    try {
      const data = await createGroupChat(group);
      if (data) toast.success(`Group ${group.name} created successfully`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chats = await fetchGroupChats();
        setGroupChats(chats);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [groupChats.length]);

  let content;
  if (!groupChats) {
    content = (
      <p className="text-center text-sm font-medium text-muted-foreground">
        You have no groups yet
      </p>
    );
  } else
    content = (
      <ul>
        {groupChats.map((chat) => {
          return (
            <FadeUp
              key={chat.id}
              className="flex items-center justify-between rounded bg-muted-foreground/50 p-2"
            >
              <div className="flex items-center gap-4">
                <div className="size-8 overflow-hidden rounded-full bg-secondary/50 p-[2px] text-xs">
                  <img
                    src={chat.groupAdmin?.image || "/user.png"}
                    alt={chat.chatName.slice(0, 2)}
                    className="flex size-full items-center justify-center rounded-full object-cover text-primary"
                  />
                </div>
                <p className="font-semibold text-secondary/80">
                  {chat.chatName}
                </p>
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
                  <DropdownMenuItem className="focus:bg-muted-foreground/50">
                    View group
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-muted-foreground/50">
                    Add more users
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-muted-foreground/50">
                    Delete group
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </FadeUp>
          );
        })}
      </ul>
    );

  return (
    <TabsContent value="Rooms">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-muted-foreground px-4">
        <h2 className="font-medium text-muted">My Rooms</h2>
        <span className="flex size-5 items-center justify-center rounded border border-muted-foreground p-2 text-xs text-muted">
          {groupChats?.length}
        </span>
      </header>

      <section className="px-4">
        <Dialog>
          <DialogTrigger className="w-full border-b border-muted-foreground pb-4">
            <Button
              asChild
              variant="ghost"
              className="mx-auto max-w-52 gap-2 hover:border-primary hover:bg-secondary hover:text-primary"
            >
              <div className="mt-4 border border-muted-foreground shadow">
                <span>Create Group</span>
                <Plus className="size-5" />
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="flex h-[calc(100%-4rem)] flex-col bg-primary text-secondary">
            <DialogHeader>
              <DialogTitle className="border-b border-muted-foreground pb-4">
                Creat Group Chat
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleOnSubmit}
              className="flex size-full flex-col justify-between"
            >
              <div className="space-y-4">
                <fieldset className="space-y-2 text-xs">
                  <Label
                    htmlFor="group-name"
                    className="font-semibold text-muted-foreground"
                  >
                    Group Name
                  </Label>
                  <Input
                    id="group-name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full rounded-none border-none bg-muted/80 text-primary placeholder:text-xs placeholder:text-primary"
                  />
                </fieldset>
                <fieldset className="space-y-2 text-xs">
                  <Label
                    htmlFor="search-group-users"
                    className="font-semibold text-muted-foreground"
                  >
                    Add Group Users
                  </Label>
                  {/* Search Box */}
                  <div className="relative">
                    <Input
                      id="search-group-users"
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
                  </div>
                  <SearchResult
                    errorMessage={errorMessage}
                    isLoading={isLoading}
                    results={users}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                  />
                </fieldset>
              </div>

              <Button
                variant="secondary"
                className="mt-8 w-full max-w-52 self-center"
              >
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <section className="mt-8 px-4">{content}</section>
    </TabsContent>
  );
}

type SearchResultProps = {
  isLoading: boolean;
  errorMessage: boolean;
  results: User[];
  selectedUsers: string[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
};

function SearchResult({
  isLoading,
  errorMessage,
  results,
  selectedUsers,
  setSelectedUsers,
}: SearchResultProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="size-8 animate-spin" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <p className="py-8 text-center text-sm font-bold text-muted-foreground">
        No results found
      </p>
    );
  }

  const handleOnChange = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <section className="border-t border-muted-foreground px-1 py-4">
      <p className="text-center text-sm font-medium text-muted-foreground">
        {results.length ? "Search results" : null}
      </p>
      <ScrollArea
        thumbClassName="bg-muted-foreground"
        className="h-[19rem] lg:h-[30rem]"
      >
        <ul className="mt-4 space-y-4">
          {results.map((user) => {
            return (
              <FadeUp
                key={user.id}
                className="rounded bg-muted-foreground/50 hover:bg-muted-foreground"
              >
                <Label
                  htmlFor={`select-user-group-${user.id}`}
                  className="flex cursor-pointer items-center justify-between p-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-8 overflow-hidden rounded-full bg-secondary/50 p-[2px] text-xs">
                      <img
                        src={user.image || "/user.png"}
                        alt={user.name.slice(0, 2)}
                        className="flex size-full items-center justify-center rounded-full object-cover text-primary"
                      />
                    </div>
                    <p className="text-sm font-semibold text-secondary">
                      {user.name}
                    </p>
                  </div>

                  <Input
                    type="checkbox"
                    id={`select-user-group-${user.id}`}
                    className="size-4 cursor-pointer"
                    onChange={() => handleOnChange(user.id)}
                    checked={selectedUsers.includes(user.id)}
                    value={user.id}
                  />
                </Label>
              </FadeUp>
            );
          })}
        </ul>
      </ScrollArea>
    </section>
  );
}
