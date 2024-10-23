import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Pencil, Trash2 } from "lucide-react";
import { useFileStore } from "../stores/file";
import { cn, generateId } from "@/lib/utils";
import { toast } from "sonner";

import FadeUp from "@/components/fade_up";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const FilePreview = () => {
  const { filePreviews, removeFilePreview, setFilePreviews } = useFileStore();
  const [editingFile, setEditingFile] = useState<string | null>(null);

  const handleDrop = useCallback(
    (newFiles: File[]) => {
      console.log(newFiles);
      if (newFiles.length === 0 || !editingFile) return;
      if (newFiles.length > 1)
        toast.warning("Only one file can be edited at a time.");
      // Only handle one file at a time
      const newFile = newFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const preview = reader.result;
        // Replace the old file with the new one
        setFilePreviews((prevFiles) =>
          prevFiles.map((file) =>
            file.id === editingFile
              ? {
                  id: generateId(),
                  name: newFile.name,
                  type: newFile.type.split("/")[0],
                  preview,
                }
              : file,
          ),
        );
        // Reset editing state
        setEditingFile(null);
      };

      reader.readAsDataURL(newFile);
    },
    [editingFile, setFilePreviews],
  );

  const { getInputProps, getRootProps, open } = useDropzone({
    onDrop: handleDrop,
    noClick: true, // Disable automatic click handling, as we want to trigger the file dialog manually
    noKeyboard: true, // Disable keyboard shortcuts for opening file dialog
  });

  if (filePreviews.length === 0) return null;
  console.log(filePreviews);
  return (
    <>
      {/* Hidden input to handle file selection via Dropzone */}
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>
      <ScrollArea className="max-w-[calc(100vw-6rem)] self-start whitespace-nowrap">
        <ul className="flex gap-4">
          {filePreviews.map((file, i) => (
            <FadeUp
              key={i + file.name}
              className="relative flex size-28 items-center justify-center self-start rounded-md"
            >
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Delete file"
                onClick={() => removeFilePreview(file.id)}
                className={cn(
                  "absolute left-0 top-0 size-6 p-1",
                  "rounded-bl-none rounded-tl-none rounded-tr-none",
                  "hover:bg-destructive hover:text-secondary dark:text-primary",
                  "max-sm:bg-destructive max-sm:text-secondary md:bg-muted",
                )}
              >
                <Trash2 />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Edit file"
                onClick={() => {
                  setEditingFile(file.id);
                  open();
                }}
                className={cn(
                  "absolute right-0 top-0 size-6 p-1",
                  "rounded-br-none rounded-tl-none rounded-tr-none",
                  "hover:bg-indigo-400 hover:text-secondary dark:text-primary",
                  "max-sm:bg-indigo-400 max-sm:text-secondary md:bg-muted",
                )}
              >
                <Pencil />
              </Button>
              {file.preview && (
                <>
                  {file.type === "image" && (
                    <img
                      src={file.preview as string}
                      alt="Image preview"
                      draggable={false}
                      className="aspect-square rounded-md object-cover text-xs"
                    />
                  )}
                  {file.type === "application" && (
                    <img
                      src={"file.png"}
                      alt="File preview"
                      draggable={false}
                      className="aspect-square rounded-md object-cover text-xs"
                    />
                  )}
                </>
              )}
              <p className="pointer-events-none absolute bottom-0 line-clamp-1 w-full bg-muted/80 text-center text-xs">
                {file.name}
              </p>
            </FadeUp>
          ))}
        </ul>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
};
