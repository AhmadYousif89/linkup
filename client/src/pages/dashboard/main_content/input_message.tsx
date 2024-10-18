import { useEffect, useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCurrentChatStore } from "../stores/chat";
import { useSocketStore } from "@/lib/store";
import { sendMessage } from "@/lib/actions";

export function InputMessage() {
  const { user } = useUser();
  const [msgContent, setMsgContent] = useState("");
  const typingTimeoutRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isTyping, setNewMessage, emitTyping, emitMessage } = useSocketStore();
  const { currentChat } = useCurrentChatStore();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "36px";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;
    }
  }, [msgContent]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!currentChat) return;
    if (e.target.value.length > 200) {
      return toast.error("Message is too long");
    }

    const chatId = currentChat.id;
    emitTyping(chatId, true);
    setMsgContent(e.target.value);
    // Clear the previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    // Set a new timeout
    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(chatId, false);
    }, 2000) as unknown as number;
  };

  const handleSendMessage = async () => {
    if (!msgContent) return toast.error("Message is required");
    if (!currentChat) throw new Error("Chat not found");

    const chatId = currentChat.id;
    try {
      const message = await sendMessage(msgContent, chatId);
      console.log("Message sent:", message);
      emitMessage(message);
      setMsgContent("");
      setNewMessage(message);
      textareaRef.current?.focus();
    } catch (error) {
      if (error instanceof Error) console.error(error);
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
      className="relative z-[100] flex items-center justify-between gap-1 border-t-2 border-muted-foreground bg-primary px-2 py-8"
    >
      {isTyping && (
        <small className="absolute top-0 mt-1.5 text-xs font-bold text-indigo-400">
          {user?.fullName} is typing . . .
        </small>
      )}
      <div
        className="flex flex-1 items-center justify-between gap-1"
        aria-label="Input message"
      >
        <Label htmlFor="message" className="flex-1">
          <Textarea
            id="message"
            ref={textareaRef}
            value={msgContent}
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
