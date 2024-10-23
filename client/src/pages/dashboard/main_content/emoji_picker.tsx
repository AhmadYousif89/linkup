import { useRef, useState } from "react";
import { SmilePlus } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/lib/theme_store";
import { useOnClickOutside } from "@/hooks/use_click_outside";

type EmojiPickerProps = {
  setMsgContent: React.Dispatch<React.SetStateAction<string>>;
};
type EmojiObject = {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
};

export const EmojiPicker = ({ setMsgContent }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();
  useOnClickOutside(emojiRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={emojiRef}>
      <Button
        size="icon"
        type="button"
        variant="ghost"
        aria-pressed={isOpen}
        className={cn(
          "relative size-8 p-2 text-muted-foreground",
          "hover:bg-indigo-500 hover:bg-transparent hover:text-secondary",
          "aria-pressed:bg-indigo-500 aria-pressed:text-secondary",
          "dark:hover:text-primary dark:aria-pressed:text-primary",
          "sm:hover:bg-indigo-500",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <SmilePlus />
      </Button>

      {isOpen && (
        <div className="absolute -right-16 bottom-full z-[100] mb-2">
          <Picker
            data={data}
            theme={theme}
            onEmojiSelect={(emoji: EmojiObject) =>
              setMsgContent((prevText) => prevText + emoji.native)
            }
          />
        </div>
      )}
    </div>
  );
};

//   const handleEmojiClick = (
//     e: React.MouseEvent<HTMLDivElement, MouseEvent>,
//   ) => {
//     e.preventDefault();
//     const button = (e.target as HTMLButtonElement).closest("button");
//     if (!button) return;
//     const emoji = button.textContent as string;
//     onEmojiSelect(emoji);
//   };

// <Card className="absolute -right-16 bottom-full mb-2 min-w-72 p-2">
//   <div
//     className="no-scrollbar grid max-h-48 grid-cols-8 gap-1 overflow-auto"
//     onClick={handleEmojiClick}
//   >
//     {emojis.map((emoji, index) => (
//       <button
//         key={index}
//         className="flex items-center justify-center rounded p-1 text-xl transition-colors hover:bg-muted-foreground/50"
//       >
//         {emoji}
//       </button>
//     ))}
//   </div>
// </Card>
