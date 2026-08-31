import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ThemeToggle } from "../components/ThemeToggle"
import { fieldClass } from "../components/ui"
import { useAuth, useSite } from "../context"
import { CAT_LABELS, type Profile, type Project, type ProjectCategory } from "../types"
import { AdminLogin } from "./AdminLogin"

type View = "overview" | "profile" | "projects" | "guestbook" | "inbox" | "settings"
const VIEWS: { id: View; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "profile", label: "Profile" },
  { id: "projects", label: "Projects" },
  { id: "guestbook", label: "Guestbook" },
  { id: "inbox", label: "Inbox" },
  { id: "settings", label: "Settings" },
]

export function Admin() {
  const { user, ready } = useAuth()
  if (!ready || !user) return <AdminLogin />
  return <AdminStudio />
}

function AdminStudio() {
  const site = useSite()
  const { user, signOut } = useAuth()
  const [view, setView] = useState<View>("overview")
  const [toast, setToast] = useState("")
  const ping = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(""), 2200)
  }

  return (
    <div className="min-h-screen bg-page text-ink p-3 sm:p-5">
      <div className="min-h-[calc(100vh-1.5rem)] max-w-6xl mx-auto border border-line rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="border-b md:border-b-0 md:border-r border-line bg-card p-4 flex md:flex-col gap-3">
          <div>
            <p className="text-xs font-bold text-ink">Admin studio</p>
            <p className="text-[10px] text-muted font-mono">{site.profile.first_name} {site.profile.last_name}</p>
            <p className="text-[10px] font-mono text-muted truncate mt-0.5">{user?.email}</p>
          </div>
          <nav className="flex md:flex-col gap-1 text-xs">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={`text-left px-3 py-2 rounded-xl ${view === v.id ? "bg-soft text-ink" : "text-muted hover:text-ink"}`}
              >
                {v.label}
              </button>
            ))}
          </nav>
          <div className="md:mt-auto flex flex-col gap-1">
            <Link to="/" className="px-3 py-2 rounded-xl bg-soft text-[11px] font-mono text-center">
              Back to site
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className="px-3 py-2 rounded-xl text-[11px] font-mono text-muted hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </aside>
        <section className="overflow-y-auto p-5 sm:p-7">
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-[11px] font-mono text-muted uppercase tracking-widest">Control room</p>
              <h2 className="text-2xl font-bold text-ink">{VIEWS.find((v) => v.id === view)?.label}</h2>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <span className="text-[11px] font-mono text-muted">{toast || "Ready"}</span>
            </div>
          </div>
          {view === "overview" && <Overview ping={ping} />}
          {view === "profile" && <ProfileForm ping={ping} />}
          {view === "projects" && <ProjectsAdmin ping={ping} />}
          {view === "guestbook" && <GuestbookAdmin ping={ping} />}
          {view === "inbox" && <InboxAdmin ping={ping} />}
          {view === "settings" && <SettingsPanel ping={ping} />}
        </section>
      </div>
    </div>
  )
}

function Overview({ ping }: { ping: (m: string) => void }) {
  const { profile, projects, guestbook, inbox, updateProfile } = useSite()
  const [badge, setBadge] = useState(profile.badge)
  useEffect(() => setBadge(profile.badge), [profile.badge])
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ["Projects", String(projects.length)],
          ["Guestbook", String(guestbook.length)],
          ["Inbox", String(inbox.length)],
          ["Status", "On"],
        ].map(([k, v]) => (
          <article key={k} className="bg-card border border-line rounded-2xl p-4">
            <p className="text-[10px] font-mono uppercase text-muted">{k}</p>
            <p className="text-2xl font-bold text-ink mt-1">{v}</p>
          </article>
        ))}
      </div>
      <div className="bg-card border border-line rounded-2xl p-5 space-y-3">
        <p className="text-sm font-bold text-ink">Quick status</p>
        <input value={badge} onChange={(e) => setBadge(e.target.value)} className={fieldClass} />
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-accent text-accent-fg text-xs"
          onClick={async () => {
            await updateProfile({ ...profile, badge })
            ping("Badge updated")
          }}
        >
          Update badge
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  area,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  area?: boolean
}) {
  return (
    <div>
      <label className="block text-[11px] font-mono text-muted mb-1">{label}</label>
      {area ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={fieldClass} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass} />
      )}
    </div>
  )
}

