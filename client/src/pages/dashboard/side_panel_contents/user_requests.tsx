import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Check, XCircle } from "lucide-react";

export function UserRequests() {
  return (
    <TabsContent value="Requests">
      <header className="flex h-16 items-center justify-between gap-4 border-b border-muted-foreground px-4">
        <h2 className="font-medium text-muted">Friend Requests</h2>
        <span className="flex size-5 items-center justify-center rounded border border-muted-foreground p-2 text-xs text-muted">
          1
        </span>
      </header>

      {/* Requests */}
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center justify-between gap-4 rounded bg-muted-foreground/10 p-4">
          <div className="flex items-center gap-4">
            <div className="size-10 overflow-hidden rounded-full bg-secondary/50 p-[2px] text-xs">
              <img
                alt="User"
                src="/user.png"
                className="aspect-square rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-muted">
                User Name
              </span>
              <small className="text-xs font-medium text-muted-foreground">
                User Email
              </small>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="icon"
              className="size-6 p-1 text-muted-foreground hover:bg-green-50 hover:text-green-500"
            >
              <Check />
            </Button>
            <Button
              size="icon"
              className="size-6 p-1 text-muted-foreground hover:bg-destructive hover:text-primary"
            >
              <XCircle />
            </Button>
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
