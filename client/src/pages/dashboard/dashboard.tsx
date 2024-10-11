import { useEffect } from "react";
import { ProfilePanel } from "./profile";
import { SidePanel } from "./side_panel";
import { MainContent } from "./main_content";
import { useUser } from "@clerk/clerk-react";

const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
export default function Dashboard() {
  const { user } = useUser();

  const postUser = async () => {
    if (!user) return;

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
    localStorage.removeItem("token");
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
    <main className="flex h-[inherit] bg-primary">
      <SidePanel />

      <section className="flex h-[inherit] basis-full flex-col border-x border-muted-foreground">
        <MainContent />
      </section>

      <ProfilePanel />
    </main>
  );
}
