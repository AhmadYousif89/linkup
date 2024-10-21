import { Loader, Plus, EllipsisVertical, Search, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useActiveTabStore } from "../stores/side-panels";
import { Card } from "@/components/ui/card";

export function UserRooms() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { groupChats, setGroupChats, setCurrentGroupChat } =
    useGroupChatStore();
  const { activeTab, setActiveTab } = useActiveTabStore();

  useEffect(() => {
    if (activeTab !== "Groups") return;
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
  }, [searchTerm, activeTab]);

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
    if (activeTab !== "Groups") return;
    const fetchData = async () => {
      try {
        const chats = await fetchGroupChats();
        setGroupChats(chats);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleStartChat = (chatId: string) => {
    setCurrentGroupChat(chatId);
    if (window.innerWidth < 1024) setActiveTab("");
  };

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
            <FadeUp key={chat.id}>
              <Card
                onClick={() => handleStartChat(chat.id)}
                className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <div className="size-8 overflow-hidden rounded-full bg-gradient-to-br from-primary via-input to-indigo-500 p-[2px] text-xs">
                    <img
                      src={chat.groupAdmin?.image || "/user.png"}
                      alt={chat.chatName.slice(0, 2)}
                      className="flex size-full items-center justify-center rounded-full object-cover text-primary"
                    />
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {chat.chatName}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      asChild
                      className="size-6 p-1 text-xs"
                      variant={"outline"}
                      size={"sm"}
                    >
                      <EllipsisVertical />
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
                    <DropdownMenuItem className="text-xs font-medium">
                      View chat
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-medium">
                      Edit chat
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-xs font-medium">
                      Delete chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Card>
            </FadeUp>
          );
        })}
      </ul>
    );

  return (
    <TabsContent value="Groups">
      <header className="flex h-16 items-center justify-between gap-4 border-b px-4 dark:border-muted-foreground">
        <h2 className="font-medium">My Groups</h2>
        <span className="flex size-5 items-center justify-center rounded border p-2 text-xs dark:border-muted-foreground">
          {groupChats?.length}
        </span>
      </header>

      <section>
        <Dialog>
          <DialogTrigger className="w-full border-b pb-4 dark:border-muted-foreground">
            <Button
              asChild
              variant="outline"
              className="mx-auto max-w-52 gap-2 hover:border-primary"
            >
              <div className="mt-4 border shadow">
                <span>Create Group</span>
                <Plus className="size-5" />
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="flex h-[calc(100%-4rem)] flex-col text-primary">
            <DialogHeader>
              <DialogTitle className="border-b pb-4">
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
                    placeholder="Enter Group Name"
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full rounded-none text-primary placeholder:text-xs dark:bg-muted-foreground dark:text-secondary dark:placeholder:text-muted"
                  />
                </fieldset>
                <fieldset className="space-y-2 text-xs">
                  <Label
                    htmlFor="search-group-users"
                    className="font-semibold text-muted-foreground"
                  >
                    Select Group Members
                  </Label>
                  {/* Search Box */}
                  <div className="relative">
                    <Input
                      id="search-group-users"
                      type="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search members..."
                      className="w-full rounded-none text-primary placeholder:text-xs dark:bg-muted-foreground dark:text-secondary dark:placeholder:text-muted"
                    />
                    <div className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center text-clip bg-secondary p-1 text-primary dark:bg-muted-foreground">
                      {searchTerm ? (
                        <X onClick={() => setSearchTerm("")} />
                      ) : (
                        <Search />
                      )}
                    </div>
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
    <section className="border-t px-1 py-4">
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
                    <div className="size-8 overflow-hidden rounded-full bg-primary/50 p-[2px] text-xs">
                      <img
                        src={user.image || "/user.png"}
                        alt={user.name.slice(0, 2)}
                        className="flex size-full items-center justify-center rounded-full object-cover text-primary"
                      />
                    </div>
                    <p className="text-sm font-semibold text-primary">
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
