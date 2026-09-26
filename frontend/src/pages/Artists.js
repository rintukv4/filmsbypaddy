import { useMemo } from "react";
import { Eyebrow, Layout } from "@/components/Layout";
import { MaskedLine } from "@/components/motion";
import ArtistIndex from "@/components/ArtistIndex";

export default function Artists({ projects }) {
  const artists = useMemo(() => {
    const map = new Map();
    projects.forEach((p) => {
      if (!map.has(p.artist)) map.set(p.artist, { name: p.artist, project: p, count: 0 });
      map.get(p.artist).count += 1;
    });
    return [...map.values()];
  }, [projects]);

  return (
    <Layout>
      <section className="px-5 pb-24 pt-36 md:px-10 md:pt-48">
        <Eyebrow className="mb-8">02 — The directory</Eyebrow>
        <h1 className="font-display uppercase leading-[0.85]">
          <MaskedLine delay={0.1}><span className="block text-[16vw] md:text-[11vw]">The</span></MaskedLine>
          <MaskedLine delay={0.25}><span className="text-outline block text-[16vw] md:text-[11vw]">Artists.</span></MaskedLine>
        </h1>
        <p className="mt-10 max-w-md text-sm leading-relaxed text-[#A1A1AA]">
          Artists captured through live photography and motion.
        </p>
        <div className="mt-16 md:mt-24">
          <ArtistIndex artists={artists} testidPrefix="artists-row" />
        </div>
      </section>
    </Layout>
  );
}
