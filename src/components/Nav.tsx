import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSite } from "../context"
import { ThemeToggle } from "./ThemeToggle"

const LINKS = [
  ["#about", "About"],
  ["#experience", "Experience"],
  ["#projects", "Projects"],
  ["#skills", "Skills"],
  ["#terminal", "Terminal"],
  ["#guestbook", "Guestbook"],
] as const

export function Nav({ onCommand }: { onCommand: () => void }) {
  const { profile } = useSite()
  const [active, setActive] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  const onHome = location.pathname === "/"

  useEffect(() => {
    if (!onHome) return
    const ids = LINKS.map(([href]) => href.slice(1))
    const onScroll = () => {
      const y = window.scrollY + 120
      let cur = ""
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) cur = id
      }
      setActive(cur)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [onHome])

  const go = (hash: string) => {
    if (!onHome) {
      navigate("/" + hash)
      return
    }
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-line bg-page/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[72px]">
        <Link to="/" className="group flex items-center gap-3 text-ink font-bold tracking-tight hover:opacity-90">
          <span className="w-10 h-10 rounded-xl border border-line p-[1px] group-hover:scale-105 transition-transform flex">
            <span className="w-full h-full bg-page rounded-[11px] flex items-center justify-center text-ink font-extrabold text-lg">
              MM
            </span>
          </span>
          <span className="flex flex-col">
            <span className="text-ink font-bold leading-none text-sm sm:text-base">{profile.last_name}</span>
            <span className="text-xs text-muted font-mono tracking-tighter">BACKEND ENGINEER</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 bg-soft p-1.5 rounded-full border border-line text-xs font-medium text-muted">
          {LINKS.map(([href, label]) => (
            <button
              key={href}
              type="button"
              onClick={() => go(href)}
              className={`px-3 py-1.5 rounded-full hover:text-ink hover:bg-soft transition-colors ${
                active === href.slice(1) ? "text-ink bg-soft" : ""
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={onCommand}
            className="flex items-center gap-2 bg-soft hover:bg-soft text-muted px-3 py-1.5 rounded-lg border border-line text-xs font-mono"
          >
            <span className="hidden sm:inline">Search</span>
            <span className="hidden sm:inline-block bg-page text-muted border border-line rounded px-1 text-[10px]">⌘K</span>
          </button>
          <button
            type="button"
            onClick={() => go("#contact")}
            className="flex items-center gap-1.5 bg-accent text-accent-fg hover:opacity-90 px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            Hire Me
          </button>
          <Link
            to="/admin"
            className="p-2 bg-soft hover:bg-soft text-muted hover:text-ink border border-line rounded-lg"
            title="Admin panel"
          >
            <svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
