import { SectionHead } from "../components/ui"
import { useSite } from "../context"

const STRENGTHS = [
  "Java, Spring Boot, Spring Security, Hibernate / JPA",
  "JWT, OAuth2, and role-based REST APIs",
  "PostgreSQL, MongoDB, and WebSocket systems",
  "LangChain, FastAPI, Docker, and LLM pipelines",
]

export function About() {
  const { profile } = useSite()
  return (
    <section id="about" className="py-20 bg-page border-t border-b border-line">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHead
          kicker="About Me"
          kickerClass="bg-soft border border-line text-muted"
          icon={<span>◆</span>}
          title="Engineering Secure Backend Systems"
          subtitle="Bridging clean Java architecture with real-time services and LangChain-powered AI."
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          <aside className="lg:col-span-4 flex justify-center lg:justify-start">
            <figure className="relative w-[210px] group">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-line group-hover:translate-x-4 group-hover:translate-y-4 transition-transform" />
              <div className="relative rounded-2xl overflow-hidden border border-line bg-card shadow-2xl">
                <img
                  src={profile.portrait_url || "/portrait.jpg"}
                  alt={`${profile.first_name} ${profile.last_name}`}
                  className="w-full h-[250px] object-cover object-[center_12%] grayscale-[15%] group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-500"
                />
              </div>
              <figcaption className="relative mt-5 space-y-1">
                <p className="text-ink font-bold">
                  {profile.first_name} {profile.last_name}
                </p>
                <p className="text-xs font-mono text-muted">{profile.role}</p>
                <p className="text-[11px] text-muted font-mono">{profile.photo_meta}</p>
              </figcaption>
            </figure>
          </aside>
          <article className="lg:col-span-8 bg-card border border-line rounded-3xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-ink mb-4">Background &amp; Philosophy</h3>
            <p className="text-muted text-sm leading-relaxed">{profile.about}</p>
            <div className="space-y-3 pt-6">
              <p className="text-xs font-mono uppercase tracking-wider text-muted font-bold">Key Strengths</p>
              {STRENGTHS.map((s) => (
                <p key={s} className="text-xs text-muted">▹ {s}</p>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-line/80 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-muted block">Location</span>
                <span className="text-ink">{profile.location}</span>
              </div>
              <div>
                <span className="text-muted block">Contact</span>
                <a href={`mailto:${profile.email}`} className="text-muted hover:underline">
                  {profile.email}
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
