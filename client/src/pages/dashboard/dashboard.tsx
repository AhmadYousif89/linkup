import { ProfilePanel } from "./profile";
import { SidePanel } from "./side_panel";
import { MainContent } from "./main_content";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useUser();

  const postUser = async () => {
    if (!user) return;
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    const res = await fetch(`${VITE_SERVER_API}/user/clerk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        fullName: user.fullName,
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      }),
    });
    const { token } = await res.json();
    const storeToken = JSON.stringify(token);
    localStorage.setItem("token", storeToken);
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

  return (
    <main className="flex h-full bg-primary">
      <SidePanel />

      <section className="z-50 flex flex-grow flex-col border-x border-muted-foreground text-black">
        <MainContent />
      </section>

      <ProfilePanel />
    </main>
  );
}
