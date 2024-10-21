import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Video,
  Phone,
  PanelRightClose,
  EllipsisVertical,
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useProfilePanelStore } from "./stores/side-panels";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentChatStore } from "./stores/chat";
import { toast } from "sonner";
import { useSocketStore } from "@/lib/store";

export function ProfilePanel() {
  const { isOpen, setIsOpen, userProfile, setUserProfile } =
    useProfilePanelStore();
  const { setCurrentChat } = useCurrentChatStore();
  const { userStatus } = useSocketStore();

  let profileContent = null;
  if (!userProfile) {
    profileContent = (
      <div className="flex justify-center">
        <p className="mt-16 font-medium text-muted-foreground dark:text-primary">
          Select a member to view profile
        </p>
      </div>
    );
  }

  const profileName = userProfile?.name || "Anonymous";
  const profileNameInitials = userProfile
    ? userProfile.name
        .split(" ")
        .map((letter, index) => index < 2 && letter[0])
        .join(".")
    : "J.D";

  const profileDate = formatDate(userProfile?.updatedAt) + " - (GMT)";
  const profileStatus = userStatus[userProfile?.id || ""];

  const handleCloseDM = () => {
    setCurrentChat(null);
    setUserProfile(null);
    // TODO: Call the close DM API
  };

  const handleBlockUser = () => {
    toast.info("To be implemented soon :)");
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(!isOpen)}
            className={cn([
              "fixed inset-0 z-20 size-full overflow-hidden bg-primary/40 backdrop-blur-sm md:hidden",
            ])}
          />
        )}
      </AnimatePresence>

      {/* Profile Panel */}
      <AnimatePresence>
        <motion.section
          className={cn(
            "fixed right-0 z-30 h-screen overflow-hidden border-l bg-muted",
            "transition-all duration-500 ease-in-out dark:border-muted-foreground md:relative",
            isOpen
              ? "min-w-[75vw] max-md:translate-x-0 md:w-80 md:min-w-80 xl:min-w-96"
              : "min-w-0 max-md:translate-x-full md:w-0 md:min-w-0",
          )}
        >
          <header className="flex h-16 items-center justify-between gap-4 border-b px-4 dark:border-muted-foreground">
            <h2 className="font-medium">Profile</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="p-0 hover:text-muted lg:text-muted-foreground"
            >
              <PanelRightClose />
            </Button>
          </header>
          {profileContent ? (
            profileContent
          ) : (
            <div className="flex flex-col px-4 py-8 sm:px-8">
              <div className="flex size-52 items-center justify-center self-center overflow-hidden rounded-full bg-gradient-to-br from-primary via-input to-indigo-500 p-1 shadow-lg">
                <img
                  src={userProfile?.image || "/user.png"}
                  alt={profileNameInitials}
                  className="aspect-square size-full rounded-full object-cover"
                />
              </div>
              {/* User Info */}
              <div className="mt-8 space-y-1.5">
                <h3 className="text-sm font-medium text-primary lg:text-base">
                  {profileName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {profileStatus ?? "Disconnected"}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">Last seen</span>
                  <Clock className="size-4" />
                  <span>{profileDate || "6:00 AM - 2:00 PM (GMT)"}</span>
                </div>
              </div>
              {/* User Actions */}
              <div className="mt-8 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 text-xs text-primary dark:border-muted-foreground dark:hover:border-none dark:hover:bg-muted-foreground dark:hover:text-muted"
                >
                  <Phone className="size-4" /> Voice Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 text-xs text-primary dark:border-muted-foreground dark:hover:border-none dark:hover:bg-muted-foreground dark:hover:text-muted"
                >
                  <Video className="size-4" /> Huddle
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-auto size-9 rounded p-0 text-xs text-muted-foreground dark:border-muted-foreground"
                    >
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    alignOffset={0}
                    sideOffset={0}
                    className={cn(
                      "z-[150] space-y-2 rounded-lg pb-4",
                      "data-[side=bottom]:rounded-tr-none data-[side=top]:rounded-br-none",
                    )}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleCloseDM()}
                      className="text-xs font-medium"
                    >
                      Close DM
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleBlockUser}
                      className="bg-destructive text-xs text-destructive-foreground lg:text-sm"
                    >
                      Block user
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </>
  );
}
