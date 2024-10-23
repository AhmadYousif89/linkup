import { create } from "zustand";

type File = {
  id: string;
  name: string;
  preview: string | ArrayBuffer | null;
  type: string;
};
type FileStore = {
  filePreviews: File[];
  setFilePreviews: (filePreviews: File[] | ((files: File[]) => File[])) => void;
  removeFilePreview: (fileId: string) => void;
};

export const useFileStore = create<FileStore>((set) => ({
  filePreviews: [],
  setFilePreviews: (filePreviews) =>
    set((state) => ({
      filePreviews:
        typeof filePreviews === "function"
          ? filePreviews(state.filePreviews)
          : filePreviews,
    })),
  removeFilePreview: (fileId) =>
    set((state) => ({
      filePreviews: state.filePreviews.filter((file) => file.id !== fileId),
    })),
}));
