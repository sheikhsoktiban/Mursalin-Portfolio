import { useState, type FormEvent } from "react"
import { fieldClass, SectionHead } from "../components/ui"
import { useSite } from "../context"

const EMOJIS = ["🚀", "💻", "🔥", "✨", "⚡", "🧠", "🌟", "🎯"]
const TAGS = ["Developer", "Recruiter", "Founder", "Peer", "Fan"]

export function Guestbook() {
  const { guestbook, addGuest, configured } = useSite()
  const [emoji, setEmoji] = useState("🚀")
  const [tag, setTag] = useState("Developer")
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState("")

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErr("")
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get("name") || "").trim()
    const role = String(fd.get("role") || "").trim()
    const message = String(fd.get("message") || "").trim()
    if (name.length < 2 || message.length < 4) return
    try {
      await addGuest({ name, role, message, emoji, tag })
      e.currentTarget.reset()
      setOk(true)
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not post")
    }
  }

  return (
    <section id="guestbook" className="py-20 bg-page border-t border-line">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHead
          kicker="Public Guestbook"
          kickerClass="bg-soft border border-line text-muted"
          icon={<span>◆</span>}
          title="Leave a Note on the Wall of Love"
          subtitle={configured ? "Signatures are stored in Supabase." : "Connect Supabase to persist across devices."}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={onSubmit} className="lg:col-span-5 bg-card border border-line rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-ink">Sign the Guestbook</h3>
            {ok && <p className="text-xs text-muted font-mono">Thanks — your note is on the wall.</p>}
            {err && <p className="text-xs text-muted font-mono">{err}</p>}
            <input name="name" required placeholder="Your name" className={fieldClass} />
            <input name="role" placeholder="@github · Recruiter" className={fieldClass} />
            <div className="flex gap-1.5 flex-wrap">
              {EMOJIS.map((em) => (
                <button key={em} type="button" onClick={() => setEmoji(em)} className={`w-8 h-8 rounded-lg border ${em === emoji ? "border-line bg-soft" : "border-line"}`}>
                  {em}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((t) => (
                <button key={t} type="button" onClick={() => setTag(t)} className={`px-2 py-1 rounded-lg text-[10px] font-mono border ${t === tag ? "border-line text-muted" : "border-line text-muted"}`}>
                  {t}
                </button>
              ))}
            </div>
            <textarea name="message" required rows={4} placeholder="Great portfolio..." className={fieldClass} />
            <button className="w-full py-3 rounded-xl bg-accent text-accent-fg text-xs font-semibold">Post to Guestbook</button>
          </form>
          <div className="lg:col-span-7 space-y-4">
            {guestbook.length === 0 ? (
              <div className="py-12 text-center text-muted font-mono text-xs border border-dashed border-line rounded-2xl">Be the first to sign!</div>
            ) : (
              guestbook.map((g) => (
                <article key={g.id} className="bg-card border border-line rounded-2xl p-4 space-y-2">
                  <p className="font-bold text-ink text-sm">
                    {g.emoji} {g.name} <span className="text-[10px] font-mono text-muted">{g.tag}</span>
                  </p>
                  <p className="text-muted text-xs">{g.message}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
