import { useEffect } from "react";
import { Info, Phone, Video } from "lucide-react";

import { useCurrentChatStore } from "./stores/chat";
import { useActiveTabStore } from "./stores/side-panels";
import { useProfilePanelStore } from "./stores/side-panels";

import { Button } from "@/components/ui/button";
import { Messages } from "./main_content/messages";
import { InputMessage } from "./main_content/input_message";
import { SocketEvent, socket, useSocketStore } from "@/lib/store";

export function MainContent() {
  const { setActiveTab } = useActiveTabStore();
  const { currentChatUser } = useCurrentChatStore();
  const { isOpen, setIsOpen, setUserProfile } = useProfilePanelStore();
  const { isTyping } = useSocketStore();

  const userName = currentChatUser?.name || "John Doe";
  const intials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    socket.emit(SocketEvent.Connect.Setup, userId);

    function connect(data: string) {
      console.log("Socket Connected: ", data);
    }
    socket.on("connected", connect);

    return () => {
      socket.off("connected", connect);
    };
  }, []);

  return (
    <>
      {/* Chat Header */}
      <header className="flex min-h-16 items-center justify-between border-b-2 border-muted-foreground bg-primary px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentChatUser) setUserProfile(currentChatUser);
            }}
            className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-secondary/50 p-1"
          >
            <img
              alt={intials}
              src={currentChatUser?.image || "/user.png"}
              className="aspect-square rounded-full object-cover"
            />
          </button>
          {/* Active User */}
          <div className="*:block">
            <span className="text-sm font-semibold text-muted">{userName}</span>
            {!isTyping ? (
              <small className="text-xs font-medium text-muted-foreground">
                Reply to message
              </small>
            ) : (
              <small className="text-xs font-semibold text-muted-foreground">
                Typing . . .
              </small>
            )}
          </div>
        </div>
        {/* Chat Tools */}
        <div className="flex items-center gap-4">
          <Button
            size={"icon"}
            className="size-6 p-1 text-muted-foreground hover:text-muted lg:size-7"
          >
            <Video />
          </Button>
          <Button
            size={"icon"}
            className="size-6 p-1 text-muted-foreground hover:text-muted lg:size-7"
          >
            <Phone />
          </Button>
          <Button
            size={"icon"}
            aria-pressed={isOpen}
            onClick={() => {
              setIsOpen(!isOpen);
              if (window.innerWidth < 1024) {
                setActiveTab("");
              }
            }}
            className="size-5 p-0 lg:size-7"
          >
            <Info className={isOpen ? "text-muted" : "text-muted-foreground"} />
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <Messages />

      <InputMessage />
    </>
  );
}
