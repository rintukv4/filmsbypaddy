import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Layout } from "@/components/Layout";
import { ImageReveal, MaskedLine, Reveal } from "@/components/motion";
import { IMG, services } from "@/data/site";

export default function Services() {
  return (
    <Layout>
      <section className="px-5 pb-16 pt-36 md:px-10 md:pt-48">
        <Eyebrow className="mb-8">04 — The offer</Eyebrow>
        <h1 className="font-display uppercase leading-[0.85]">
          <MaskedLine delay={0.1}><span className="block text-[16vw] md:text-[11vw]">What</span></MaskedLine>
          <MaskedLine delay={0.25}><span className="text-outline block text-[16vw] md:text-[11vw]">I do.</span></MaskedLine>
        </h1>
        <p className="mt-10 max-w-md text-sm leading-relaxed text-[#A1A1AA] md:ml-auto md:text-right">
          Visual coverage built for the live music industry — made to be felt, remembered and shared.
        </p>
      </section>

      <section className="px-5 pb-24 md:px-10 md:pb-36">
        <div className="border-t border-white/10">
          {services.map((s) => (
            <Reveal key={s.n} y={30}>
              <div className="group grid gap-6 border-b border-white/10 py-10 transition-colors duration-500 hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:gap-8 md:py-14">
                <span className="text-[11px] tracking-[0.3em] text-[#FF5500] md:col-span-1">{s.n}</span>
                <h2 className="font-display text-4xl uppercase leading-[0.9] transition-colors duration-300 group-hover:text-[#FF5500] md:col-span-5 md:text-6xl">
                  {s.title}
                </h2>
                <div className="md:col-span-4">
                  <p className="text-sm leading-relaxed text-[#A1A1AA]">{s.desc}</p>
                  <p className="mt-4 text-[9px] uppercase leading-relaxed tracking-[0.25em] text-[#A1A1AA]/60">{s.deliverables}</p>
                </div>
                <div className="flex md:col-span-2 md:justify-end">
                  <Link
                    to="/contact"
                    data-testid={`service-${s.n}-cta`}
                    className="group/link inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#F4F4F5] transition-colors hover:text-[#FF5500]"
                  >
                    Book this
                    <ArrowUpRight size={14} className="text-[#FF5500] transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid items-end gap-10 md:mt-36 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow className="mb-5">Related work</Eyebrow>
            <Reveal>
              <h2 className="font-display text-5xl uppercase leading-[0.9] md:text-6xl">
                See it<br /><span className="text-outline">in action.</span>
              </h2>
            </Reveal>
            <div className="mt-8">
              <Link to="/work" data-testid="services-work-link" className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#FF5500]">
                Browse the archive
                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          </div>
          <ImageReveal src={IMG.bts[2]} alt="Film crew at work on a lit soundstage — placeholder" className="aspect-[16/10] md:col-span-7" />
        </div>
      </section>
    </Layout>
  );
}
