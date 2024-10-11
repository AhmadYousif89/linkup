import { motion, useInView } from "framer-motion";
import {
  useRef,
  useState,
  useEffect,
  PropsWithChildren,
  Fragment,
} from "react";
import { Info, Paperclip, Phone, Send, Video } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useActiveTabStore,
  useMainChatStore,
  useProfilePanelStore,
} from "./lib/store";

export function MainContent() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { isOpen, setIsOpen } = useProfilePanelStore();
  const { setActiveTab } = useActiveTabStore();
  const { mainChatUser } = useMainChatStore();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  const userName = mainChatUser?.name || "John Doe";
  const intials = userName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      {/* Chat Header */}
      <header className="flex min-h-16 items-center justify-between border-b border-muted-foreground bg-primary px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-secondary/50 p-1">
            <img
              alt={intials}
              src={mainChatUser?.image || "/user.png"}
              className="aspect-square rounded-full object-cover"
            />
          </div>
          {/* Active User */}
          <div className="*:block">
            <span className="text-sm font-semibold text-muted">{userName}</span>
            <small className="text-xs font-medium text-muted-foreground">
              Reply to message
            </small>
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
      <div
        ref={chatContainerRef}
        className="no-scrollbar grid h-full overflow-y-scroll overscroll-contain"
      >
        <motion.ul className="mt-auto flex flex-col justify-between space-y-8 self-center p-4 xl:p-6">
          {[...Array(20)].map((_, i) => (
            <Fragment key={i}>
              <Message className="self-start">
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
                    16:33 pm
                  </small>
                </div>
              </Message>
              <Message className="self-end">
                <div className="flex max-w-sm flex-col text-left lg:max-w-lg xl:max-w-2xl">
                  <small className="mb-1 self-end font-semibold text-muted-foreground">
                    Ahmad Yousif
                  </small>
                  <p className="w-fit self-end rounded-lg rounded-tr-none bg-indigo-500 p-4 text-xs text-primary">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                  <small className="self-start text-muted-foreground">
                    12:11 pm
                  </small>
                </div>
              </Message>
            </Fragment>
          ))}
        </motion.ul>
      </div>

      <InputMessage />
    </>
  );
}

type MessageProps = PropsWithChildren & { className?: string };

function Message({ children, className }: MessageProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView && !isVisible) {
      setIsVisible(true);
    }
  }, [isInView, isVisible]);

  return (
    <motion.li
      ref={ref}
      initial={false}
      variants={{
        hidden: { opacity: 0, translateY: "25px" },
        visible: { opacity: 1, translateY: "0px" },
      }}
      animate={isVisible ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={className}
    >
      {children}
    </motion.li>
  );
}

function InputMessage() {
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
    <div className="z-[100] flex items-center justify-between gap-1 border-t border-muted-foreground bg-primary px-2 py-4">
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
  );
}

/*
<div className="flex items-center gap-4 text-xs text-muted-foreground md:gap-6">
<span className="h-px w-full bg-muted-foreground/50" />
<div className="min-w-fit rounded-full bg-muted/80 px-4 py-1.5 text-primary md:px-6">
  Start of conversation
</div>
<span className="h-px w-full bg-muted-foreground/50" />
</div>
*/
