import { TabsContent } from "@/components/ui/tabs";

export function UserGroups() {
  return (
    <TabsContent value="Groups">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-muted-foreground px-4">
        <h2 className="font-medium text-muted">My Groups</h2>
        <span className="flex size-5 items-center justify-center rounded border border-muted-foreground p-2 text-xs text-muted">
          0
        </span>
      </header>
    </TabsContent>
  );
}
