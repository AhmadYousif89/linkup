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
import { useCurrentChatStore } from "./stores/chat";
import { SocketEvent, socket, useSocketStore } from "../../lib/store";

const SERVER_API_URL = import.meta.env.VITE_SERVER_API;
export type ClerkUser = {
  id: string;
  fullName: string;
  emailAddresses: { emailAddress: string }[];
  imageUrl: string;
};

function DashboardContent() {
  const { user } = useUser();
  const { currentChat } = useCurrentChatStore();

  const { setIsConnected } = useSocketStore();

  useEffect(() => {
    socket.connect();

    function handleSocketError(error: Error) {
      console.error("Socket error:", error);
    }
    socket.on(SocketEvent.Connect.Error, handleSocketError);

    function handleSocketConnect() {
      console.log("Socket connected");
      setIsConnected(true);
    }
    socket.on(SocketEvent.Connect.Init, handleSocketConnect);

    function handleSocketDisconnect() {
      console.log("Socket disconnected");
      setIsConnected(false);
    }
    socket.on(SocketEvent.Disconnect, handleSocketDisconnect);

    return () => {
      socket.off(SocketEvent.Connect.Error, handleSocketError);
      socket.off(SocketEvent.Connect.Init, handleSocketConnect);
      socket.off(SocketEvent.Disconnect, handleSocketDisconnect);
      socket.disconnect();
    };
  }, []);

  const postUser = async () => {
    if (!user) return;

    const res = await fetch(`${SERVER_API_URL}/user/clerk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        fullName: user.fullName ?? "NA",
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      }),
    });
    const data = await res.json();
    const storeToken = JSON.stringify(data.token);
    localStorage.removeItem("token");
    localStorage.setItem("token", storeToken);
    localStorage.setItem("userId", data.id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await postUser();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  // console.log("currentChatUser", currentChat);

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
