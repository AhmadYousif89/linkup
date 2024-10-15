import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { cn, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Message, User } from "@/lib/types";
import { Loader } from "lucide-react";

import FadeUp from "@/components/fade_up";
import { useCurrentChatStore } from "../stores/chat";
import { useProfilePanelStore } from "../stores/profile-panel";
import { SocketEvent, socket, useSocketStore } from "@/lib/store";

const getMessagesFromDB = async (chatId: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
  if (!chatId) return [];
  const res = await fetch(`${VITE_SERVER_API}/message/${chatId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const messages = await res.json();
  return messages as Message[];
};

export function Messages() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentChatUser } = useCurrentChatStore();
  const { setUserProfile } = useProfilePanelStore();
  const { messages, setMessagesFromDB, setNewMessage } = useSocketStore();

  const { user } = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentChatUser?.chatId) {
          setIsLoading(true);
          const messages = await getMessagesFromDB(currentChatUser.chatId);
          setMessagesFromDB(messages);
          socket.emit(SocketEvent.Chat.Join, currentChatUser.chatId);
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
  }, [currentChatUser?.chatId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    function handleMessageReceive(message: Message) {
      console.log("Message recieved:", message);
      setNewMessage(message);
    }
    socket.on(SocketEvent.Messages.Recieved, handleMessageReceive);

    return () => {
      socket.off(SocketEvent.Messages.Recieved, handleMessageReceive);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="size-20 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          This is the beginning of your chat with{" "}
          <span className="font-semibold">{currentChatUser?.name}</span>
        </p>
      </div>
    );
  }

  return (
    <div
      ref={chatContainerRef}
      className="no-scrollbar flex h-full flex-col gap-4 overflow-y-auto overscroll-contain px-2 py-6 lg:px-4 2xl:px-8"
    >
      <motion.ul className="flex flex-col justify-between">
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
                {isSender ? message.sender.name : user?.fullName}
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
                  {message.text}
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
                  "text-xs text-muted-foreground",
                  isSender ? "ml-10 self-start" : "mr-10 self-end",
                )}
              >
                {formatDate(message.timestamp)} {isSender ? "• Sent" : ""}
              </small>
            </FadeUp>
          );

          return (
            <FadeUp
              key={message.id}
              className={cn(
                "flex flex-col text-left lg:max-w-lg xl:max-w-2xl",
                isSender ? "self-end" : "self-start",
              )}
            >
              <small
                className={cn(
                  "mb-1 text-xs font-semibold text-muted-foreground",
                  isSender ? "self-end" : "self-start",
                )}
              >
                {isSender ? user?.fullName : message.sender.name}
              </small>
              <p
                className={cn(
                  "my-1 w-fit rounded-lg px-4 py-3 text-xs text-primary",
                  !isSender
                    ? "self-start rounded-tl-none bg-secondary"
                    : "self-end rounded-tr-none bg-indigo-500",
                )}
              >
                {message.text}
              </p>
              <small
                className={cn(
                  "text-xs text-muted-foreground",
                  isSender ? "self-end" : "self-start",
                )}
              >
                {formatDate(message.timestamp)}{" "}
                {isSender ? "• Sent" : "• Received"}
              </small>
            </FadeUp>
          );
        })}
      </motion.ul>
    </div>
  );
}
