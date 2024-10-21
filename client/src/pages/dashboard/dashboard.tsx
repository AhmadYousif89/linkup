import { useEffect } from "react";
import {
  useUser,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useSocketStore } from "@/lib/store";
import { ClerkUser, postUser } from "@/lib/actions";
import { useCurrentChatStore, useGroupChatStore } from "./stores/chat";
import { ProfilePanel } from "./profile";
import { SidePanel } from "./side_panel";
import { Chat } from "./chat";
import { GroupChat } from "./group_chat";

function DashboardContent() {
  const { user } = useUser();
  const { currentChatUser } = useCurrentChatStore();
  const { currentGroupChat } = useGroupChatStore();
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
  }, [user]);

  let mainContent;
  if (!currentChatUser && !currentGroupChat) {
    mainContent = (
      <div className="my-auto flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-xl font-semibold text-primary">No Active Chats</h1>
        <p className="text-sm font-medium text-muted-foreground md:text-lg">
          LinkUp with your friends and start chatting
        </p>
        <div className="mt-8 size-24 rounded-full bg-muted-foreground p-1">
          <img src="/user.png" alt="user placeholder" />
        </div>
      </div>
    );
  } else if (currentChatUser) {
    mainContent = <Chat />;
  } else if (currentGroupChat) {
    mainContent = <GroupChat />;
  }

  return (
    <main className="flex h-[inherit] bg-input">
      <SidePanel />

      <section className="flex h-[inherit] basis-full flex-col">
        {mainContent}
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
