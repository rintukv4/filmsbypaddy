import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Layout } from "@/components/Layout";
import { MaskedLine, Reveal } from "@/components/motion";

const FILTERS = ["ALL", "PHOTOGRAPHY", "CINEMATOGRAPHY", "FESTIVAL"];

export default function Work({ projects }) {
  const [filter, setFilter] = useState("ALL");
  const shown = filter === "ALL"
    ? projects
    : projects.filter((p) => p.services.toUpperCase().includes(filter) || p.event.toUpperCase().includes(filter));

  return (
    <Layout>
      <section className="px-5 pb-16 pt-36 md:px-10 md:pt-48">
        <Eyebrow className="mb-8">01 — The archive</Eyebrow>
        <h1 className="font-display uppercase leading-[0.85]">
          <MaskedLine delay={0.1}><span className="block text-[16vw] md:text-[11vw]">The</span></MaskedLine>
          <MaskedLine delay={0.25}><span className="text-outline block text-[16vw] md:text-[11vw]">Work.</span></MaskedLine>
        </h1>
        <p className="mt-10 max-w-md text-sm leading-relaxed text-[#A1A1AA] md:ml-auto md:text-right">
          Concerts, festivals and live experiences — stills and motion from the edge of the stage.
        </p>
      </section>

      <div className="sticky top-[57px] z-30 flex gap-7 overflow-x-auto border-y border-white/10 bg-[#080808]/90 px-5 py-4 backdrop-blur-xl md:top-[61px] md:px-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            data-testid={`work-filter-${f.toLowerCase()}`}
            className={`whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.3em] transition-colors duration-300 ${
              filter === f ? "text-[#FF5500]" : "text-[#A1A1AA] hover:text-[#F4F4F5]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <section className="px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-col gap-24 md:gap-40">
          {shown.map((p, i) => (
            <Reveal key={p.slug} y={60}>
              <Link to={`/work/${p.slug}`} data-testid={`project-card-${p.slug}`} className="group block">
                <div className="grid grid-cols-12 items-end">
                  <div className={`relative col-span-12 row-start-1 ${
                    i % 3 === 0 ? "md:col-span-9 md:col-start-1" : i % 3 === 1 ? "md:col-span-7 md:col-start-6" : "md:col-span-10 md:col-start-2"
                  }`}>
                    <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/10]">
                      <img
                        src={p.heroImage}
                        alt={`${p.artist} at ${p.event} — placeholder media`}
                        loading="lazy"
                        className="h-full w-full object-cover saturate-[0.8] transition-[transform,filter] duration-700 group-hover:scale-[1.045] group-hover:saturate-100"
                      />
                    </div>
                  </div>
                  <div className={`relative z-10 col-span-11 row-start-1 -mt-16 self-end md:mt-0 ${
                    i % 3 === 1 ? "col-start-1 md:col-span-5 md:col-start-1 md:-mr-20" : "col-start-2 md:col-span-4 md:col-start-9 md:-ml-20"
                  }`}>
                    <div className="bg-[#080808]/70 p-5 backdrop-blur-sm md:bg-transparent md:p-0 md:backdrop-blur-0">
                      <Eyebrow className="mb-3">{String(i + 1).padStart(2, "0")} — {p.event} · {p.city}</Eyebrow>
                      <h2 className="font-display text-4xl uppercase leading-[0.9] transition-colors duration-300 group-hover:text-[#FF5500] md:text-6xl">
                        {p.title.split(" / ").map((line) => <span key={line} className="block">{line}</span>)}
                      </h2>
                      <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA]">{p.artist} · {p.services}</p>
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
        {shown.length === 0 && (
          <p className="py-24 text-center text-[11px] uppercase tracking-[0.3em] text-[#A1A1AA]" data-testid="work-empty-state">
            No projects in this category yet.
          </p>
        )}
      </section>
    </Layout>
  );
}
