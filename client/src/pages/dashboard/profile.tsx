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
import { usePreventScroll } from "@/hooks/use_prevent_scroll";

export function ProfilePanel() {
  const { isOpen, setIsOpen, userProfile } = useProfilePanelStore();
  const preventWindowScroll = isOpen && window.innerWidth < 768;
  usePreventScroll(preventWindowScroll);

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
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn([
          "fixed left-0 z-[100] size-full bg-muted-foreground/50 backdrop-blur-sm transition ease-in-out",
          "md:hidden",
          isOpen
            ? "translate-x-0 duration-300"
            : "translate-x-full duration-500",
        ])}
      />

      {/* Profile Panel */}
      <section
        className={cn(
          "fixed right-0 top-0 z-[170] h-screen bg-primary transition-all duration-500 ease-in-out max-sm:w-[calc(100%-10rem)] md:sticky",
          isOpen
            ? "min-w-80 translate-x-0 md:visible md:opacity-100"
            : "translate-x-full overflow-hidden max-sm:min-w-0 md:invisible md:w-0 md:translate-x-0 md:opacity-0",
        )}
      >
        <header className="flex h-16 items-center justify-between gap-4 border-b border-muted-foreground">
          <h2 className="px-4 font-semibold text-muted">Profile</h2>
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
                src={userProfile?.image}
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
