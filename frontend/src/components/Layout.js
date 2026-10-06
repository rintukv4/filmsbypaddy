import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowUpRight, Asterisk, Instagram, Mail, Menu, MessageCircle, X } from "lucide-react";
import { contact } from "@/data/site";
import { ease } from "@/components/motion";

export function LogoMark({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="7" y="7" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="5" />
      <path d="M26 21 L45 32 L26 43 Z" fill="#FF5500" />
    </svg>
  );
}

export const Grain = () => <div className="grain" aria-hidden="true" />;

export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`text-[10px] font-medium uppercase tracking-[0.35em] text-[#A1A1AA] ${className}`}>
      {children}
    </p>
  );
}

export function TextLink({ to, children, testid, className = "", external = false }) {
  const inner = (
    <>
      <span className="border-b border-[#FF5500]/60 pb-1 transition-colors duration-300 group-hover:border-[#FF5500]">
        {children}
      </span>
      <ArrowUpRight size={14} className="text-[#FF5500] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </>
  );
  const cls = `group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em] text-[#F4F4F5] transition-colors duration-300 hover:text-[#FF5500] ${className}`;
  if (external) {
    return <a href={to} target="_blank" rel="noreferrer" data-testid={testid} className={cls}>{inner}</a>;
  }
  return <Link to={to} data-testid={testid} className={cls}>{inner}</Link>;
}

export function SolidButton({ to, children, testid, type, disabled }) {
  const cls = "group inline-flex items-center gap-4 bg-[#F4F4F5] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#080808] transition-colors duration-300 hover:bg-[#FF5500] hover:text-[#080808] disabled:opacity-50";
  const arrow = <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />;
  if (type === "submit" || !to) {
    return <button type={type || "button"} disabled={disabled} data-testid={testid} className={cls}>{children}{arrow}</button>;
  }
  return <Link to={to} data-testid={testid} className={cls}>{children}{arrow}</Link>;
}

