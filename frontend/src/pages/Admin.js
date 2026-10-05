import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ImagePlus, LogOut, Plus, Trash2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const full = (u) => (u && u.startsWith("/api/") ? `${process.env.REACT_APP_BACKEND_URL}${u}` : u);

const inputCls = "w-full rounded-none border-b border-white/15 bg-transparent py-2 text-sm text-[#F4F4F5] outline-none transition-colors focus:border-[#FF5500]";
const labelCls = "mb-1 block text-[9px] font-medium uppercase tracking-[0.25em] text-[#A1A1AA]";

function ImageSlot({ label, value, onChange, onUpload, testid }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      onChange(await onUpload(f));
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };
  return (
    <div className="border border-white/10 p-3" data-testid={testid}>
      <p className={`${labelCls} mb-2`}>{label}</p>
      {value ? (
        <img src={full(value)} alt={label} className="mb-2 h-20 w-full object-cover" />
      ) : (
        <div className="mb-2 flex h-20 items-center justify-center bg-white/5 text-[9px] uppercase tracking-widest text-[#A1A1AA]">No image</div>
      )}
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or /media/…" className={`${inputCls} !py-1.5 text-[11px]`} data-testid={`${testid}-url`} />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className="mt-2 flex items-center gap-2 border border-[#FF5500] px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#FF5500] transition-colors hover:bg-[#FF5500] hover:text-black disabled:opacity-50"
        data-testid={`${testid}-upload`}
      >
        <ImagePlus size={12} /> {busy ? "Uploading…" : "Upload"}
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} data-testid={`${testid}-file`} />
    </div>
  );
}

const TEXT_FIELDS = [
  ["title", "Title"], ["artist", "Artist"], ["event", "Event"], ["venue", "Venue"],
  ["city", "City"], ["year", "Year"], ["services", "Services"], ["videoUrl", "Video URL"],
];

