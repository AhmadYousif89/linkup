import { useEffect, useRef, useState } from "react";
import { Paperclip, Phone, Send, Video } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MainContent() {
  const [messageValue, setMessageValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <>
      {/* Chat Messages */}
      <section className="flex h-full flex-col">
        <div className="mt-auto px-2 py-4 text-center text-sm font-medium text-secondary md:px-6">
          {/* Welcome Message */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground md:gap-6">
            <div className="h-px w-full bg-muted-foreground" />
            <div className="min-w-fit rounded-full bg-muted-foreground px-4 py-1.5 text-primary md:px-6">
              Start of conversation
            </div>
            <div className="h-px w-full bg-muted-foreground" />
          </div>
          {/* Message List */}
          <ul className="flex flex-col space-y-4 py-4">
            <li className="self-start">
              <div className="flex max-w-prose flex-col text-left">
                <small className="mb-1 font-semibold text-muted-foreground">
                  John Doe
                </small>
                <p className="rounded-lg rounded-tl-none bg-muted p-4 text-xs text-primary">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
                  velit numquam quibusdam sint fugit suscipit consequatur cum
                  sed expedita! Laborum expedita obcaecati ut perferendis vel
                  ipsum sunt qui tempore earum!
                </p>
                <small className="self-end text-muted-foreground">
                  4:11 pm
                </small>
              </div>
            </li>
            {/* Current User */}
            <li className="self-end">
              <div className="flex max-w-prose flex-col text-left">
                <small className="mb-1 self-end font-semibold text-muted-foreground">
                  Ahmad Yousif
                </small>
                <p className="w-fit self-end rounded-lg rounded-tr-none bg-indigo-500 p-4 text-xs text-primary">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <small className="self-start text-muted-foreground">
                  4:11 pm
                </small>
              </div>
            </li>
          </ul>
        </div>

        {/* Input Message */}
        <div className="flex items-center justify-between gap-1 border-t border-muted-foreground bg-primary px-2 py-4">
          <div
            className="flex flex-1 items-center justify-between gap-1"
            aria-label="Input message"
          >
            <Label htmlFor="message" className="flex-1">
              <Textarea
                id="message"
                ref={textareaRef}
                value={messageValue}
                onChange={handleMessageChange}
                style={{ resize: "none" }}
                placeholder="Type a message ..."
                className="min-h-9 rounded border-none bg-muted-foreground/25 text-secondary placeholder:text-xs"
              />
            </Label>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="size-8 p-2 text-muted-foreground hover:border-none hover:bg-indigo-500"
            >
              <Paperclip />
            </Button>
          </div>
          <Button
            size={"icon"}
            variant={"ghost"}
            disabled={!messageValue}
            className="size-9 border border-muted-foreground bg-primary p-2 text-secondary hover:border-none hover:bg-indigo-500"
          >
            <Send />
          </Button>
        </div>
      </section>
    </>
  );
}
