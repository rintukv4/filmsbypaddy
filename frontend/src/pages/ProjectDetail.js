import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import { Eyebrow, Layout, PlaceholderTag, SolidButton } from "@/components/Layout";
import { ImageReveal, MaskedLine, Reveal } from "@/components/motion";

function Hero({ p }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const lines = p.title.split(" / ");

  return (
    <section ref={ref} className="relative flex h-[92svh] items-end overflow-hidden" data-testid="project-hero">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <img src={p.heroImage} alt={`${p.artist} live at ${p.event} — placeholder media`} className="h-full w-full scale-110 object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-[#080808]/40" />
      <PlaceholderTag className="hidden md:block top-28 right-10" />
      <div className="relative z-10 w-full px-5 pb-16 md:px-10">
        <MaskedLine delay={0.15}>
          <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#F4F4F5]/80">
            {p.event} · {p.city} · {p.year}
          </span>
        </MaskedLine>
        <h1 className="mt-5 font-display uppercase leading-[0.85]">
          {lines.map((line, i) => (
            <MaskedLine key={line} delay={0.3 + i * 0.15}>
              <span className={`block text-[14vw] md:text-[9.5vw] ${i === 1 ? "text-outline" : ""}`}>{line}</span>
            </MaskedLine>
          ))}
        </h1>
        <MaskedLine delay={0.7}>
          <span className="mt-5 block text-[11px] uppercase tracking-[0.3em] text-[#A1A1AA]">
            {p.artist} — live performance · {p.services}
          </span>
        </MaskedLine>
      </div>
    </section>
  );
}

function GallerySection({ label, title, src, alt, flip = false }) {
  return (
    <section className="px-5 py-16 md:px-10 md:py-24">
      <div className={`grid items-end gap-8 md:grid-cols-12 ${flip ? "" : ""}`}>
        <div className={`md:col-span-4 ${flip ? "md:order-2 md:text-right" : ""}`}>
          <Eyebrow className="mb-4">{label}</Eyebrow>
          <Reveal><h2 className="font-display text-5xl uppercase leading-[0.9] md:text-6xl">{title}</h2></Reveal>
        </div>
        <div className={`md:col-span-8 ${flip ? "md:order-1" : ""}`}>
          <ImageReveal src={src} alt={alt} className="aspect-[16/9]" />
        </div>
      </div>
    </section>
  );
}

export default function ProjectDetail({ projects }) {
  const { slug } = useParams();
  const p = projects.find((x) => x.slug === slug) || projects[0];
  const next = projects[(projects.findIndex((x) => x.slug === p.slug) + 1) % projects.length];

  return (
    <Layout>
      <Hero p={p} />

      <section className="grid gap-14 px-5 py-24 md:grid-cols-12 md:px-10 md:py-36">
        <div className="md:col-span-7">
          <Eyebrow className="mb-6">The night</Eyebrow>
          <Reveal>
            <h2 className="max-w-2xl font-display text-4xl uppercase leading-[0.95] md:text-6xl">{p.description}</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-lg text-sm leading-relaxed text-[#A1A1AA]">
              The galleries below use cinematic placeholder imagery. Replace them with the real project selects — artist frames, crowd energy, stage light and BTS — when they are ready.
            </p>
          </Reveal>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <Eyebrow className="mb-6">Project details</Eyebrow>
          <dl className="border-t border-white/10" data-testid="project-details">
            {[["Event", p.event], ["Artist", p.artist], ["Venue", p.venue], ["Location", p.city], ["Role", "Visual storyteller"], ["Services", p.services]].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-white/10 py-3.5">
                <dt className="text-[9px] uppercase tracking-[0.3em] text-[#A1A1AA]">{k}</dt>
                <dd className="text-right text-[11px] uppercase tracking-[0.15em] text-[#F4F4F5]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ImageReveal src={p.artistImage} alt={`${p.artist} performing — placeholder`} className="aspect-[4/3] md:aspect-[21/9]" />
      <GallerySection label="The artist" title={p.artist} src={p.crowdImage} alt={`Crowd at ${p.event} — placeholder`} />
      <GallerySection label="The crowd" title="Raw energy." src={p.lightImage} alt={`Stage light at ${p.event} — placeholder`} flip />

      <section className="py-16 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 px-5 md:px-10">
          <div>
            <Eyebrow className="mb-4">The motion</Eyebrow>
            <Reveal><h2 className="font-display text-5xl uppercase leading-[0.9] md:text-6xl">In motion.</h2></Reveal>
          </div>
        </div>
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]" data-testid="project-video-frame">
          {p.videoUrl ? (
            <video src={p.videoUrl} poster={p.motionImage} controls playsInline className="h-full w-full object-cover" />
          ) : (
            <>
              <img src={p.motionImage} alt={`${p.event} film poster — placeholder`} loading="lazy" className="h-full w-full object-cover saturate-[0.8]" />
              <div className="absolute inset-0 bg-[#080808]/30" />
              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 backdrop-blur-sm">
                <Play size={20} className="ml-0.5 text-[#F4F4F5]" fill="currentColor" />
              </span>
              <PlaceholderTag label="Aftermovie placeholder — add video URL" />
            </>
          )}
        </div>
      </section>

      <section className="px-5 py-16 md:px-10 md:py-24">
        <Eyebrow className="mb-4">Behind the camera</Eyebrow>
        <Reveal><h2 className="mb-12 font-display text-5xl uppercase leading-[0.9] md:text-6xl">Half the story.</h2></Reveal>
        <div className="grid gap-3 md:grid-cols-12">
          <ImageReveal src={p.btsImages[0]} alt="Behind the scenes — placeholder" className="aspect-[4/5] md:col-span-5" />
          <ImageReveal src={p.btsImages[1]} alt="Camera rig behind the scenes — placeholder" className="aspect-[4/5] md:col-span-6 md:col-start-7 md:mt-24" delay={0.15} />
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-24 text-center md:py-36">
        <Eyebrow className="mb-6">Next frame</Eyebrow>
        <Reveal>
          <h2 className="font-display text-[13vw] uppercase leading-[0.85] md:text-[7vw]">
            Have a show<br /><span className="text-outline">coming up?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            <SolidButton to="/contact" testid="project-book-button">Book FilmsByPaddy</SolidButton>
            {next && next.slug !== p.slug && (
              <Link to={`/work/${next.slug}`} data-testid="next-project-link" className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#A1A1AA] transition-colors hover:text-[#FF5500]">
                Next project — {next.event}
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            )}
          </div>
        </Reveal>
        <Link to="/work" data-testid="back-to-work-link" className="mt-14 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA]/70 transition-colors hover:text-[#F4F4F5]">
          <ArrowLeft size={13} /> All work
        </Link>
      </section>
    </Layout>
  );
}
