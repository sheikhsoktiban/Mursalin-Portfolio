import { useState } from "react"
import { SectionHead } from "../components/ui"
import { SKILL_GROUPS, type SkillTab } from "../types"

const TABS: { id: SkillTab; label: string }[] = [
  { id: "backend", label: "Backend" },
  { id: "data", label: "Data" },
  { id: "ai", label: "AI & DevOps" },
  { id: "web", label: "Web & Tools" },
]

export function Skills() {
  const [tab, setTab] = useState<SkillTab>("backend")
  return (
    <section id="skills" className="py-20 bg-page">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHead
          kicker="Technical Proficiency"
          kickerClass="bg-soft border border-line text-muted"
          icon={<span>◆</span>}
          title="Skills & Technology Matrix"
          subtitle="Modern tools I use to engineer robust backend and AI systems."
        />
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap gap-2 bg-card/90 p-1.5 rounded-2xl border border-line">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${tab === t.id ? "bg-accent text-accent-fg" : "text-muted"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_GROUPS[tab].map((s) => (
            <article key={s.name} className="bg-card border border-line rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-ink">{s.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-soft text-muted border border-line">
                  {s.level}
                </span>
              </div>
              <div className="w-full h-2 bg-page rounded-full overflow-hidden border border-line">
                <div className="h-full bg-gradient-to-r from-muted via-ink to-muted rounded-full" style={{ width: `${s.pct}%` }} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
