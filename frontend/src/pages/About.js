import { Eyebrow, Layout, PlaceholderTag, SolidButton } from "@/components/Layout";
import { ImageReveal, MaskedLine, Reveal } from "@/components/motion";
import { IMG, credits } from "@/data/site";

const approach = [
  ["01", "Arrive early.", "Stay curious."],
  ["02", "Find the", "human moment."],
  ["03", "Leave with", "a story."],
];

const kit = ["Full-frame mirrorless system", "Fast prime lenses", "Gimbal + handheld cinema rig", "Lightroom · Premiere Pro"];

export default function About() {
  return (
    <Layout>
      <section className="px-5 pb-16 pt-36 md:px-10 md:pt-48">
        <Eyebrow className="mb-8">05 — The person behind the frame</Eyebrow>
        <h1 className="font-display uppercase leading-[0.85]">
          <MaskedLine delay={0.1}><span className="block text-[16vw] md:text-[11vw]">I'm</span></MaskedLine>
          <MaskedLine delay={0.25}><span className="text-outline block text-[16vw] md:text-[11vw]">Paddy.</span></MaskedLine>
        </h1>
      </section>

      <section className="grid gap-12 px-5 pb-24 md:grid-cols-12 md:px-10 md:pb-36">
        <div className="relative md:col-span-5">
          <ImageReveal
            src={IMG.aboutPortrait}
            alt="Paddy holding a camera against the light — portrait placeholder"
            className="aspect-[4/5]"
            testid="about-portrait-image"
          />
          <PlaceholderTag label="Portrait placeholder — add your photo" />
        </div>
        <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
          <Reveal>
            <p className="text-xl leading-relaxed text-[#F4F4F5] md:text-2xl">
              A cinematographer and photographer drawn to live music, travel and the stories that happen between the stage and the crowd.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-sm leading-relaxed text-[#A1A1AA]">
              I work with artists, festivals and events to turn live experiences into photographs and films that feel as alive as the night itself.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-sm leading-relaxed text-[#A1A1AA]">
              From the first soundcheck to the final encore, I'm interested in one thing —{" "}
              <span className="text-[#FF5500]">capturing what it felt like to be there.</span>
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12"><SolidButton to="/contact" testid="about-book-button">Start a conversation</SolidButton></div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-24 md:px-10 md:pb-36">
        <Eyebrow className="mb-10">The approach</Eyebrow>
        <div className="border-t border-white/10">
          {approach.map(([n, a, b], i) => (
            <Reveal key={n} y={26}>
              <div className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-white/10 py-8 md:gap-14 md:py-12">
                <span className="text-[11px] tracking-[0.3em] text-[#FF5500]">{n}</span>
                <h2 className="font-display text-[10vw] uppercase leading-[0.9] md:text-[5.5vw]">
                  {a}{" "}<span className="text-outline">{b}</span>
                </h2>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-5 pb-24 md:px-10 md:pb-36">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow className="mb-6">Behind the frame</Eyebrow>
            <Reveal>
              <h2 className="font-display text-5xl uppercase leading-[0.9] md:text-6xl">
                Rigs, haze<br /><span className="text-outline">& long edits.</span>
              </h2>
            </Reveal>
            <p className="mt-8 max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
              Stage access, venue scouting, camera builds and the edit suite — the invisible half of every frame.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:col-span-7">
            <ImageReveal src={IMG.bts[5]} alt="Shooting on a DSLR in the field — placeholder" className="aspect-square" />
            <ImageReveal src={IMG.bts[3]} alt="Crew around technical gear — placeholder" className="aspect-square md:mt-12" delay={0.12} />
          </div>
        </div>
      </section>

      <section className="grid gap-14 px-5 pb-24 md:grid-cols-12 md:px-10 md:pb-36">
        <div className="md:col-span-6">
          <Eyebrow className="mb-6">Selected events</Eyebrow>
          <ul className="border-t border-white/10">
            {credits.slice(0, 6).map((c, i) => (
              <li key={c} data-testid={`about-event-${i}`} className="flex items-baseline justify-between border-b border-white/10 py-4">
                <span className="font-display text-2xl uppercase md:text-4xl">{c}</span>
                <span className="text-[9px] tracking-[0.3em] text-[#A1A1AA]/60">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Eyebrow className="mb-6">The kit — editable</Eyebrow>
          <ul className="border-t border-white/10">
            {kit.map((k) => (
              <li key={k} className="border-b border-white/10 py-4 text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">{k}</li>
            ))}
          </ul>
          <p className="mt-6 text-[9px] uppercase leading-relaxed tracking-[0.25em] text-[#A1A1AA]/50">
            Placeholder kit list — update with your actual setup.
          </p>
        </div>
      </section>
    </Layout>
  );
}
