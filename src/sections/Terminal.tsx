import { useRef, useState, type FormEvent } from "react"
import { SectionHead } from "../components/ui"
import { useSite } from "../context"

export function Terminal({ onResume }: { onResume: () => void }) {
  const { profile, projects } = useSite()
  const [lines, setLines] = useState([
    `Welcome to ${profile.first_name} ${profile.last_name}'s CLI v2.4 — type help`,
  ])
  const [value, setValue] = useState("")
  const outRef = useRef<HTMLDivElement>(null)
  const print = (t: string) => {
    setLines((c) => [...c, t])
    requestAnimationFrame(() => {
      if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
    })
  }
  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    print(`guest@mursalin:~$ ${raw}`)
    if (!cmd || cmd === "help") print("help, about, projects, skills, contact, cat resume, socials, clear")
    else if (cmd === "about") print(`${profile.first_name} ${profile.last_name} · ${profile.role}`)
    else if (cmd === "projects") print(projects.map((p) => "• " + p.title).join(" | "))
    else if (cmd === "skills") print("Java · Spring Boot · JWT · OAuth2 · PostgreSQL · LangChain")
    else if (cmd === "contact") print(`${profile.email} · ${profile.phone}`)
    else if (cmd === "cat resume") {
      print(profile.role)
      onResume()
    } else if (cmd === "socials") print(`${profile.github} · ${profile.linkedin}`)
    else if (cmd === "clear") setLines([])
    else print(`Command not recognized: ${raw}`)
  }
  return (
    <section id="terminal" className="py-20 border-t border-line">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHead
          kicker="Interactive Console"
          kickerClass="bg-soft border border-line text-muted"
          icon={<span>◆</span>}
          title="Developer CLI Mode"
          subtitle="Prefer a terminal interface? Interact with my resume and portfolio via command line."
        />
        <div className="max-w-3xl mx-auto bg-page border border-line rounded-2xl overflow-hidden font-mono text-sm">
          <div className="bg-card px-4 py-3 border-b border-line flex items-center justify-between">
            <span className="text-xs text-muted font-bold">guest@mursalin:~</span>
            <button type="button" onClick={() => setLines([])} className="text-xs text-muted">
              Clear
            </button>
          </div>
          <div ref={outRef} className="p-4 space-y-2 max-h-96 overflow-y-auto term-scroll text-xs text-muted">
            {lines.map((l, i) => (
              <p key={i}>{l}</p>
            ))}
          </div>
          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              const v = value
              setValue("")
              run(v)
            }}
            className="flex items-center gap-2 px-4 pb-4"
          >
            <span className="text-muted text-xs font-bold">guest@mursalin:~$</span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-transparent text-ink text-xs focus:outline-none"
              placeholder="type help"
            />
          </form>
        </div>
      </div>
    </section>
  )
}