function ProjectEditor({ project, isNew, onSave, onDelete, onUpload }) {
  const [p, setP] = useState(project);
  const [open, setOpen] = useState(isNew);
  const [msg, setMsg] = useState("");
  useEffect(() => setP(project), [project]);
  const set = (k, v) => setP((prev) => ({ ...prev, [k]: v }));
  const setBts = (i, v) =>
    setP((prev) => {
      const b = [...(prev.btsImages || ["", ""])];
      b[i] = v;
      return { ...prev, btsImages: b };
    });

  const save = async () => {
    setMsg("Saving…");
    try {
      await onSave(p, isNew);
      setMsg("Saved");
    } catch (e) {
      setMsg(e.response?.data?.detail || "Save failed");
    }
    setTimeout(() => setMsg(""), 2500);
  };

  return (
    <div className="border border-white/10" data-testid={`admin-project-${p.slug}`}>
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-left" data-testid={`admin-project-toggle-${p.slug}`}>
        <span className="font-display text-xl uppercase tracking-wide">{p.title || "Untitled"}</span>
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#A1A1AA]">{open ? "Close" : "Edit"}</span>
      </button>
      {open && (
        <div className="space-y-5 border-t border-white/10 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {isNew && (
              <label className="block">
                <span className={labelCls}>Slug (URL)</span>
                <input value={p.slug || ""} onChange={(e) => set("slug", e.target.value)} className={inputCls} data-testid="admin-new-slug" />
              </label>
            )}
            {TEXT_FIELDS.map(([k, l]) => (
              <label key={k} className="block">
                <span className={labelCls}>{l}</span>
                <input value={p[k] || ""} onChange={(e) => set(k, e.target.value)} className={inputCls} data-testid={`admin-field-${k}`} />
              </label>
            ))}
            <label className="block md:col-span-3">
              <span className={labelCls}>Description</span>
              <textarea value={p.description || ""} onChange={(e) => set("description", e.target.value)} rows={2} className={inputCls} data-testid="admin-field-description" />
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={!!p.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4 accent-[#FF5500]" data-testid="admin-field-featured" />
              <span className={labelCls}>Featured on homepage</span>
            </label>
            <label className="block w-24">
              <span className={labelCls}>Sort order</span>
              <input type="number" value={p.sortOrder ?? 0} onChange={(e) => set("sortOrder", Number(e.target.value))} className={inputCls} data-testid="admin-field-sortOrder" />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ImageSlot label="Hero image" value={p.heroImage} onChange={(v) => set("heroImage", v)} onUpload={onUpload} testid={`admin-img-hero-${p.slug}`} />
            <ImageSlot label="Artist image" value={p.artistImage} onChange={(v) => set("artistImage", v)} onUpload={onUpload} testid={`admin-img-artist-${p.slug}`} />
            <ImageSlot label="Crowd image" value={p.crowdImage} onChange={(v) => set("crowdImage", v)} onUpload={onUpload} testid={`admin-img-crowd-${p.slug}`} />
            <ImageSlot label="Light image" value={p.lightImage} onChange={(v) => set("lightImage", v)} onUpload={onUpload} testid={`admin-img-light-${p.slug}`} />
            <ImageSlot label="Motion poster" value={p.motionImage} onChange={(v) => set("motionImage", v)} onUpload={onUpload} testid={`admin-img-motion-${p.slug}`} />
            <ImageSlot label="BTS image 1" value={p.btsImages?.[0]} onChange={(v) => setBts(0, v)} onUpload={onUpload} testid={`admin-img-bts0-${p.slug}`} />
            <ImageSlot label="BTS image 2" value={p.btsImages?.[1]} onChange={(v) => setBts(1, v)} onUpload={onUpload} testid={`admin-img-bts1-${p.slug}`} />
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={save} className="bg-[#F4F4F5] px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-[#FF5500]" data-testid={`admin-save-${p.slug}`}>
              {isNew ? "Create project" : "Save changes"}
            </button>
            {!isNew && (
              <button type="button" onClick={() => onDelete(p.slug)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA] transition-colors hover:text-[#FF5500]" data-testid={`admin-delete-${p.slug}`}>
                <Trash2 size={13} /> Delete
              </button>
            )}
            {msg && <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF5500]" data-testid={`admin-msg-${p.slug}`}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("fbp_admin_token", r.data.token);
      onLogin(r.data.token);
    } catch (err) {
      const d = err.response?.data?.detail;
      setError(typeof d === "string" ? d : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080808] px-5">
      <form onSubmit={submit} className="w-full max-w-sm" data-testid="admin-login-form">
        <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-[#A1A1AA]">FilmsByPaddy — Admin</p>
        <h1 className="font-display mb-10 text-6xl uppercase leading-none text-[#F4F4F5]">
          Owner<br /><span className="text-outline">access.</span>
        </h1>
        <label className="mb-6 block">
          <span className={labelCls}>Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} data-testid="admin-email-input" />
        </label>
        <label className="mb-8 block">
          <span className={labelCls}>Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} data-testid="admin-password-input" />
        </label>
        {error && <p className="mb-5 text-[10px] uppercase tracking-[0.2em] text-[#FF5500]" data-testid="admin-login-error">{error}</p>}
        <button disabled={busy} className="w-full bg-[#F4F4F5] py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-black transition-colors hover:bg-[#FF5500] disabled:opacity-50" data-testid="admin-login-button">
          {busy ? "Checking…" : "Log in"}
        </button>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-[#A1A1AA] hover:text-[#FF5500]" data-testid="admin-back-link">
          <ArrowLeft size={12} /> Back to site
        </Link>
      </form>
    </div>
  );
}

const TABS = [["projects", "Projects"], ["instagram", "Instagram grid"], ["images", "Site images"], ["enquiries", "Enquiries"]];
const BLANK_PROJECT = {
  slug: "", title: "", artist: "", event: "", venue: "", city: "", year: "", services: "",
  description: "", heroImage: "", artistImage: "", crowdImage: "", lightImage: "", motionImage: "",
  btsImages: ["", ""], videoUrl: "", featured: false, sortOrder: 99,
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("fbp_admin_token") || "");
  const [checking, setChecking] = useState(!!token);
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [content, setContent] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [newProject, setNewProject] = useState(null);
  const [contentMsg, setContentMsg] = useState("");

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API}/auth/me`, auth)
      .then(() => setChecking(false))
      .catch(() => {
        localStorage.removeItem("fbp_admin_token");
        setToken("");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token || checking) return;
    Promise.all([axios.get(`${API}/portfolio`), axios.get(`${API}/site-content`)])
      .then(([pr, sc]) => {
        setProjects(pr.data.projects);
        setContent(sc.data);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, checking]);

  useEffect(() => {
    if (tab === "enquiries" && token) {
      axios.get(`${API}/admin/enquiries`, auth).then((r) => setEnquiries(r.data.enquiries)).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, token]);

  const upload = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const r = await axios.post(`${API}/admin/upload`, fd, auth);
    return r.data.url;
  };

  const saveProject = async (p, isNew) => {
    if (isNew) {
      await axios.post(`${API}/admin/portfolio`, p, auth);
      setNewProject(null);
    } else {
      await axios.put(`${API}/admin/portfolio/${p.slug}`, p, auth);
    }
    const r = await axios.get(`${API}/portfolio`);
    setProjects(r.data.projects);
  };

  const deleteProject = async (slug) => {
    if (!window.confirm(`Delete project "${slug}"? This cannot be undone.`)) return;
    await axios.delete(`${API}/admin/portfolio/${slug}`, auth);
    setProjects((prev) => prev.filter((p) => p.slug !== slug));
  };

  const saveContent = async () => {
    setContentMsg("Saving…");
    try {
      await axios.put(`${API}/admin/site-content`, content, auth);
      setContentMsg("Saved");
    } catch {
      setContentMsg("Save failed");
    }
    setTimeout(() => setContentMsg(""), 2500);
  };

  const setPost = (i, k, v) =>
    setContent((c) => {
      const posts = [...c.instagramPosts];
      posts[i] = { ...posts[i], [k]: v };
      return { ...c, instagramPosts: posts };
    });

  const setImage = (key, v) => setContent((c) => ({ ...c, images: { ...c.images, [key]: v } }));
  const setImageAt = (key, i, v) =>
    setContent((c) => {
      const arr = [...(c.images[key] || [])];
      arr[i] = v;
      return { ...c, images: { ...c.images, [key]: arr } };
    });

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-[#080808] text-[10px] uppercase tracking-[0.3em] text-[#A1A1AA]">Loading…</div>;
  }
  if (!token) return <Login onLogin={setToken} />;

  const logout = () => {
    localStorage.removeItem("fbp_admin_token");
    setToken("");
  };

  return (
    <div className="min-h-screen bg-[#080808] px-5 py-10 text-[#F4F4F5] md:px-10" data-testid="admin-dashboard">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[9px] uppercase tracking-[0.35em] text-[#A1A1AA]">FilmsByPaddy</p>
          <h1 className="font-display text-5xl uppercase leading-none">Content <span className="text-outline">studio.</span></h1>
        </div>
        <div className="flex items-center gap-5">
          <Link to="/" className="text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA] hover:text-[#FF5500]" data-testid="admin-view-site">View site</Link>
          <button onClick={logout} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA] hover:text-[#FF5500]" data-testid="admin-logout-button">
            <LogOut size={13} /> Log out
          </button>
        </div>
      </div>

      <div className="mb-10 flex gap-6 overflow-x-auto border-b border-white/10">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`whitespace-nowrap pb-3 text-[10px] font-medium uppercase tracking-[0.25em] transition-colors ${tab === k ? "border-b border-[#FF5500] text-[#FF5500]" : "text-[#A1A1AA] hover:text-[#F4F4F5]"}`}
            data-testid={`admin-tab-${k}`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "projects" && (
        <div className="space-y-4" data-testid="admin-projects-panel">
          <button
            onClick={() => setNewProject({ ...BLANK_PROJECT })}
            className="flex items-center gap-2 border border-[#FF5500] px-4 py-2.5 text-[10px] uppercase tracking-[0.25em] text-[#FF5500] transition-colors hover:bg-[#FF5500] hover:text-black"
            data-testid="admin-add-project"
          >
            <Plus size={13} /> Add project
          </button>
          {newProject && <ProjectEditor project={newProject} isNew onSave={saveProject} onDelete={() => {}} onUpload={upload} />}
          {projects.map((p) => (
            <ProjectEditor key={p.slug} project={p} onSave={saveProject} onDelete={deleteProject} onUpload={upload} />
          ))}
        </div>
      )}

      {tab === "instagram" && content && (
        <div data-testid="admin-instagram-panel">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {content.instagramPosts.map((post, i) => (
              <div key={i} className="border border-white/10 p-3">
                <ImageSlot label={`Tile ${i + 1}`} value={post.img} onChange={(v) => setPost(i, "img", v)} onUpload={upload} testid={`admin-ig-${i}`} />
                <input value={post.url} onChange={(e) => setPost(i, "url", e.target.value)} placeholder="Instagram post URL" className={`${inputCls} mt-3 !py-1.5 text-[11px]`} data-testid={`admin-ig-url-${i}`} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button onClick={saveContent} className="bg-[#F4F4F5] px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-[#FF5500]" data-testid="admin-ig-save">
              Save Instagram grid
            </button>
            {contentMsg && <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF5500]">{contentMsg}</span>}
          </div>
        </div>
      )}

      {tab === "images" && content && (
        <div data-testid="admin-images-panel">
          <p className={`${labelCls} mb-4`}>Homepage & About</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ImageSlot label="Hero poster (video fallback)" value={content.images.heroPoster} onChange={(v) => setImage("heroPoster", v)} onUpload={upload} testid="admin-img-heroPoster" />
            <ImageSlot label="Showreel poster" value={content.images.showreelPoster} onChange={(v) => setImage("showreelPoster", v)} onUpload={upload} testid="admin-img-showreelPoster" />
            <ImageSlot label="Light beam strip" value={content.images.texture} onChange={(v) => setImage("texture", v)} onUpload={upload} testid="admin-img-texture" />
            <ImageSlot label="About portrait" value={content.images.aboutPortrait} onChange={(v) => setImage("aboutPortrait", v)} onUpload={upload} testid="admin-img-aboutPortrait" />
          </div>
          <p className={`${labelCls} mb-4 mt-10`}>Behind the frame (6 slots)</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(content.images.bts || []).map((img, i) => (
              <ImageSlot key={i} label={`BTS ${i + 1}`} value={img} onChange={(v) => setImageAt("bts", i, v)} onUpload={upload} testid={`admin-img-bts-${i}`} />
            ))}
          </div>
          <p className={`${labelCls} mb-4 mt-10`}>Festivals archive (4 slots)</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(content.images.festivals || []).map((img, i) => (
              <ImageSlot key={i} label={`Festival ${i + 1}`} value={img} onChange={(v) => setImageAt("festivals", i, v)} onUpload={upload} testid={`admin-img-fest-${i}`} />
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button onClick={saveContent} className="bg-[#F4F4F5] px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:bg-[#FF5500]" data-testid="admin-images-save">
              Save site images
            </button>
            {contentMsg && <span className="text-[10px] uppercase tracking-[0.2em] text-[#FF5500]">{contentMsg}</span>}
          </div>
        </div>
      )}

      {tab === "enquiries" && (
        <div className="space-y-3" data-testid="admin-enquiries-panel">
          {enquiries.length === 0 && <p className="text-[10px] uppercase tracking-[0.25em] text-[#A1A1AA]">No enquiries yet.</p>}
          {enquiries.map((q, i) => (
            <div key={q.id || i} className="border border-white/10 p-4" data-testid={`admin-enquiry-${i}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-2xl uppercase">{q.name} <span className="text-[#A1A1AA]">— {q.organization}</span></p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#A1A1AA]">{(q.created_at || "").slice(0, 10)}</p>
              </div>
              <p className="mt-2 text-[11px] text-[#A1A1AA]">
                {q.email} · {q.phone} · {q.event_artist} · {q.event_location} · {q.budget}
              </p>
              <p className="mt-1 text-[11px] text-[#A1A1AA]">Coverage: {(q.coverage || []).join(", ")}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#F4F4F5]/80">{q.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
