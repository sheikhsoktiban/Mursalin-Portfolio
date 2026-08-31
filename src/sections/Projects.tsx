import { useMemo, useState } from "react"
import { SectionHead } from "../components/ui"
import { useSite } from "../context"
import { CAT_LABELS, type Project, type ProjectCategory } from "../types"

const FILTERS: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fullstack", label: "Full-Stack" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI / ML" },
  { id: "realtime", label: "Real-Time" },
]

export function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  const { projects, starProject } = useSite()
  const [filter, setFilter] = useState<"all" | ProjectCategory>("all")
  const [query, setQuery] = useState("")
  const list = useMemo(() => {
    const q = query.toLowerCase()
    return projects.filter((p) => {
      const okF = filter === "all" || p.category === filter
      const okQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      return okF && okQ
    })
  }, [projects, filter, query])

  return (
    <section id="projects" className="py-20 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHead
          kicker="Featured Portfolio Work"
          kickerClass="bg-soft border border-line text-muted"
          icon={<span>◆</span>}
          title="Projects & Open Source Architecture"
          subtitle="Explore live systems across commerce, AI, messaging, and operations backends."
        />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-card p-3 rounded-2xl border border-line">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono border ${
                  filter === f.id
                    ? "border-line bg-soft text-muted"
                    : "border-line text-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects or tech..."
            className="w-full md:w-64 bg-page/80 border border-line rounded-xl px-3 py-1.5 text-xs text-ink font-mono focus:outline-none focus:border-line"
          />
        </div>
        {list.length === 0 ? (
          <p className="py-16 text-center text-muted font-mono text-sm border border-dashed border-line rounded-2xl">
            No projects found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p) => (
              <article
                key={p.id}
                onClick={() => onOpen(p)}
                className="bg-card border border-line rounded-2xl p-6 hover:border-line cursor-pointer hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-soft text-muted border border-line font-mono">
                    {CAT_LABELS[p.category]}
                  </span>
                  <button
                    type="button"
                    className="font-mono text-muted hover:text-amber-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      void starProject(p.id)
                    }}
                  >
                    ★ {p.stars}
                  </button>
                </div>
                <h3 className="text-xl font-bold text-ink mb-3">{p.title}</h3>
                <p className="text-muted text-xs leading-relaxed line-clamp-3">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-line">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-soft text-muted text-[10px] font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
