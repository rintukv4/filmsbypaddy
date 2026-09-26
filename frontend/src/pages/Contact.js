import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, Layout, SolidButton } from "@/components/Layout";
import { MaskedLine, Reveal } from "@/components/motion";
import { contact } from "@/data/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const COVERAGE = ["Photography", "Cinematography", "Photography + Cinematography", "Aftermovie", "Social Content", "Full Festival Coverage"];

const inputCls = "mt-3 block w-full border-b border-white/15 bg-transparent py-3.5 text-sm text-[#F4F4F5] outline-none transition-colors duration-300 placeholder:text-[#A1A1AA]/40 focus:border-[#FF5500] rounded-none";
const labelCls = "block text-[10px] font-medium uppercase tracking-[0.3em] text-[#A1A1AA]";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverage, setCoverage] = useState([]);

  const toggle = (x) => setCoverage((c) => (c.includes(x) ? c.filter((y) => y !== x) : [...c, x]));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    data.coverage = coverage;
    try {
      await axios.post(`${API}/enquiries`, data);
      setSent(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Layout>
        <section className="flex min-h-[80vh] flex-col justify-center px-5 pt-24 md:px-10" data-testid="enquiry-success">
          <Eyebrow className="mb-8">Enquiry received</Eyebrow>
          <h1 className="font-display uppercase leading-[0.85]">
            <MaskedLine delay={0.1}><span className="block text-[18vw] md:text-[12vw]">Thank</span></MaskedLine>
            <MaskedLine delay={0.25}><span className="text-outline block text-[18vw] md:text-[12vw]">You.</span></MaskedLine>
          </h1>
          <p className="mt-10 max-w-md text-sm leading-relaxed text-[#A1A1AA]">
            Your enquiry has been received.<br />I'll get back to you shortly.
          </p>
          <div className="mt-12"><SolidButton to="/" testid="success-home-button">Back to home</SolidButton></div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="px-5 pb-16 pt-36 md:px-10 md:pt-48">
        <Eyebrow className="mb-8">06 — Start a conversation</Eyebrow>
        <h1 className="font-display uppercase leading-[0.85]">
          <MaskedLine delay={0.1}><span className="block text-[13vw] md:text-[9vw]">Got a show?</span></MaskedLine>
          <MaskedLine delay={0.25}><span className="text-outline block text-[13vw] md:text-[9vw]">Let's make it</span></MaskedLine>
          <MaskedLine delay={0.4}><span className="block text-[13vw] md:text-[9vw]">look unforgettable.</span></MaskedLine>
        </h1>
        <p className="mt-10 max-w-md text-sm leading-relaxed text-[#A1A1AA] md:ml-auto md:text-right">
          For concerts, festivals, artist performances and live events.<br /><br />
          Tell me what you're building and I'll get back to you shortly.
        </p>
      </section>

      <section className="px-5 pb-24 md:px-10 md:pb-36">
        <Reveal>
          <form onSubmit={submit} data-testid="enquiry-form" className="border-t border-white/10 pt-14">
            <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
              <label className={labelCls}>Name
                <input name="name" required placeholder="Your name" className={inputCls} data-testid="enquiry-name-input" />
              </label>
              <label className={labelCls}>Company / Organization
                <input name="organization" required placeholder="Company or event" className={inputCls} data-testid="enquiry-organization-input" />
              </label>
              <label className={labelCls}>Email
                <input name="email" type="email" required placeholder="you@example.com" className={inputCls} data-testid="enquiry-email-input" />
              </label>
              <label className={labelCls}>Phone
                <input name="phone" required placeholder="+91" className={inputCls} data-testid="enquiry-phone-input" />
              </label>
              <label className={labelCls}>Event / Artist
                <input name="event_artist" required placeholder="What are we covering?" className={inputCls} data-testid="enquiry-event-input" />
              </label>
              <label className={labelCls}>Event date
                <input name="event_date" type="date" className={inputCls} data-testid="enquiry-date-input" />
              </label>
              <label className={`${labelCls} md:col-span-2`}>Event location
                <input name="event_location" required placeholder="City, venue" className={inputCls} data-testid="enquiry-location-input" />
              </label>
            </div>

            <div className="mt-16">
              <Eyebrow>Coverage required</Eyebrow>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {COVERAGE.map((x, i) => (
                  <button
                    type="button"
                    key={x}
                    onClick={() => toggle(x)}
                    data-testid={`coverage-option-${i}`}
                    aria-pressed={coverage.includes(x)}
                    className={`flex items-center justify-between border px-5 py-4 text-left text-[10px] font-medium uppercase tracking-[0.25em] transition-colors duration-300 ${
                      coverage.includes(x)
                        ? "border-[#FF5500] text-[#FF5500]"
                        : "border-white/15 text-[#A1A1AA] hover:border-white/40 hover:text-[#F4F4F5]"
                    }`}
                  >
                    {x}
                    <span className="text-sm leading-none">{coverage.includes(x) ? "×" : "+"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-16 grid gap-x-10 gap-y-9 md:grid-cols-2">
              <label className={`${labelCls} md:col-span-2`}>Expected deliverables
                <textarea name="deliverables" required placeholder="Tell me what you need delivered" rows={3} className={`${inputCls} resize-y`} data-testid="enquiry-deliverables-input" />
              </label>
              <label className={labelCls}>Budget range
                <select name="budget" required className={inputCls} data-testid="enquiry-budget-select" defaultValue="">
                  <option value="" disabled>Select a range</option>
                  <option>Under ₹50,000</option>
                  <option>₹50,000 — ₹1,00,000</option>
                  <option>₹1,00,000+</option>
                  <option>Let's discuss</option>
                </select>
              </label>
              <label className={labelCls}>Instagram / Website
                <input name="website" placeholder="@handle or link" className={inputCls} data-testid="enquiry-website-input" />
              </label>
              <label className={`${labelCls} md:col-span-2`}>Additional information
                <textarea name="message" required placeholder="Dates, access, references, anything useful" rows={4} className={`${inputCls} resize-y`} data-testid="enquiry-message-input" />
              </label>
            </div>

            <input className="honeypot" name="honeypot" tabIndex="-1" autoComplete="off" aria-hidden="true" />

            <div className="mt-14 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                {error && <span className="text-[11px] uppercase tracking-[0.2em] text-[#FF5500]" data-testid="enquiry-error">{error}</span>}
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#A1A1AA]/60">
                  Prefer email? <a href={`mailto:${contact.email}`} className="text-[#A1A1AA] underline-offset-4 hover:text-[#FF5500] hover:underline" data-testid="contact-email-link">{contact.email}</a>
                </span>
              </div>
              <SolidButton type="submit" disabled={loading} testid="enquiry-submit-button">
                {loading ? "Sending…" : "Send enquiry"}
              </SolidButton>
            </div>
          </form>
        </Reveal>
      </section>
    </Layout>
  );
}