function ProfileForm({ ping }: { ping: (m: string) => void }) {
  const { profile, updateProfile } = useSite()
  const [form, setForm] = useState<Profile>(profile)
  useEffect(() => setForm(profile), [profile])
  const set = (k: keyof Profile, v: string) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <form
      className="space-y-4 max-w-2xl"
      onSubmit={async (e) => {
        e.preventDefault()
        await updateProfile(form)
        ping("Profile live")
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" value={form.first_name} onChange={(v) => set("first_name", v)} />
        <Field label="Last name" value={form.last_name} onChange={(v) => set("last_name", v)} />
      </div>
      <Field label="Role" value={form.role} onChange={(v) => set("role", v)} />
      <Field label="Badge" value={form.badge} onChange={(v) => set("badge", v)} />
      <Field label="Hero bio" value={form.bio} onChange={(v) => set("bio", v)} area />
      <Field label="About" value={form.about} onChange={(v) => set("about", v)} area />
      <Field label="Location" value={form.location} onChange={(v) => set("location", v)} />
      <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
      <button className="px-5 py-2.5 rounded-xl bg-accent text-accent-fg text-xs font-semibold">Save profile</button>
    </form>
  )
}

function ProjectsAdmin({ ping }: { ping: (m: string) => void }) {
  const { projects, upsertProject, removeProject } = useSite()
  const [editing, setEditing] = useState<Project | null>(null)
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() =>
          setEditing({
            id: "",
            title: "",
            category: "backend",
            description: "",
            highlights: [],
            tags: [],
            github: "",
            stars: 0,
            sort_order: 0,
          })
        }
        className="px-3 py-2 rounded-xl bg-accent text-accent-fg text-xs"
      >
        New project
      </button>
      {projects.map((p) => (
        <div key={p.id} className="flex justify-between bg-card border border-line rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-bold text-ink">{p.title}</p>
            <p className="text-[11px] font-mono text-muted">{CAT_LABELS[p.category]}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditing(p)} className="text-xs text-ink">
              Edit
            </button>
            <button
              type="button"
              onClick={async () => {
                await removeProject(p.id)
                ping("Removed")
              }}
              className="text-xs text-muted"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {editing && (
        <form
          className="border border-line rounded-2xl p-5 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault()
            await upsertProject(editing)
            setEditing(null)
            ping("Published")
          }}
        >
          <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <select
            className={fieldClass}
            value={editing.category}
            onChange={(e) => setEditing({ ...editing, category: e.target.value as ProjectCategory })}
          >
            <option value="fullstack">Full-Stack</option>
            <option value="backend">Backend</option>
            <option value="ai">AI / ML</option>
            <option value="realtime">Real-Time</option>
          </select>
          <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} area />
          <Field
            label="Highlights (one per line)"
            value={editing.highlights.join("\n")}
            onChange={(v) => setEditing({ ...editing, highlights: v.split("\n").filter(Boolean) })}
            area
          />
          <Field
            label="Tags"
            value={editing.tags.join(", ")}
            onChange={(v) => setEditing({ ...editing, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })}
          />
          <Field label="GitHub" value={editing.github} onChange={(v) => setEditing({ ...editing, github: v })} />
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-accent text-accent-fg text-xs">Save</button>
            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl bg-soft text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function GuestbookAdmin({ ping }: { ping: (m: string) => void }) {
  const { guestbook, removeGuest } = useSite()
  return (
    <div className="space-y-3">
      {guestbook.length === 0 && <p className="text-xs text-muted font-mono">No signatures yet.</p>}
      {guestbook.map((g) => (
        <article key={g.id} className="border border-line rounded-xl p-4 flex justify-between gap-3">
          <p className="text-sm text-ink">
            {g.emoji} {g.name}: {g.message}
          </p>
          <button
            type="button"
            onClick={async () => {
              await removeGuest(g.id)
              ping("Removed")
            }}
            className="text-xs text-muted"
          >
            Delete
          </button>
        </article>
      ))}
    </div>
  )
}

function InboxAdmin({ ping }: { ping: (m: string) => void }) {
  const { inbox, removeMessage } = useSite()
  return (
    <div className="space-y-3">
      {inbox.length === 0 && <p className="text-xs text-muted font-mono">Inbox is empty.</p>}
      {inbox.map((m) => (
        <article key={m.id} className="border border-line rounded-xl p-4">
          <div className="flex justify-between">
            <p className="text-sm font-bold text-ink">
              {m.name} · {m.email}
            </p>
            <button
              type="button"
              onClick={async () => {
                await removeMessage(m.id)
                ping("Deleted")
              }}
              className="text-xs text-muted"
            >
              Delete
            </button>
          </div>
          <p className="text-xs text-muted">{m.message}</p>
        </article>
      ))}
    </div>
  )
}

function SettingsPanel({ ping }: { ping: (m: string) => void }) {
  const { resetContent, configured } = useSite()
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted font-mono">
        {configured
          ? "Connected to Supabase."
          : "Local studio. Connect Supabase later for cloud login — keep your demo password private."}
      </p>
      <button
        type="button"
        className="px-4 py-2 rounded-xl bg-soft border border-line text-muted text-xs"
        onClick={async () => {
          if (!confirm("Reset content?")) return
          await resetContent()
          ping("Reset")
        }}
      >
        Reset content
      </button>
    </div>
  )
}
