import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import Lenis from "lenis";
import "@/App.css";
import { ScrollTop } from "@/components/Layout";
import { SiteContentContext } from "@/components/content";
import { fallbackProjects } from "@/data/site";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import ProjectDetail from "@/pages/ProjectDetail";
import Artists from "@/pages/Artists";
import Festivals from "@/pages/Festivals";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

function App() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [siteContent, setSiteContent] = useState(null);
  useLenis();

  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API}/portfolio`)
      .then((r) => {
        if (mounted && r.data.projects?.length) setProjects(r.data.projects);
      })
      .catch(() => {});
    axios
      .get(`${API}/site-content`)
      .then((r) => {
        if (mounted) setSiteContent(r.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SiteContentContext.Provider value={siteContent}>
      <BrowserRouter>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<Home projects={projects} />} />
          <Route path="/work" element={<Work projects={projects} />} />
          <Route path="/work/:slug" element={<ProjectDetail projects={projects} />} />
          <Route path="/artists" element={<Artists projects={projects} />} />
          <Route path="/festivals" element={<Festivals projects={projects} />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home projects={projects} />} />
        </Routes>
      </BrowserRouter>
    </SiteContentContext.Provider>
  );
}

export default App;