const NAV_LINKS = [
  ["WORK", "/work", "nav-work-link"],
  ["ARTISTS", "/artists", "nav-artists-link"],
  ["FESTIVALS", "/festivals", "nav-festivals-link"],
  ["SERVICES", "/services", "nav-services-link"],
  ["ABOUT", "/about", "nav-about-link"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { pathname } = useLocation();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 60));
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        data-testid="site-header"
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 transition-all duration-500 md:px-10 ${
          scrolled ? "border-b border-white/10 bg-[#080808]/85 py-3 backdrop-blur-xl" : "bg-transparent py-6"
        }`}
      >
        <Link to="/" data-testid="brand-home-link" className="flex items-center gap-3" aria-label="FilmsByPaddy home">
          <LogoMark className={`transition-all duration-500 ${scrolled ? "h-5 w-5" : "h-7 w-7"}`} />
          <span className={`font-display uppercase leading-none tracking-[0.08em] transition-all duration-500 ${scrolled ? "text-lg" : "text-2xl"}`}>
            Films<span className="text-[#FF5500]">by</span>Paddy
          </span>
        </Link>
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(([label, to, id]) => (
            <Link
              key={label}
              to={to}
              data-testid={id}
              className={`text-[10px] font-medium uppercase tracking-[0.3em] transition-colors duration-300 hover:text-[#FF5500] ${
                pathname === to ? "text-[#FF5500]" : "text-[#F4F4F5]"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            data-testid="nav-book-link"
            className="group ml-4 flex items-center gap-2 border border-[#FF5500] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FF5500] transition-colors duration-300 hover:bg-[#FF5500] hover:text-[#080808]"
          >
            Book for an event
            <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </nav>
        <button
          className="text-[#F4F4F5] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-testid="mobile-menu-button"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-[#080808] px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            data-testid="mobile-menu"
          >
            <div className="flex flex-col gap-2">
              {[...NAV_LINKS, ["CONTACT / BOOK", "/contact", "nav-contact-link"]].map(([label, to, id], i) => (
                <div key={label} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.6, ease, delay: 0.05 * i }}
                  >
                    <Link
                      to={to}
                      data-testid={`mobile-${id}`}
                      className={`font-display text-6xl uppercase leading-[1.05] sm:text-7xl ${
                        label.includes("CONTACT") ? "text-[#FF5500]" : "text-[#F4F4F5]"
                      }`}
                    >
                      {label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-[10px] uppercase tracking-[0.35em] text-[#A1A1AA]"
            >
              Based in India · Available worldwide
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function EditorialMarquee() {
  const items = ["LIVE MUSIC", "RAW ENERGY", "CINEMATIC STORIES", "CONCERT PHOTOGRAPHY", "FESTIVAL CONTENT", "AFTERMOVIES"];
  return (
    <div className="marquee-fade overflow-hidden border-y border-white/10 py-5 md:py-7" data-testid="editorial-marquee">
      <Marquee speed={32} gradient={false} pauseOnHover>
        {items.map((item, i) => (
          <span key={item} className="mx-6 flex items-center gap-12 md:mx-10">
            <span className={`whitespace-nowrap font-display text-5xl uppercase leading-none md:text-7xl ${i % 2 ? "text-outline-thin" : "text-[#F4F4F5]"}`}>
              {item}
            </span>
            <Asterisk size={30} className="shrink-0 text-[#FF5500]" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080808]" data-testid="site-footer">
      <div className="px-5 py-16 md:px-10 md:py-24">
        <Link to="/contact" data-testid="footer-book-link" className="group block">
          <Eyebrow className="mb-6">Next frame</Eyebrow>
          <span className="font-display text-[13vw] uppercase leading-[0.85] transition-colors duration-500 group-hover:text-[#FF5500] md:text-[8vw]">
            Have a show<br />coming up?
          </span>
          <span className="mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-[#FF5500]">
            Book FilmsByPaddy
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
          </span>
        </Link>
      </div>
      <div className="grid gap-10 border-t border-white/10 px-5 py-12 md:grid-cols-3 md:px-10">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="h-6 w-6" />
            <span className="font-display text-2xl uppercase tracking-[0.08em]">Films<span className="text-[#FF5500]">by</span>Paddy</span>
          </div>
          <p className="mt-5 text-[10px] uppercase leading-relaxed tracking-[0.3em] text-[#A1A1AA]">
            Live music. Raw energy.<br />Cinematic stories.
          </p>
        </div>
        <div className="flex flex-wrap content-start gap-x-8 gap-y-3">
          {["WORK", "ARTISTS", "FESTIVALS", "SERVICES", "ABOUT", "CONTACT"].map((x) => (
            <Link
              key={x}
              to={x === "CONTACT" ? "/contact" : `/${x.toLowerCase()}`}
              data-testid={`footer-${x.toLowerCase()}-link`}
              className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#A1A1AA] transition-colors duration-300 hover:text-[#FF5500]"
            >
              {x}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <a href={contact.instagram} target="_blank" rel="noreferrer" data-testid="instagram-link" className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#A1A1AA] transition-colors duration-300 hover:text-[#FF5500]">
            <Instagram size={13} /> Instagram
          </a>
          <a href={`mailto:${contact.email}`} data-testid="email-link" className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#A1A1AA] transition-colors duration-300 hover:text-[#FF5500]">
            <Mail size={13} /> Email
          </a>
          <a href={contact.whatsapp} target="_blank" rel="noreferrer" data-testid="whatsapp-link" className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#A1A1AA] transition-colors duration-300 hover:text-[#FF5500]">
            <MessageCircle size={13} /> WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 md:px-10">
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#A1A1AA]/70">© 2026 FilmsByPaddy. All rights reserved.</p>
      </div>
    </footer>
  );
}

export function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F4F4F5]">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
