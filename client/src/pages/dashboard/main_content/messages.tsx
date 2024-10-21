import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";

import { cn, formatDate } from "@/lib/utils";
import { User } from "@/lib/types";
import { useSocketStore } from "@/lib/store";
import { getMessagesFromDB } from "@/lib/actions";

import FadeUp from "@/components/fade_up";
import { useCurrentChatStore } from "../stores/chat";
import { useProfilePanelStore } from "../stores/side-panels";
import { useScrollToBottom } from "@/hooks/use_scrollToBottom";

export function Messages() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserProfile } = useProfilePanelStore();
  const { currentChatUser, currentChat } = useCurrentChatStore();
  const { messages, setMessagesFromDB, emitJoinChat } = useSocketStore();
  const { user } = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentChat?.id) {
          setIsLoading(true);
          const messages = await getMessagesFromDB(currentChat.id);
          setMessagesFromDB(messages);
          emitJoinChat(currentChat.id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [currentChat?.id]);

  const scrollWithDelay = useScrollToBottom(chatContainerRef, {
    ease: "easeInOut",
    damping: 100,
    duration: 2,
  });

  useEffect(() => {
    if (messages.length) scrollWithDelay();
  }, [messages.length]);

  if (!currentChatUser) return;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-20 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const chatUserInitials = currentChatUser.name
    .split(" ")
    .map((n: string) => n[0])
    .join("");
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center font-medium">
        <div className="mb-6 flex size-52 items-center justify-center self-center overflow-hidden rounded-full bg-gradient-to-br from-muted-foreground via-input to-indigo-400 p-1 shadow-lg">
          <img
            src={currentChatUser.image || "/user.png"}
            alt={chatUserInitials}
            className="grid aspect-square size-full place-content-center rounded-full bg-muted-foreground object-cover text-secondary"
          />
        </div>
        <p className="text-sm text-muted-foreground xl:text-lg">
          This is the beginning of your chat with
        </p>
        <p className="text-lg xl:text-2xl">{currentChatUser.name}</p>
      </div>
    );
  }

  return (
    <motion.div
      ref={chatContainerRef}
      className="no-scrollbar relative flex h-full flex-col overflow-y-scroll overscroll-contain px-2 py-6 lg:px-4 2xl:px-8"
    >
      <motion.ul className={cn("mt-auto flex flex-col justify-between")}>
        {messages.map((message, index) => {
          const isSender = message.sender.id !== currentChatUser.id;
          const IsSameSender =
            messages[index].sender.id ===
            (index > 0 && messages[index - 1].sender.id);

          return (
            <FadeUp
              key={message.id}
              className={cn(
                "flex flex-col text-left lg:max-w-lg xl:max-w-2xl",
                isSender ? "items-start self-start" : "items-end self-end",
              )}
            >
              <div data-isSameSender={IsSameSender}>
                <span
                  className={cn(
                    "text-xs font-medium text-muted-foreground",
                    isSender ? "ml-10 self-start" : "mr-10 self-end",
                    IsSameSender ? "hidden" : "",
                  )}
                >
                  {!isSender ? message.sender?.name : "Me"}
                </span>
                <div className="my-2 flex items-center gap-2">
                  <p
                    className={cn(
                      "w-fit rounded-lg px-4 py-3 text-xs text-secondary md:text-sm",
                      isSender
                        ? "order-1 self-start rounded-tl-none bg-primary"
                        : "self-end rounded-tr-none bg-indigo-500 dark:text-primary",
                    )}
                  >
                    {message.content}
                  </p>
                  <button
                    className={cn(
                      "aspect-square size-7 self-start rounded-full bg-gradient-to-br from-primary via-input to-indigo-500 p-[2px]",
                      IsSameSender ? "invisible" : "",
                    )}
                    onClick={() => setUserProfile(message.sender as User)}
                  >
                    <img
                      src={!isSender ? message.sender?.image : user?.imageUrl}
                      alt=""
                      className="aspect-square size-full rounded-full object-cover"
                    />
                  </button>
                </div>
                <small
                  className={cn(
                    "text-xs text-muted-foreground",
                    isSender ? "ml-10 self-start" : "mr-10 self-end",
                  )}
                >
                  {formatDate(message.updatedAt)} {isSender ? "• Sent" : ""}
                </small>
              </div>
            </FadeUp>
          );
        })}
      </motion.ul>
    </motion.div>
  );
}
