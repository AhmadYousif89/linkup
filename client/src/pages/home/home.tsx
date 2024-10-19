import { MainHeader } from "./header";
import { HeroSection } from "./hero";
import { Decoration } from "@/assets/decoration";

export default function Home() {
  return (
    <main className="flex flex-col">
      <MainHeader />
      <HeroSection />
      <div className="my-16 self-center">
        <Decoration />
      </div>
      <section className="mb-16 w-full self-center">
        <h2 className="text-center text-3xl font-bold leading-5">Powred By</h2>
        <p className="mt-4 text-center text-lg">
          Latest technologies and tools
        </p>
        <div className="relative w-full overflow-hidden bg-[#2b2b2b26]">
          <div className="relative grid auto-cols-[96px] grid-flow-col justify-start gap-6 whitespace-nowrap [--offset:12px] [transform:translate3d(var(--offset),0,0)] odd:*:translate-x-[var(--offset)]"></div>
        </div>
      </section>
    </main>
  );
}
