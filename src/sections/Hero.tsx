import { Typewriter } from "../components/Typewriter"
import { useSite } from "../context"

const ROLES = [
  "Backend Software Engineer",
  "Java & Spring Boot Developer",
  "REST · JWT · OAuth2",
  "LangChain & AI Systems",
]

export function Hero({ onResume }: { onResume: () => void }) {
  const { profile } = useSite()
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="hero-glow absolute top-[18%] left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-page to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-page/70 border border-line text-ink text-xs font-mono backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ink opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ink" />
            </span>
            {profile.badge}
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-ink tracking-tight leading-none">
            Hi, I'm {profile.first_name}
            <span className="name-sheen block text-transparent bg-clip-text">
              {profile.last_name}
            </span>
          </h1>
          <div className="h-10 flex items-center justify-center">
            <Typewriter words={ROLES} />
          </div>
          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">{profile.bio}</p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl bg-accent text-accent-fg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Explore Projects
            </a>
            <button
              type="button"
              onClick={onResume}
              className="px-6 py-3 rounded-xl bg-soft text-ink border border-line font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              View Resume (PDF)
            </button>
            <a
              href="#terminal"
              className="px-5 py-3 rounded-xl text-muted border border-line font-mono text-xs hover:text-ink hover:border-ink/30 transition-colors"
            >
              Open CLI
            </a>
          </div>
          <div className="pt-6 flex items-center justify-center gap-5 text-muted">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-page border border-line hover:text-ink hover:border-ink/40"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-page border border-line hover:text-ink hover:border-ink/40"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="p-2.5 rounded-full bg-page border border-line hover:text-ink hover:border-ink/40"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
