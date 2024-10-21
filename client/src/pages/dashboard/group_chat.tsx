import { cn } from "@/lib/utils";
import { Info, Phone, Video } from "lucide-react";

import { useGroupChatStore } from "./stores/chat";
import { useActiveTabStore } from "./stores/side-panels";
import { useProfilePanelStore } from "./stores/side-panels";

import { Button } from "@/components/ui/button";
import { InputMessage } from "./main_content/input_message";
import { GroupMessages } from "./main_content/group_messages";

export function GroupChat() {
  const { setActiveTab } = useActiveTabStore();
  const { currentGroupChat } = useGroupChatStore();
  const { isOpen, setIsOpen } = useProfilePanelStore();

  const chatName = currentGroupChat?.chatName || "Group";

  return (
    <>
      <header className="flex min-h-16 items-center justify-between border-b-2 bg-muted px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            onClick={() => {}}
            className={cn(
              "relative flex size-10 items-center justify-center rounded-full bg-muted-foreground p-[2px]",
              "before:absolute before:bottom-0 before:left-0 before:size-2.5",
              "before:rounded-full before:border before:bg-muted-foreground",
            )}
          >
            <img
              alt={"group image"}
              src={currentGroupChat?.groupAdmin?.image || "/user.png"}
              className="aspect-square rounded-full object-cover"
            />
          </Button>
          {/* Active User */}
          <div className="*:block">
            <span className="text-sm font-semibold">{chatName}</span>
            <span className="text-xs font-medium text-muted-foreground">
              Reply to group
            </span>
          </div>
        </div>
        {/* Chat Tools */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="size-6 bg-transparent p-1 text-muted-foreground lg:size-7"
          >
            <Video />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-6 bg-transparent p-1 text-muted-foreground lg:size-7"
          >
            <Phone />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-pressed={isOpen}
            onClick={() => {
              setIsOpen(!isOpen);
              if (window.innerWidth < 1024) setActiveTab("");
            }}
            className="size-6 bg-transparent p-1 text-muted-foreground lg:size-7"
          >
            <Info />
          </Button>
        </div>
      </header>

      <GroupMessages />

      <InputMessage />
    </>
  );
}
