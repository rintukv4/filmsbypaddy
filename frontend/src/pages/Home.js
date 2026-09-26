import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Maximize, Play, Volume2, VolumeX } from "lucide-react";
import { EditorialMarquee, Eyebrow, Layout, PlaceholderTag, SolidButton, TextLink } from "@/components/Layout";
import { ImageReveal, MaskedLine, ParallaxImage, Reveal, ease } from "@/components/motion";
import { IMG, contact, credits } from "@/data/site";

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[100svh] items-end overflow-hidden" data-testid="home-hero">
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <img src={IMG.hero} alt="Artist silhouetted against warm cinematic stage light" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/25 to-[#080808]/45" />
      <PlaceholderTag label="Hero video / image placeholder — add showreel loop" className="top-24 right-5 md:top-28 md:right-10" />

      <motion.div style={{ opacity: fade }} className="relative z-10 w-full px-5 pb-28 md:px-10 md:pb-24">
        <MaskedLine delay={0.15}>
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#F4F4F5]/80">
            Concert photography · Cinematography · Festival content
          </span>
        </MaskedLine>
        <h1 className="mt-6 font-display uppercase leading-[0.85]">
          <MaskedLine delay={0.3}><span className="block text-[15vw] md:text-[11vw]">Live music.</span></MaskedLine>
          <MaskedLine delay={0.45}><span className="text-outline block text-[15vw] md:text-[11vw]">Raw energy.</span></MaskedLine>
          <MaskedLine delay={0.6}><span className="block text-[15vw] md:text-[11vw]">Cinematic stories.</span></MaskedLine>
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 1 }}
          className="mt-10 flex flex-wrap items-center gap-8"
        >
          <SolidButton to="/work" testid="hero-work-button">Explore the work</SolidButton>
          <TextLink to="/contact" testid="hero-book-link">Book for an event</TextLink>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-5 pb-6 md:px-10"
      >
        <span className="text-[9px] uppercase tracking-[0.35em] text-[#F4F4F5]/60">Based in India · Available worldwide</span>
        <span className="hidden items-center gap-3 text-[9px] uppercase tracking-[0.35em] text-[#F4F4F5]/60 md:flex" data-testid="scroll-indicator">
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-white/20">
            <motion.span
              className="absolute left-0 top-0 h-4 w-px bg-[#FF5500]"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </span>
      </motion.div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="px-5 py-24 md:px-10 md:py-40">
      <Eyebrow className="mb-10">01 — The moment</Eyebrow>
      <Reveal>
        <h2 className="max-w-6xl font-display text-[13vw] uppercase leading-[0.88] md:text-[7.5vw]">
          The moment<br />
          <span className="text-outline">between the stage</span><br />
          and the crowd.
        </h2>
      </Reveal>
      <Reveal delay={0.15} className="mt-12 flex md:justify-end">
        <p className="max-w-md text-base leading-relaxed text-[#A1A1AA] md:text-lg">
          I capture the energy of live music through photography and motion — from the artist's first step onto the stage to the final moment of the night.
        </p>
      </Reveal>
    </section>
  );
}

