import { Fragment, useEffect, useRef, useState } from "react";
import { Info, Paperclip, Phone, Send, Video } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProfilePanelStore } from "./lib/store";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MainContent() {
  const [messageValue, setMessageValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isOpen, setIsOpen } = useProfilePanelStore();

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
      {/* Chat Header */}
      <header className="sticky top-0 flex h-16 items-center justify-between border-b border-muted-foreground bg-primary px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 select-none items-center justify-center rounded-full bg-muted text-xs text-primary">
            JD
          </div>
          {/* Active User */}
          <div className="*:block">
            <span className="text-sm font-semibold text-muted">John Doe</span>
            <small className="text-xs font-medium text-muted-foreground">
              Reply to message
            </small>
          </div>
        </div>
        {/* Chat Tools */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Button
            size={"icon"}
            className="size-6 p-1 text-muted-foreground hover:text-muted lg:size-8"
          >
            <Video />
          </Button>
          <Button
            size={"icon"}
            className="size-6 p-1 text-muted-foreground hover:text-muted lg:size-8"
          >
            <Phone />
          </Button>
          <Button
            size={"icon"}
            aria-pressed={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="size-5 p-0 lg:size-8"
          >
            <Info className={isOpen ? "text-muted" : "text-muted-foreground"} />
          </Button>
        </div>
      </header>

      <>
        {/* Chat Messages */}
        <ul className="flex flex-col justify-end space-y-4 overflow-y-auto p-4 lg:p-8">
          {/* Welcome Message */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground md:gap-6">
            <span className="h-px w-full bg-muted-foreground" />
            <div className="min-w-fit rounded-full bg-muted/80 px-4 py-1.5 text-primary md:px-6">
              Start of conversation
            </div>
            <span className="h-px w-full bg-muted-foreground" />
          </div>
          {[...Array(3)].map((_, index) => (
            <Fragment key={index}>
              <li className="self-start">
                <div className="flex max-w-sm flex-col text-left lg:max-w-lg xl:max-w-2xl">
                  <small className="mb-1 font-semibold text-muted-foreground">
                    John Doe
                  </small>
                  <p className="rounded-lg rounded-tl-none bg-muted p-4 text-xs text-primary">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quam velit numquam quibusdam sint fugit suscipit consequatur
                    cum sed expedita! Laborum expedita obcaecati ut perferendis
                    vel ipsum sunt qui tempore earum!
                  </p>
                  <small className="self-end text-muted-foreground">
                    4:11 pm
                  </small>
                </div>
              </li>
              <li className="self-end">
                <div className="flex max-w-sm flex-col text-left lg:max-w-lg xl:max-w-2xl">
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
            </Fragment>
          ))}
          <div className="flex items-center gap-4 text-xs text-muted-foreground md:gap-6">
            <span className="h-px w-full bg-muted-foreground" />
            <div className="min-w-fit rounded-full bg-muted/80 px-4 py-1.5 text-primary md:px-6">
              Today at 4:11 pm
            </div>
            <span className="h-px w-full bg-muted-foreground" />
          </div>
          {[...Array(3)].map((_, index) => (
            <Fragment key={index}>
              <li className="self-start">
                <div className="flex max-w-sm flex-col text-left lg:max-w-lg xl:max-w-2xl">
                  <small className="mb-1 font-semibold text-muted-foreground">
                    John Doe
                  </small>
                  <p className="rounded-lg rounded-tl-none bg-muted p-4 text-xs text-primary">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quam velit numquam quibusdam sint fugit suscipit consequatur
                    cum sed expedita! Laborum expedita obcaecati ut perferendis
                    vel ipsum sunt qui tempore earum!
                  </p>
                  <small className="self-end text-muted-foreground">
                    4:11 pm
                  </small>
                </div>
              </li>
              <li className="self-end">
                <div className="flex max-w-sm flex-col text-left lg:max-w-lg xl:max-w-2xl">
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
            </Fragment>
          ))}
        </ul>
        {/* Input Message */}
        <div className="sticky bottom-0 flex items-center justify-between gap-1 border-t border-muted-foreground bg-primary px-2 py-4">
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
      </>
    </>
  );
}

export default function Component() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <ul className="flex flex-col justify-end space-y-4 p-4 lg:p-8">
            {/* Welcome Message */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground md:gap-6">
              <span className="h-px w-full bg-muted-foreground" />
              <div className="min-w-fit rounded-full bg-muted/80 px-4 py-1.5 text-primary md:px-6">
                Start of conversation
              </div>
              <span className="h-px w-full bg-muted-foreground" />
            </div>

            {/* Sample messages */}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}
