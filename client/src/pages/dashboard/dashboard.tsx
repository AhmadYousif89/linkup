import { useEffect } from "react";
import { ProfilePanel } from "./profile";
import { SidePanel } from "./side_panel";
import { MainContent } from "./main_content";
import {
  useUser,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useSocketStore } from "@/lib/store";
import { ClerkUser, postUser } from "@/lib/actions";
import { useCurrentChatStore } from "./stores/chat";

function DashboardContent() {
  const { user } = useUser();
  const { currentChat } = useCurrentChatStore();
  const { initSocket, cleanup, disconnect } = useSocketStore();

  useEffect(() => {
    initSocket();
    const fetchData = async () => {
      try {
        if (user) {
          const data: ClerkUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.emailAddresses[0].emailAddress,
            image: user.imageUrl,
          };
          await postUser(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    return () => {
      cleanup();
      disconnect();
    };
  }, []);

  return (
    <main className="hero-bg flex h-[inherit]">
      <SidePanel />

      <section className="flex h-[inherit] basis-full flex-col">
        {currentChat?.id ? (
          <MainContent />
        ) : (
          <div className="my-auto flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-xl font-semibold text-primary">
              No Active Chats
            </h1>
            <p className="text-sm font-medium text-muted-foreground md:text-lg">
              LinkUp with your friends and start chatting
            </p>
            <div className="mt-8 size-20 rounded-full bg-muted-foreground p-1">
              <img src="/user.png" alt="user placeholder" />
            </div>
          </div>
        )}
      </section>

      <ProfilePanel />
    </main>
  );
}

export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <DashboardContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
