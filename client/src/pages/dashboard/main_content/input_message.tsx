import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Paperclip, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCurrentChatStore } from "../stores/chat";
import { useSocketStore } from "@/lib/store";

const sendMessage = async (message: string, chatId: string) => {
  const tokenItem = localStorage.getItem("token");
  const token = tokenItem ? JSON.parse(tokenItem) : null;
  const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
  const res = await fetch(`${VITE_SERVER_API}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content: message, chatId }),
  });
  const data = await res.json();
  return data;
};

export function InputMessage() {
  const [messageValue, setMessageValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentChatUser } = useCurrentChatStore();
  const { sendSocketMessage, setNewMessage } = useSocketStore();
  const { user } = useUser();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "36px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
    }
  }, [messageValue]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!messageValue) return toast.error("Message is required");
    if (!currentChatUser) return toast.error("User not found");

    try {
      const message = await sendMessage(messageValue, currentChatUser.chatId);
      console.log("Message sent:", message);
      sendSocketMessage(message);
      setNewMessage(message);
      setMessageValue("");
      textareaRef.current?.focus();
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
      className="z-[100] flex items-center justify-between gap-1 border-t border-muted-foreground bg-primary px-2 py-4"
    >
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
