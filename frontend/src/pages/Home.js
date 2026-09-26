import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Maximize, Play, Volume2, VolumeX } from "lucide-react";
import { EditorialMarquee, Eyebrow, Layout, PlaceholderTag, TextLink } from "@/components/Layout";
import { ImageReveal, MaskedLine, ParallaxImage, Reveal, ease } from "@/components/motion";
import ArtistIndex from "@/components/ArtistIndex";
import { IMG, VIDEO, contact, credits } from "@/data/site";

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[100svh] items-end overflow-hidden" data-testid="home-hero">
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <video
          src={VIDEO.hero}
          poster={IMG.hero}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          data-testid="hero-video"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/50" />
      <PlaceholderTag label="Stock placeholder footage — replace /public/media/hero-loop.mp4 with your reel" className="hidden md:block top-28 right-10" />

      <motion.div style={{ opacity: fade }} className="relative z-10 w-full px-5 pb-24 md:px-10 md:pb-16">
        <h1 className="font-display uppercase leading-[0.82]">
          <MaskedLine delay={0.25}><span className="block text-[17vw] md:text-[12.5vw]">Live music.</span></MaskedLine>
          <MaskedLine delay={0.42}><span className="text-outline block text-[17vw] md:text-[12.5vw]">Raw energy.</span></MaskedLine>
          <MaskedLine delay={0.59}><span className="block text-[17vw] md:text-[12.5vw]">Cinematic stories.</span></MaskedLine>
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-10 flex items-end justify-between gap-6"
        >
          <div>
            <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.4em] text-[#F4F4F5]/70">
              Concert photography · Cinematography · Festival content
            </p>
            <TextLink to="/work" testid="hero-work-button">Explore the work</TextLink>
            <span className="mx-5 text-[#A1A1AA]/40">/</span>
            <TextLink to="/contact" testid="hero-book-link">Book for an event</TextLink>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-5 pb-5 md:px-10"
      >
        <span className="text-[9px] uppercase tracking-[0.35em] text-[#F4F4F5]/55">Based in India · Available worldwide</span>
        <span className="hidden items-center gap-3 text-[9px] uppercase tracking-[0.35em] text-[#F4F4F5]/55 md:flex" data-testid="scroll-indicator">
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
    <section className="px-5 py-28 md:px-10 md:py-44">
      <Eyebrow className="mb-10">01 — The moment</Eyebrow>
      <Reveal>
        <h2 className="max-w-7xl font-display text-[12.5vw] uppercase leading-[0.86] md:text-[7.2vw]">
          The moment <span className="text-outline">between the stage</span> and the crowd.
        </h2>
      </Reveal>
      <Reveal delay={0.15} className="mt-14 flex md:justify-end">
        <p className="max-w-md text-base leading-relaxed text-[#A1A1AA]">
          I capture the energy of live music through photography and motion — from the artist's first step onto the stage to the final moment of the night.
        </p>
      </Reveal>
    </section>
  );
}

const WORK_LAYOUTS = [
  { wrap: "", img: "md:col-start-1 md:col-span-8 aspect-[16/10]", txt: "md:col-start-8 md:col-span-5 md:-ml-32 self-end" },
  { wrap: "md:-mt-40", img: "md:col-start-8 md:col-span-5 aspect-[3/4]", txt: "md:col-start-1 md:col-span-6 md:-mr-28 self-center md:text-right md:justify-self-end" },
  { wrap: "md:-mt-24", img: "md:col-start-2 md:col-span-7 aspect-[4/3]", txt: "md:col-start-9 md:col-span-4 md:-ml-24 self-end" },
];

