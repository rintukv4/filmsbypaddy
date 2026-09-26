import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Layout, PlaceholderTag } from "@/components/Layout";
import { ImageReveal, MaskedLine, Reveal } from "@/components/motion";
import { IMG } from "@/data/site";

export default function Festivals({ projects }) {
  const events = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => { if (!map.has(p.event)) map.set(p.event, p); });
    return [...map.values()];
  }, [projects]);

  return (
    <Layout>
      <section className="px-5 pb-16 pt-36 md:px-10 md:pt-48">
        <Eyebrow className="mb-8">03 — The archive</Eyebrow>
        <h1 className="font-display uppercase leading-[0.85]">
          <MaskedLine delay={0.1}><span className="block text-[13vw] md:text-[9vw]">Festivals</span></MaskedLine>
          <MaskedLine delay={0.25}><span className="text-outline block text-[13vw] md:text-[9vw]">& live events.</span></MaskedLine>
        </h1>
        <p className="mt-10 max-w-md text-sm leading-relaxed text-[#A1A1AA] md:ml-auto md:text-right">
          A visual archive of college festivals, music festivals, concerts and large-scale live events.
        </p>
      </section>

      <section className="px-5 pb-24 md:px-10 md:pb-36">
        <div className="flex flex-col gap-20 md:gap-32">
          {events.map((p, i) => (
            <Reveal key={p.event} y={50}>
              <Link to={`/work/${p.slug}`} data-testid={`festivals-row-${i}`} className="group block">
                <div className={`grid items-end gap-0 md:grid-cols-12`}>
                  <div className={`relative col-span-1 row-start-1 md:col-span-7 ${i % 2 ? "md:col-start-6" : "md:col-start-1"}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={IMG.festivals[i % IMG.festivals.length]}
                        alt={`${p.event} festival crowd — placeholder`}
                        loading="lazy"
                        className="h-full w-full object-cover saturate-[0.8] transition-[transform,filter] duration-700 group-hover:scale-[1.045] group-hover:saturate-100"
                      />
                      <PlaceholderTag />
                    </div>
                  </div>
                  <div className={`relative z-10 row-start-1 -mt-16 self-end md:mt-0 md:col-span-5 ${
                    i % 2 ? "md:col-start-1 md:row-start-1 md:-mr-20" : "md:col-start-8 md:row-start-1 md:-ml-20"
                  }`}>
                    <div className="bg-[#080808]/70 p-5 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-0">
                      <Eyebrow className="mb-3">{p.city} — {p.year}</Eyebrow>
                      <h2 className="font-display text-5xl uppercase leading-[0.9] transition-colors duration-300 group-hover:text-[#FF5500] md:text-7xl">
                        {p.event}
                      </h2>
                      <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA]">{p.venue} · {p.services}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#FF5500]">
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
        <ImageReveal src={IMG.festivals[2]} alt="Night festival crowd facing a towering stage — placeholder" className="mt-24 aspect-[16/9] md:mt-36 md:aspect-[21/9]" />
      </section>
    </Layout>
  );
}
