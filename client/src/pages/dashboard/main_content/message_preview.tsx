import { cn, isOnlyEmojis } from "@/lib/utils";
import { Message, User } from "@/lib/types";
import { useProfilePanelStore } from "../stores/side-panels";
import { useCurrentChatStore } from "../stores/chat";
import { useUser } from "@clerk/clerk-react";
import { Fullscreen } from "lucide-react";

type MessagePreviewProps = Message & {
  IsSameSender: boolean;
};

export const MessagePreview = ({
  sender,
  content,
  files,
  IsSameSender,
}: MessagePreviewProps) => {
  const { user } = useUser();
  const { setUserProfile } = useProfilePanelStore();
  const { currentChatUser } = useCurrentChatStore();

  const isSender = sender.id !== currentChatUser?.id;
  const isEmojiOnly = isOnlyEmojis(content);

  return (
    <div className="my-2 flex items-center gap-2">
      <div
        className={cn(
          "flex w-fit flex-col rounded-lg px-4 py-3 text-xs text-secondary",
          isSender
            ? "order-1 self-start rounded-tl-none bg-primary"
            : "self-end rounded-tr-none bg-indigo-500 dark:text-primary",
          isEmojiOnly ? "bg-transparent p-0 text-4xl" : "",
          files.length > 0 ? "gap-2" : "",
        )}
      >
        <span>{content}</span>
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {files.map((file) => {
              // Check MIME type to render appropriate preview
              const isImage = file.mimeType.startsWith("image/");
              const isVideo = file.mimeType.startsWith("video/");
              const isPdf = file.mimeType === "application/pdf";

              return (
                <div key={file.url}>
                  {isImage && (
                    <div className="group relative overflow-hidden">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={file.url}
                          alt={file.originalName}
                          className="size-28 rounded object-cover"
                        />
                      </a>
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-0 grid size-full bg-black/10 opacity-0",
                          "transition-opacity duration-300 ease-in-out",
                          "group-hover:opacity-100",
                        )}
                      >
                        <Fullscreen
                          className={cn(
                            "invisible absolute block size-6 translate-y-20 place-self-center text-white opacity-0",
                            "pointer-events-none transition-[transform_opacity] duration-300 ease-in-out",
                            "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {isVideo && (
                    <video controls className="h-20 w-20 rounded">
                      <source src={file.url} type={file.mimeType} />
                      Your browser does not support the video tag.
                    </video>
                  )}

                  {isPdf && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "text-xs text-white underline",
                        !isSender
                          ? "hover:text-black"
                          : "hover:text-indigo-400",
                      )}
                    >
                      <img
                        src={"file.png"}
                        alt={file.originalName}
                        className="mb-2 size-10 rounded object-cover"
                      />
                      {file.originalName}
                    </a>
                  )}

                  {/* Fallback for other file types */}
                  {!isImage && !isVideo && !isPdf && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground underline"
                    >
                      {file.originalName}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <button
        className={cn(
          "aspect-square size-7 self-start rounded-full bg-gradient-to-br from-primary via-input to-indigo-500 p-[2px]",
          IsSameSender ? "invisible" : "",
        )}
        onClick={() => setUserProfile(sender as User)}
      >
        <img
          src={!isSender ? sender?.image : user?.imageUrl}
          alt=""
          className="aspect-square size-full rounded-full object-cover"
        />
      </button>
    </div>
  );
};
