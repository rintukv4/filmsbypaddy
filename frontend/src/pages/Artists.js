import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Layout } from "@/components/Layout";
import { MaskedLine, Reveal } from "@/components/motion";

export default function Artists({ projects }) {
  const artists = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => {
      if (!map.has(p.artist)) map.set(p.artist, { name: p.artist, project: p, count: 0 });
      map.get(p.artist).count += 1;
    });
    return [...map.values()];
  }, [projects]);

  const [active, setActive] = useState(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 24 });
  const sy = useSpring(my, { stiffness: 180, damping: 24 });

  return (
    <Layout>
      <section
        className="px-5 pb-24 pt-36 md:px-10 md:pt-48"
        onMouseMove={(e) => { mx.set(e.clientX); my.set(e.clientY); }}
      >
        <Eyebrow className="mb-8">02 — The directory</Eyebrow>
        <h1 className="font-display uppercase leading-[0.85]">
          <MaskedLine delay={0.1}><span className="block text-[16vw] md:text-[11vw]">The</span></MaskedLine>
          <MaskedLine delay={0.25}><span className="text-outline block text-[16vw] md:text-[11vw]">Artists.</span></MaskedLine>
        </h1>
        <p className="mt-10 max-w-md text-sm leading-relaxed text-[#A1A1AA]">
          Artists captured through live photography and motion.
        </p>

        <div className="mt-20 border-t border-white/10 md:mt-28">
          {artists.map((a, i) => (
            <Reveal key={a.name} y={24}>
              <Link
                to={`/work/${a.project.slug}`}
                data-testid={`artists-row-${i}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-white/10 py-6 md:grid-cols-[8%_1fr_auto_auto] md:py-9"
                onMouseEnter={() => setActive(a)}
                onMouseLeave={() => setActive(null)}
              >
                <span className="text-[10px] tracking-[0.3em] text-[#FF5500]">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-[9vw] uppercase leading-[0.9] transition-colors duration-300 group-hover:text-[#FF5500] md:text-[4.5vw]">
                  {a.name}
                </h2>
                <span className="hidden text-right text-[10px] uppercase leading-relaxed tracking-[0.25em] text-[#A1A1AA] md:block">
                  {a.count} {a.count === 1 ? "project" : "projects"}<br />{a.project.event}
                </span>
                <ArrowUpRight size={22} className="text-[#A1A1AA] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#FF5500]" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <motion.img
            key={active.name}
            src={active.project.artistImage || active.project.heroImage}
            alt=""
            aria-hidden="true"
            style={{ x: sx, y: sy }}
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[320px] w-[250px] -ml-[125px] -mt-[160px] object-cover md:block"
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}