function SelectedWork({ projects }) {
  const featured = projects.filter((p) => p.featured);
  return (
    <section className="px-5 py-24 md:px-10 md:py-36" data-testid="selected-work-section">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-24">
        <div>
          <Eyebrow className="mb-6">02 — The archive</Eyebrow>
          <Reveal><h2 className="font-display text-[14vw] uppercase leading-[0.85] md:text-[8vw]">Selected work</h2></Reveal>
        </div>
        <TextLink to="/work" testid="selected-work-link">View all work</TextLink>
      </div>
      <p className="mb-20 max-w-md text-sm leading-relaxed text-[#A1A1AA]">
        A collection of concerts, festivals and live experiences captured through stills and motion.
      </p>
      <div className="flex flex-col gap-24 md:gap-40">
        {featured.map((p, i) => (
          <Reveal key={p.slug} y={60}>
            <Link to={`/work/${p.slug}`} data-testid={`project-card-${p.slug}`} className="group block">
              <div className="grid grid-cols-12 items-end gap-y-0">
                <div className={`relative col-span-12 row-start-1 ${i % 2 ? "md:col-start-5 md:col-span-8" : "md:col-start-1 md:col-span-8"}`}>
                  <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/10]">
                    <img
                      src={p.heroImage}
                      alt={`${p.artist} live at ${p.event} — placeholder media`}
                      loading="lazy"
                      className="h-full w-full object-cover saturate-[0.8] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.045] group-hover:saturate-100"
                    />
                    <div className="absolute inset-0 bg-[#080808]/10 transition-opacity duration-500 group-hover:opacity-0" />
                  </div>
                </div>
                <div className={`relative z-10 col-span-11 row-start-1 self-end ${i % 2 ? "md:col-start-1 md:col-span-5 md:-mr-24" : "col-start-2 md:col-start-8 md:col-span-5 md:-ml-24"} -mt-20 md:mt-0`}>
                  <div className="bg-[#080808]/70 p-6 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-0">
                    <Eyebrow className="mb-4">{String(i + 1).padStart(2, "0")} — {p.year}</Eyebrow>
                    <h3 className="font-display text-5xl uppercase leading-[0.9] transition-colors duration-300 group-hover:text-[#FF5500] md:text-7xl">
                      {p.title.split(" / ").map((line) => <span key={line} className="block">{line}</span>)}
                    </h3>
                    <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">{p.artist}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]/70">{p.services}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#FF5500]">
                      View project
                      <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Showreel() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const frameRef = useRef(null);

  const toggleFullscreen = () => {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  return (
    <section className="py-24 md:py-36">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-8 px-5 md:px-10">
        <div>
          <Eyebrow className="mb-6">03 — The showreel</Eyebrow>
          <Reveal>
            <h2 className="font-display text-[13vw] uppercase leading-[0.85] md:text-[7vw]">
              Live music<br /><span className="text-outline">through my lens.</span>
            </h2>
          </Reveal>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-[#A1A1AA]">
            From soundcheck to encore, every frame is about capturing what it felt like to be there.
          </p>
        </div>
        <TextLink to="/work" testid="showreel-full-link">Watch the full reel</TextLink>
      </div>

      <div ref={frameRef} className="relative aspect-[4/5] w-full overflow-hidden bg-[#080808] sm:aspect-[16/9] md:aspect-[21/9]" data-testid="showreel-player">
        <img
          src={IMG.showreelPoster}
          alt="Showreel poster — lasers over a dense concert crowd"
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-700 ${playing ? "scale-105 saturate-100" : "saturate-[0.75]"}`}
        />
        <div className="absolute inset-0 bg-[#080808]/35" />
        <PlaceholderTag label={playing ? "Reel playback placeholder — add video file" : "Showreel poster — add video file"} />

        <button
          onClick={() => setPlaying(!playing)}
          data-testid="showreel-play-button"
          aria-label={playing ? "Pause showreel" : "Play showreel"}
          className="group absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 backdrop-blur-sm transition-colors duration-300 hover:border-[#FF5500] md:h-24 md:w-24"
        >
          {playing
            ? <span className="h-6 w-6 border-x-4 border-[#F4F4F5] transition-colors group-hover:border-[#FF5500]" />
            : <Play size={26} className="ml-1 text-[#F4F4F5] transition-colors group-hover:text-[#FF5500]" fill="currentColor" />}
        </button>

        <div className="absolute bottom-5 left-5 flex items-center gap-4 md:bottom-8 md:left-10">
          <button onClick={() => setMuted(!muted)} data-testid="showreel-mute-button" aria-label="Toggle mute" className="text-white/70 transition-colors hover:text-[#FF5500]">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">{playing ? "00:17" : "00:00"} — 01:42</span>
        </div>
        <button onClick={toggleFullscreen} data-testid="showreel-fullscreen-button" aria-label="Fullscreen" className="absolute bottom-5 right-5 text-white/70 transition-colors hover:text-[#FF5500] md:bottom-8 md:right-10">
          <Maximize size={18} />
        </button>
      </div>
    </section>
  );
}

function Credits() {
  return (
    <section className="px-5 py-24 md:px-10 md:py-36">
      <Eyebrow className="mb-6">04 — Selected live credits</Eyebrow>
      <Reveal><h2 className="mb-16 font-display text-[13vw] uppercase leading-[0.85] md:text-[7vw]">In the room.</h2></Reveal>
      <div className="border-t border-white/10">
        {credits.map((c, i) => (
          <Reveal key={c} y={20} delay={i * 0.03}>
            <div data-testid={`credit-${i}`} className="group flex items-baseline justify-between border-b border-white/10 py-4 md:py-6">
              <span className="font-display text-3xl uppercase leading-none transition-colors duration-300 group-hover:text-[#FF5500] md:text-6xl">{c}</span>
              <span className="text-[10px] tracking-[0.3em] text-[#A1A1AA]/60">{String(i + 1).padStart(2, "0")}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 max-w-md text-[10px] uppercase leading-relaxed tracking-[0.25em] text-[#A1A1AA]/60">
        Selected projects and live credits — listed as coverage work, not endorsements.
      </p>
    </section>
  );
}

function BehindTheFrame() {
  return (
    <section className="px-5 py-24 md:px-10 md:py-36" data-testid="bts-section">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <Eyebrow className="mb-6">05 — Behind the frame</Eyebrow>
          <Reveal>
            <h2 className="font-display text-[13vw] uppercase leading-[0.88] md:text-[5.5vw]">
              The final frame<br />
              <span className="text-outline">is only half</span><br />
              the story.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-10 max-w-sm text-sm leading-relaxed text-[#A1A1AA]">
              Rigs, gimbals, stage access, soundchecks and long edits — the work behind the work.
            </p>
            <div className="mt-10"><TextLink to="/about" testid="bts-link">See more BTS</TextLink></div>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-7">
          <ImageReveal src={IMG.bts[1]} alt="Camera operator silhouetted in stage light — placeholder" className="col-span-2 aspect-[16/9]" />
          <ImageReveal src={IMG.bts[4]} alt="Hands on a cinema camera — placeholder" className="aspect-square md:mt-10" delay={0.1} />
          <ImageReveal src={IMG.bts[0]} alt="Cinema camera rig on a dark set — placeholder" className="aspect-square" delay={0.2} />
        </div>
      </div>
    </section>
  );
}

function InstagramSection() {
  return (
    <section className="py-24 md:py-36">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 px-5 md:px-10">
        <div>
          <Eyebrow className="mb-6">06 — Follow the journey</Eyebrow>
          <Reveal><h2 className="font-display text-[13vw] uppercase leading-[0.85] md:text-[7vw]">@FilmsByPaddy</h2></Reveal>
        </div>
        <TextLink to={contact.instagram} external testid="home-instagram-link">Follow on Instagram</TextLink>
      </div>
      <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
        {IMG.instagram.map((src, i) => (
          <a
            key={src}
            href={contact.instagram}
            target="_blank"
            rel="noreferrer"
            className="group relative block aspect-square overflow-hidden"
            aria-label={`Instagram post ${i + 1} — placeholder`}
          >
            <img
              src={src}
              alt={`Concert moment ${i + 1} — placeholder`}
              loading="lazy"
              data-testid={`instagram-grid-image-${i}`}
              className="h-full w-full object-cover saturate-[0.75] transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:saturate-100"
            />
            <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[#FF5500] transition-transform duration-500 group-hover:scale-x-100" />
          </a>
        ))}
      </div>
    </section>
  );
}

export default function Home({ projects }) {
  return (
    <Layout>
      <Hero />
      <Manifesto />
      <ParallaxImage src={IMG.texture} alt="Spotlight beam cutting through stage haze" className="h-[55vh] md:h-[80vh]" />
      <SelectedWork projects={projects} />
      <EditorialMarquee />
      <Showreel />
      <Credits />
      <BehindTheFrame />
      <InstagramSection />
    </Layout>
  );
}
