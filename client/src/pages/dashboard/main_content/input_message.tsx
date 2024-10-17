import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Paperclip, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCurrentChatStore } from "../stores/chat";
import { SocketEvent, socket, useSocketStore } from "@/lib/store";
import { sendMessage } from "@/lib/actions";

export function InputMessage() {
  const [messageValue, setMessageValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentChat: currentChatUser } = useCurrentChatStore();
  const { setNewMessage, setIsTyping } = useSocketStore();
  const { user } = useUser();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "36px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
    }
  }, [messageValue]);

  useEffect(() => {
    socket.on(SocketEvent.User.IsTyping, () => {
      setIsTyping(true);
    });

    socket.on(SocketEvent.User.IsNotTyping, () => {
      setIsTyping(false);
    });

    return () => {
      socket.off(SocketEvent.User.IsTyping);
      socket.off(SocketEvent.User.IsNotTyping);
    };
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const chatId = currentChatUser?.id;
    socket.emit(SocketEvent.User.IsTyping, chatId);
    setMessageValue(e.target.value);

    // Clear the previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Set a new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SocketEvent.User.IsNotTyping, chatId);
    }, 2000) as unknown as null;
  };
  const handleInputBlur = () => {
    const chatId = currentChatUser?.id;
    socket.emit(SocketEvent.User.IsNotTyping, chatId);
  };

  const handleSendMessage = async () => {
    if (!messageValue) return toast.error("Message is required");
    if (!currentChatUser) return toast.error("User not found");

    const chatId = currentChatUser?.id;
    try {
      const message = await sendMessage(messageValue, chatId);
      console.log("Message sent:", message);
      socket.emit(SocketEvent.Messages.New, message);
      setNewMessage(message);
      setMessageValue("");
      textareaRef.current?.focus();
      socket.emit(SocketEvent.User.IsNotTyping, chatId);
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) throw new Error("User not found");

    try {
      handleSendMessage();
    } catch (error) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative z-[100] flex items-center justify-between gap-1 border-t-2 border-muted-foreground bg-primary px-2 py-5"
    >
      {/* {isTyping && (
        <span className="animate-typing absolute left-8 top-2 inline-flex rounded-full p-1" />
      )} */}
      <div
        className="flex flex-1 items-center justify-between gap-1"
        aria-label="Input message"
      >
        <Label htmlFor="message" className="flex-1">
          <Textarea
            id="message"
            ref={textareaRef}
            value={messageValue}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onBlur={handleInputBlur}
            onChange={handleMessageChange}
            style={{ resize: "none" }}
            placeholder="Type a message ..."
            className="min-h-9 rounded border-none bg-muted-foreground/25 text-secondary placeholder:text-xs"
          />
        </Label>
        <Button
          size="icon"
          type="button"
          variant="ghost"
          className="size-8 p-2 text-muted-foreground hover:border-none hover:bg-indigo-500"
        >
          <Paperclip />
        </Button>
      </div>
      <Button
        size="icon"
        type="submit"
        variant="ghost"
        className="size-9 border border-muted-foreground bg-primary p-2 text-secondary hover:border-none hover:bg-indigo-500"
      >
        <Send />
      </Button>
    </form>
  );
}
