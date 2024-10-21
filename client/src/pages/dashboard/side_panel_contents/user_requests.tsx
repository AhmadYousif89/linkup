import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Check, XCircle } from "lucide-react";

export function UserRequests() {
  return (
    <TabsContent value="Requests">
      <header className="flex h-16 items-center justify-between gap-4 border-b px-4 dark:border-muted-foreground">
        <h2 className="font-medium">Friend Requests</h2>
        <span className="flex size-5 items-center justify-center rounded border p-2 text-xs dark:border-muted-foreground">
          1
        </span>
      </header>

      {/* Requests */}
      <section className="flex flex-col gap-2 p-1">
        <h3 className="my-4 text-center text-sm font-medium text-muted-foreground">
          Recent Activities
        </h3>
        <Card className="flex items-center justify-between gap-4 rounded bg-muted-foreground/10 p-2 dark:border dark:border-muted-foreground dark:bg-card/50">
          <div className="flex items-center gap-4">
            <div className="size-8 overflow-hidden rounded-full bg-primary/50 p-[2px] text-xs">
              <img
                alt="User"
                src="/user.png"
                className="aspect-square rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">User Name</span>
              <small className="text-xs font-medium text-muted-foreground">
                @ User Email
              </small>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="size-6 p-1 text-muted-foreground hover:bg-green-50 hover:text-green-500"
            >
              <Check />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-6 p-1 text-muted-foreground hover:bg-destructive hover:text-secondary dark:hover:text-muted-foreground"
            >
              <XCircle />
            </Button>
          </div>
        </Card>
      </section>
    </TabsContent>
  );
}
