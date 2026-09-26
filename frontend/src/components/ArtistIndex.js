import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { Reveal } from "@/components/motion";

export default function ArtistIndex({ artists, testidPrefix = "artists-row" }) {
  const [active, setActive] = useState(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 24 });
  const sy = useSpring(my, { stiffness: 180, damping: 24 });

  return (
    <div onMouseMove={(e) => { mx.set(e.clientX); my.set(e.clientY); }}>
      <div className="border-t border-white/10">
        {artists.map((a, i) => (
          <Reveal key={a.name} y={26}>
            <Link
              to={`/work/${a.project.slug}`}
              data-testid={`${testidPrefix}-${i}`}
              className="group flex items-baseline justify-between gap-5 border-b border-white/10 py-3 md:py-5"
              onMouseEnter={() => setActive(a)}
              onMouseLeave={() => setActive(null)}
            >
              <span className="min-w-0 font-display text-[11.5vw] uppercase leading-[0.95] text-[#F4F4F5] transition-colors duration-300 group-hover:text-[#FF5500] md:text-[6.8vw]">
                {a.name}
              </span>
              <span className="shrink-0 text-right text-[9px] uppercase leading-relaxed tracking-[0.3em] text-[#A1A1AA]/60">
                {a.project.event}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>

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
            className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[340px] w-[260px] -ml-[130px] -mt-[170px] object-cover md:block"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
