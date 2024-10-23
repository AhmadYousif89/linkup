import { Info, Phone, Video } from "lucide-react";

import { useCurrentChatStore } from "./stores/chat";
import { useActiveTabStore } from "./stores/side-panels";
import { useProfilePanelStore } from "./stores/side-panels";

import { Button } from "@/components/ui/button";
import { Messages } from "./main_content/messages";
import { InputMessage } from "./main_content/input_message";
import { useSocketStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Chat() {
  const { userStatus } = useSocketStore();
  const { setActiveTab } = useActiveTabStore();
  const { currentChatUser } = useCurrentChatStore();
  const { isOpen, setIsOpen, setUserProfile } = useProfilePanelStore();

  const userName = currentChatUser?.name || "John Doe";
  const intials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("");
  const currentChatUserStatus = userStatus[currentChatUser?.id || ""];

  return (
    <>
      <header className="flex min-h-16 items-center justify-between border-b border-muted-foreground/25 bg-muted px-4 dark:border-muted-foreground lg:px-6">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            onClick={() => {
              if (currentChatUser) {
                setUserProfile(currentChatUser);
                setIsOpen(true);
              }
            }}
            className={cn(
              "relative flex size-10 items-center justify-center rounded-full bg-muted-foreground p-[2px]",
              "before:absolute before:bottom-0 before:left-0 before:size-2.5",
              "before:rounded-full before:border",
              currentChatUserStatus === "online"
                ? "before:bg-green-500"
                : currentChatUserStatus === "offline"
                  ? "before:bg-destructive"
                  : "before:bg-muted-foreground",
            )}
          >
            <img
              alt={intials}
              src={currentChatUser?.image || "/user.png"}
              className="aspect-square rounded-full object-cover"
            />
          </Button>
          {/* Active User */}
          <div className="*:block">
            <span className="text-sm font-semibold">{userName}</span>
            <span className="text-xs font-medium text-muted-foreground">
              Reply to message
            </span>
          </div>
        </div>
        {/* Chat Tools */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="size-6 bg-transparent p-1 text-muted-foreground dark:border-muted-foreground lg:size-7"
          >
            <Video />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-6 bg-transparent p-1 text-muted-foreground dark:border-muted-foreground lg:size-7"
          >
            <Phone />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-pressed={isOpen}
            onClick={() => {
              setIsOpen(!isOpen);
              if (window.innerWidth < 1024) {
                setActiveTab("");
              }
            }}
            className="size-6 bg-transparent p-1 text-muted-foreground dark:border-muted-foreground lg:size-7"
          >
            <Info />
          </Button>
        </div>
      </header>

      <Messages />

      <InputMessage />
    </>
  );
}
