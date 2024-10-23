import { useCallback } from "react";
import { Paperclip } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn, generateId } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFileStore } from "../stores/file";

export const FilePicker = () => {
  const { setFilePreviews } = useFileStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result;
          setFilePreviews((prevFiles) => [
            ...prevFiles,
            {
              id: generateId(),
              name: file.name,
              type: file.type.split("/")[0],
              preview,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
    [setFilePreviews],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          type="button"
          variant="ghost"
          aria-label="Attach file"
          className={cn(
            "size-8 p-2 text-muted-foreground",
            "hover:border-none hover:text-secondary dark:hover:text-primary md:hover:bg-indigo-500",
            "data-[state=open]:bg-indigo-500 data-[state=open]:text-secondary dark:data-[state=open]:text-primary",
          )}
        >
          <Paperclip />
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[100]">
        <DialogTitle className="text-sm text-muted-foreground">
          Attach Files
        </DialogTitle>
        <div
          className={cn(
            "flex min-h-64 flex-col items-center justify-center gap-2 md:min-h-80",
            "border-2 border-dashed border-muted-foreground",
            isDragActive && "border-indigo-500",
          )}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <DialogDescription className="text-lg">
              Drop your file here
            </DialogDescription>
          ) : (
            <DialogDescription className="flex flex-col gap-2 text-center">
              <span className="text-sm md:text-base">
                Drag and drop your file here
              </span>
              <span>Or</span>
              <Button
                size="lg"
                variant="secondary"
                className="mx-auto max-w-28 text-muted-foreground"
              >
                Browse
              </Button>
            </DialogDescription>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
