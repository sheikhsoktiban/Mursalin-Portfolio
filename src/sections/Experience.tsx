import { SectionHead } from "../components/ui"

export function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHead
          kicker="Career Path"
          kickerClass="bg-soft border border-line text-muted"
          icon={<span>◆</span>}
          title="Work Experience & Featured Milestones"
          subtitle="Hands-on systems across commerce, messaging, health queues, and AI document pipelines."
        />
        <div className="max-w-4xl mx-auto relative pl-6 sm:pl-8 border-l border-line space-y-12">
          <article className="relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-page border-2 border-line" />
            <div className="bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-3">
              <h3 className="text-xl font-bold text-ink">
                Backend Software Engineer <span className="text-muted text-base">@ Independent Systems</span>
              </h3>
              <p className="text-xs font-mono text-muted">Ongoing · Bangladesh / Remote</p>
              <p className="text-muted text-sm">Designing production-shaped backends for commerce, chat, hospital queues, and complaint workflows.</p>
            </div>
          </article>
          <article className="relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-page border-2 border-line" />
            <div className="bg-card border border-line rounded-2xl p-6 sm:p-8 space-y-3">
              <h3 className="text-xl font-bold text-ink">
                B.Sc. Information and Communication Engineering <span className="text-muted text-base">@ PUST</span>
              </h3>
              <p className="text-xs font-mono text-muted">Expected 2027 · Pabna, Bangladesh</p>
              <p className="text-muted text-sm">Systems, networks, and computation — applied in Spring backends, data stores, and AI tooling.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
