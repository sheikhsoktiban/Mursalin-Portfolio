import { useMemo, useState, type ReactNode } from "react"
import { useSite } from "../context"
import { CAT_LABELS, type Project } from "../types"

export function Overlay({
  open,
  onClose,
  children,
  wide,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-page/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div
        className={`bg-card border border-line rounded-2xl shadow-2xl overflow-hidden mb-16 ${wide ? "w-full max-w-2xl p-6 sm:p-8 space-y-6 relative" : "w-full max-w-xl"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

const COMMANDS = [
  { id: "admin", title: "Open Admin Panel", hint: "Studio", href: "/admin" },
  { id: "about", title: "Jump to About", hint: "Navigation", href: "#about" },
  { id: "projects", title: "View Projects", hint: "Navigation", href: "#projects" },
  { id: "experience", title: "Work Experience", hint: "Navigation", href: "#experience" },
  { id: "skills", title: "Skills Matrix", hint: "Navigation", href: "#skills" },
  { id: "terminal", title: "Developer CLI", hint: "Navigation", href: "#terminal" },
  { id: "guestbook", title: "Sign Guestbook", hint: "Navigation", href: "#guestbook" },
  { id: "contact", title: "Send Message", hint: "Navigation", href: "#contact" },
  { id: "resume", title: "Open Resume", hint: "Resume", href: "resume" },
]

export function CommandPalette({ open, onClose, onResume }: { open: boolean; onClose: () => void; onResume: () => void }) {
  const [q, setQ] = useState("")
  const list = useMemo(() => COMMANDS.filter((c) => c.title.toLowerCase().includes(q.toLowerCase())), [q])
  const go = (href: string) => {
    onClose()
    setQ("")
    if (href === "resume") onResume()
    else if (href.startsWith("/")) window.location.hash = "#" + href
    else document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" })
  }
  return (
    <Overlay open={open} onClose={onClose}>
      <div className="flex items-center px-4 py-3.5 border-b border-line">
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a command..." className="w-full bg-transparent text-ink text-sm focus:outline-none" />
      </div>
      <div className="max-h-80 overflow-y-auto p-2 space-y-1">
        {list.map((c) => (
          <button key={c.id} type="button" onClick={() => go(c.href)} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-soft text-sm">
            <span className="block text-ink">{c.title}</span>
            <span className="text-[11px] text-muted font-mono">{c.hint}</span>
          </button>
        ))}
      </div>
    </Overlay>
  )
}

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  if (!project) return null
  return (
    <Overlay open onClose={onClose} wide>
      <button type="button" onClick={onClose} className="absolute top-5 right-5 text-muted">✕</button>
      <span className="px-3 py-1 rounded-full bg-soft text-muted border border-line text-xs font-mono">{CAT_LABELS[project.category]}</span>
      <h3 className="text-2xl font-bold text-ink">{project.title}</h3>
      <p className="text-muted text-sm">{project.description}</p>
      <ul className="space-y-2 text-sm text-muted">
        {project.highlights.map((t) => (
          <li key={t}>▹ {t}</li>
        ))}
      </ul>
      <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-soft text-ink text-xs inline-flex">
        View Code on GitHub
      </a>
    </Overlay>
  )
}

export function ResumeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile } = useSite()
  return (
    <Overlay open={open} onClose={onClose} wide>
      <button type="button" onClick={onClose} className="absolute top-5 right-5 text-muted">✕</button>
      <h3 className="text-xl font-bold text-ink">Curriculum Vitae / Resume</h3>
      <p className="text-xs text-muted font-mono">
        {profile.first_name} {profile.last_name} · {profile.role}
      </p>
      <div className="text-muted text-xs leading-relaxed bg-page p-6 rounded-2xl border border-line font-mono space-y-3">
        <p className="text-base font-bold text-ink">
          {profile.first_name} {profile.last_name}
        </p>
        <p className="text-muted">{profile.role}</p>
        <p>
          {profile.email} · {profile.phone} · {profile.location}
        </p>
        <p>{profile.bio}</p>
      </div>
      <a href="/Mursalin-CV.pdf" download className="inline-flex px-5 py-2 rounded-xl bg-accent text-accent-fg text-xs font-semibold">
        Download PDF
      </a>
    </Overlay>
  )
}