function SelectedWork({ projects }) {
  const featured = projects.filter((p) => p.featured);
  return (
    <section className="py-28 md:py-40" data-testid="selected-work-section">
      <div className="mb-20 flex flex-wrap items-end justify-between gap-6 px-5 md:mb-32 md:px-10">
        <Reveal><h2 className="font-display text-[15vw] uppercase leading-[0.82] md:text-[9vw]">Selected<br /><span className="text-outline">work</span></h2></Reveal>
        <TextLink to="/work" testid="selected-work-link">View all work</TextLink>
      </div>

      <div className="flex flex-col gap-28 px-5 md:gap-0 md:px-0">
        {featured.map((p, i) => {
          const L = WORK_LAYOUTS[i % WORK_LAYOUTS.length];
          return (
            <Reveal key={p.slug} y={70} className={L.wrap}>
              <Link to={`/work/${p.slug}`} data-testid={`project-card-${p.slug}`} className="group block md:px-10">
                <div className="relative grid grid-cols-12 md:items-end">
                  <span aria-hidden="true" className="text-outline-thin pointer-events-none absolute -top-14 left-0 z-0 hidden font-display text-[11rem] leading-none md:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={`relative z-10 col-span-12 row-start-1 ${L.img}`}>
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src={p.heroImage}
                        alt={`${p.artist} live at ${p.event} — placeholder media`}
                        loading="lazy"
                        className="h-full w-full object-cover saturate-[0.8] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.05] group-hover:saturate-100"
                      />
                      <div className="absolute inset-0 bg-[#080808]/10 transition-opacity duration-500 group-hover:opacity-0" />
                    </div>
                  </div>
                  <div className={`relative z-20 col-span-11 row-start-1 -mt-20 self-end md:mt-0 ${L.txt} ${i % 3 === 1 ? "col-start-1" : "col-start-2"}`}>
                    <div className="bg-[#080808]/60 p-5 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-0">
                      <Eyebrow className="mb-3">{p.event} — {p.city} — {p.year}</Eyebrow>
                      <h3 className="font-display text-6xl uppercase leading-[0.88] transition-colors duration-300 group-hover:text-[#FF5500] md:text-8xl">
                        {p.title.split(" / ").map((line) => <span key={line} className="block">{line}</span>)}
                      </h3>
                      <p className="mt-4 text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA]">{p.artist}</p>
                      <span className={`mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#FF5500] ${i % 3 === 1 ? "md:flex-row-reverse" : ""}`}>
                        View project
                        <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function ArtistsSection({ projects }) {
  const artists = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => { if (!map.has(p.artist)) map.set(p.artist, { name: p.artist, project: p }); });
    return [...map.values()];
  }, [projects]);

  return (
    <section className="px-5 py-28 md:px-10 md:py-40" data-testid="home-artists-section">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
        <Reveal><h2 className="font-display text-[15vw] uppercase leading-[0.82] md:text-[9vw]">The<br /><span className="text-outline">artists</span></h2></Reveal>
        <TextLink to="/artists" testid="home-artists-link">Full directory</TextLink>
      </div>
      <ArtistIndex artists={artists} testidPrefix="home-artists-row" />
    </section>
  );
}

function Showreel() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const frameRef = useRef(null);
  const videoRef = useRef(null);

  const fmt = (s) => {
    if (!isFinite(s)) return "00:00";
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  };

  const toggleFullscreen = () => {
    const el = frameRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  return (
    <section className="py-10 md:py-16">
      <div ref={frameRef} className="relative h-[92svh] w-full overflow-hidden bg-[#080808]" data-testid="showreel-player">
        <video
          ref={videoRef}
          src={VIDEO.showreel}
          poster={IMG.showreelPoster}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onVolumeChange={(e) => setMuted(e.target.muted)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onClick={togglePlay}
          className="h-full w-full cursor-pointer object-cover"
          data-testid="showreel-video"
        />
        <div className={`pointer-events-none absolute inset-0 bg-[#080808]/40 transition-opacity duration-700 ${playing ? "opacity-0" : "opacity-100"}`} />

        <div className={`pointer-events-none absolute left-5 top-16 transition-opacity duration-700 md:left-10 md:top-24 ${playing ? "opacity-0" : "opacity-100"}`}>
          <Eyebrow className="mb-5 !text-[#F4F4F5]/70">03 — The showreel</Eyebrow>
          <Reveal>
            <h2 className="font-display text-[14vw] uppercase leading-[0.84] md:text-[8.5vw]">
              Live music<br /><span className="text-outline">through my lens.</span>
            </h2>
          </Reveal>
        </div>

        {!playing && (
          <button
            onClick={togglePlay}
            data-testid="showreel-play-button"
            aria-label="Play showreel"
            className="group absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/25 backdrop-blur-sm transition-colors duration-300 hover:border-[#FF5500] md:h-32 md:w-32"
          >
            <Play size={34} className="ml-1.5 text-[#F4F4F5] transition-colors group-hover:text-[#FF5500]" fill="currentColor" />
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 px-5 pb-6 md:px-10 md:pb-8">
          <div className="flex items-end justify-between pb-4">
            <p className={`max-w-xs text-[10px] uppercase leading-relaxed tracking-[0.3em] text-[#F4F4F5]/70 transition-opacity duration-700 ${playing ? "opacity-0" : "opacity-100"}`}>
              From soundcheck to encore — what it felt like to be there
            </p>
            <div className="flex items-center gap-5">
              <span className="hidden text-[10px] uppercase tracking-[0.3em] text-white/70 sm:block" data-testid="showreel-timecode">
                {fmt(time)} — {fmt(duration)}
              </span>
              <button onClick={toggleMute} data-testid="showreel-mute-button" aria-label="Toggle mute" className="text-white/70 transition-colors hover:text-[#FF5500]">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button onClick={toggleFullscreen} data-testid="showreel-fullscreen-button" aria-label="Fullscreen" className="text-white/70 transition-colors hover:text-[#FF5500]">
                <Maximize size={18} />
              </button>
            </div>
          </div>
          <div
            className="group/bar relative h-[3px] w-full cursor-pointer bg-white/15"
            onClick={seek}
            data-testid="showreel-progress-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(duration ? (time / duration) * 100 : 0)}
          >
            <div className="absolute inset-y-0 left-0 bg-[#FF5500]" style={{ width: `${duration ? (time / duration) * 100 : 0}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Credits() {
  return (
    <section className="px-5 py-28 md:px-10 md:py-40">
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
    <section className="px-5 py-28 md:px-10 md:py-40" data-testid="bts-section">
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <Eyebrow className="mb-6">05 — Behind the frame</Eyebrow>
          <Reveal>
            <h2 className="font-display text-[12vw] uppercase leading-[0.88] md:text-[5.5vw]">
              The final frame<br />
              <span className="text-outline">is only half</span><br />
              the story.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
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
    <section className="py-28 md:py-40">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6 px-5 md:px-10">
        <Reveal><h2 className="font-display text-[13vw] uppercase leading-[0.85] md:text-[7vw]">@FilmsByPaddy</h2></Reveal>
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
      <SelectedWork projects={projects} />
      <EditorialMarquee />
      <ArtistsSection projects={projects} />
      <Showreel />
      <Credits />
      <ParallaxImage src={IMG.texture} alt="Spotlight beam cutting through stage haze" className="h-[50vh] md:h-[75vh]" />
      <BehindTheFrame />
      <InstagramSection />
    </Layout>
  );
}
