import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Message, User } from "@/lib/types";
import { getMessagesFromDB } from "@/lib/actions";
import { SocketEvent, socket, useSocketStore } from "@/lib/store";

import FadeUp from "@/components/fade_up";
import { useCurrentChatStore } from "../stores/chat";
import { useProfilePanelStore } from "../stores/side-panels";
import { useUser } from "@clerk/clerk-react";
import { useScrollToBottom } from "@/hooks/use_scrollToBottom";

export function Messages() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserProfile } = useProfilePanelStore();
  const { currentChatUser, currentChat } = useCurrentChatStore();
  const { messages, setMessagesFromDB, setNewMessage } = useSocketStore();
  const { user } = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentChat?.id) {
          setIsLoading(true);
          const messages = await getMessagesFromDB(currentChat.id);
          setMessagesFromDB(messages);
          socket.emit(SocketEvent.Chat.Join, currentChat.id);
        } else {
          setMessagesFromDB([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [currentChat?.id]);

  useEffect(() => {
    function handleMessageReceive(message: Message) {
      setNewMessage(message);
    }
    socket.on(SocketEvent.Messages.Recieved, handleMessageReceive);

    return () => {
      socket.off(SocketEvent.Messages.Recieved, handleMessageReceive);
    };
  }, []);

  const { scrollWithDelay } = useScrollToBottom(chatContainerRef, {
    duration: 5,
    type: "spring",
    ease: "easeInOut",
  });

  useEffect(() => {
    if (messages.length) scrollWithDelay(300);
  }, [messages.length]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-20 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <p className="text-sm text-muted-foreground">
          This is the beginning of your chat with{" "}
          <p className="text-lg font-semibold">{currentChatUser?.name}</p>
        </p>
      </div>
    );
  }

  return (
    <motion.div
      ref={chatContainerRef}
      className="no-scrollbar relative flex h-full flex-col gap-4 overflow-y-scroll overscroll-contain px-2 py-6 lg:px-4 2xl:px-8"
    >
      <motion.ul className="mt-auto flex flex-col justify-between">
        {messages.map((message, index) => {
          const isSender = message.sender.id !== currentChatUser?.id;
          const hasNextMessageFromSameUser =
            messages[index - 1]?.sender.id === messages[index].sender.id;

          return (
            <FadeUp
              key={message.id}
              className={cn(
                "flex flex-col text-left lg:max-w-lg xl:max-w-2xl",
                isSender ? "items-start self-start" : "items-end self-end",
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold text-muted-foreground",
                  isSender ? "ml-10 self-start" : "mr-10 self-end",
                  hasNextMessageFromSameUser ? "invisible" : "",
                )}
              >
                {!isSender ? message.sender.name : "Me"}
              </span>
              <div className="my-2 flex items-center gap-2">
                <p
                  className={cn(
                    "w-fit rounded-lg px-4 py-3 text-xs text-primary md:text-sm",
                    isSender
                      ? "order-1 self-start rounded-tl-none bg-secondary"
                      : "self-end rounded-tr-none bg-indigo-500",
                  )}
                >
                  {message.content}
                </p>
                <button
                  className={cn(
                    "aspect-square size-7 self-start rounded-full bg-muted-foreground p-[2px]",
                    hasNextMessageFromSameUser ? "invisible" : "",
                  )}
                  onClick={() => setUserProfile(message.sender as User)}
                >
                  <img
                    src={!isSender ? message.sender.image : user?.imageUrl}
                    alt="profile image"
                    className="aspect-square size-full rounded-full object-cover"
                  />
                </button>
              </div>
              <small
                className={cn(
                  "text-xs text-primary",
                  isSender ? "ml-10 self-start" : "mr-10 self-end",
                )}
              >
                {message.updatedAt} {isSender ? "• Sent" : ""}
              </small>
            </FadeUp>
          );
        })}
      </motion.ul>
    </motion.div>
  );
}
