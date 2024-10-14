import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import { useProfilePanelStore } from "./lib/store";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Video,
  Phone,
  PanelRightClose,
  EllipsisVertical,
} from "lucide-react";

export function ProfilePanel() {
  const { isOpen, setIsOpen, userProfile } = useProfilePanelStore();

  let profileContent = null;
  if (!userProfile) {
    profileContent = (
      <div className="flex justify-center">
        <p className="mt-16 font-semibold text-muted-foreground">
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

  const profileDate = userProfile?.date
    ? formatDate(userProfile.date) + " - (GMT)"
    : "";

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
              "fixed inset-0 z-20 size-full overflow-hidden bg-muted-foreground/50 backdrop-blur-sm md:hidden",
            ])}
          />
        )}
      </AnimatePresence>

      {/* Profile Panel */}
      <section
        className={cn(
          "fixed right-0 z-30 h-screen overflow-hidden lg:h-[calc(100vh-4rem)]",
          "transition-all duration-500 ease-in-out md:relative md:max-w-xs",
          "border-muted-foreground bg-primary",
          isOpen
            ? "[transform 700ms cubic-bezier(0.34, 1.35, 0.64, 1)] visible min-w-80 max-md:translate-x-0 xl:min-w-96"
            : "invisible min-w-0 max-md:translate-x-full md:max-w-0",
        )}
      >
        <header className="flex h-16 items-center justify-between gap-4 border-b border-muted-foreground px-4">
          <h2 className="font-semibold text-muted">Profile</h2>
          <Button
            size="icon"
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
            <div className="flex size-52 items-center justify-center self-center overflow-hidden rounded-md bg-muted/90 shadow-lg">
              <img
                src={userProfile?.image || "/user.png"}
                alt={profileNameInitials}
                className="aspect-square object-cover p-2"
              />
            </div>
            {/* User Info */}
            <div className="mt-8">
              <p className="text-sm text-muted-foreground">
                {profileNameInitials}
              </p>
              <h3 className="text-sm font-semibold text-muted lg:text-base">
                {profileName}
              </h3>
              <div className="mt-4 flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {profileDate || "6:00 AM - 2:00 PM (GMT)"}
                </span>
              </div>
            </div>
            {/* User Actions */}
            <div className="mt-8 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-2 bg-primary text-xs text-secondary"
              >
                <Phone className="size-4" /> Voice Call
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-2 bg-primary text-xs text-secondary"
              >
                <Video className="size-4" /> Huddle
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="ml-auto size-9 rounded border-muted-foreground bg-primary p-0 text-xs text-muted-foreground hover:border-secondary hover:bg-primary hover:text-secondary"
              >
                <EllipsisVertical />
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}