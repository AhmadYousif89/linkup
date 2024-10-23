import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Loader, Send } from "lucide-react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { sendMessage } from "@/lib/actions";
import { useSocketStore } from "@/lib/store";
import { useCurrentChatStore } from "../stores/chat";

import { FilePicker } from "./file_picker";
import { EmojiPicker } from "./emoji_picker";
import { FilePreview } from "./file_preview";
import { useFileStore } from "../stores/file";
import { dataURLtoBlob } from "@/lib/utils";

export function InputMessage() {
  const { user } = useUser();
  const [msgContent, setMsgContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isTyping, setNewMessage, emitTyping, emitMessage } = useSocketStore();
  const { currentChat } = useCurrentChatStore();
  const { filePreviews, setFilePreviews } = useFileStore();

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
      setIsLoading(true);
      const formData = new FormData(); // Create a FormData object to handle files and message
      formData.append("chatId", chatId); // Add the chat ID
      formData.append("content", msgContent); // Add the message text
      filePreviews.forEach((file) => {
        const blob = dataURLtoBlob(file.preview as string); // Convert base64 to Blob
        formData.append(`files`, blob, file.name); // Append each file to the FormData
      });

      const message = await sendMessage(formData, chatId);
      console.log("Message sent:", message);
      emitMessage(message);
      setMsgContent("");
      setNewMessage(message);
      setFilePreviews([]);
      textareaRef.current?.focus();
    } catch (error) {
      if (error instanceof Error) console.error(error);
    } finally {
      setIsLoading(false);
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
      className="relative mt-auto flex flex-col items-center justify-between gap-1 border-t border-muted-foreground/25 bg-muted px-1 pb-4 pt-2 dark:border-muted-foreground"
    >
      {isLoading && (
        <>
          <div className="absolute inset-0 z-50 size-full bg-black/25" />
          <div className="bg absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
            <Loader className="size-10 animate-spin" />
          </div>
        </>
      )}
      <FilePreview />

      <div className="relative flex w-full items-center gap-1 pt-6">
        {isTyping && (
          <small className="absolute left-10 top-0 mt-px text-xs font-bold text-indigo-400">
            {user?.fullName} is typing . . .
          </small>
        )}
        <FilePicker />
        <div
          className="flex flex-1 items-center justify-between gap-1"
          aria-label="Input message"
        >
          <Label htmlFor="message" className="mx-1 flex-1">
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
              className="min-h-9 w-full rounded border-none text-primary placeholder:text-xs dark:bg-primary/90 dark:text-secondary"
            />
          </Label>
          <EmojiPicker
            aria-label="Emoji picker"
            setMsgContent={setMsgContent}
          />
        </div>
        <Button
          size="icon"
          type="submit"
          variant="ghost"
          disabled={isLoading}
          aria-label="Send message"
          className="size-8 border p-2 text-muted-foreground hover:border-none hover:bg-indigo-500 hover:text-secondary dark:border-muted-foreground dark:hover:text-primary"
        >
          <Send />
        </Button>
      </div>
    </form>
  );
}
