import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context"

export function AdminLogin() {
  const { ready, signIn, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState<"pass" | "google" | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setBusy("pass")
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password.")
    } finally {
      setBusy(null)
    }
  }

  const google = async () => {
    setError("")
    setBusy("google")
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in is unavailable.")
      setBusy(null)
    }
  }

  return (
    <div className="admin-portal relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">
      <Starfield />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,47,73,0.35),transparent_58%)]" />
      <div className="relative w-full max-w-[440px]">
        <div className="admin-portal-card rounded-[28px] px-7 py-9 sm:px-9 sm:py-10">
          <div className="flex justify-center mb-6">
            <div className="admin-shield w-14 h-14 rounded-2xl flex items-center justify-center">
              <ShieldIcon />
            </div>
          </div>
          <h1 className="text-center text-[1.65rem] sm:text-[1.85rem] font-extrabold tracking-tight text-white">
            Admin Control Portal
          </h1>
          <p className="mt-2 text-center text-[13px] text-slate-400">
            Secure authentication for Mohammad Mursalin
          </p>

          {!ready ? (
            <div className="mt-10 flex justify-center">
              <span className="w-6 h-6 rounded-full border-2 border-cyan-400/30 border-t-cyan-300 animate-spin" />
            </div>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={submit}>
              <label className="block">
                <span className="block text-[12px] text-slate-300 mb-1.5">Admin Email</span>
                <span className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-500">
                    <MailIcon />
                  </span>
                  <input
                    type="email"
                    autoComplete="username"
                    required
                    placeholder="admin@yourdomain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="admin-field w-full h-11 rounded-xl pl-10 pr-3 text-[13px] text-slate-100 placeholder:text-slate-500"
                  />
                </span>
              </label>
              <label className="block">
                <span className="block text-[12px] text-slate-300 mb-1.5">Master Password</span>
                <span className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-500">
                    <KeyIcon />
                  </span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-field w-full h-11 rounded-xl pl-10 pr-3 text-[13px] text-slate-100 placeholder:text-slate-500"
                  />
                </span>
              </label>

              {error && (
                <p className="text-[12px] text-rose-300 text-center" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy !== null}
                className="w-full h-12 rounded-xl bg-[#22d3ee] hover:bg-[#67e8f9] text-[#04202a] text-[13px] font-bold tracking-wide transition-colors disabled:opacity-70"
              >
                {busy === "pass" ? "Signing in…" : "Sign In To Dashboard"}
              </button>

              <div className="flex items-center gap-3 py-1.5">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-slate-500 whitespace-nowrap">
                  Or OAuth Provider
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                disabled={busy !== null}
                onClick={google}
                className="w-full h-12 rounded-xl border border-white/10 bg-[#071422] hover:bg-[#0c1c2e] text-slate-200 text-[13px] font-semibold flex items-center justify-center gap-2.5 transition-colors disabled:opacity-70"
              >
                <SparkleIcon />
                {busy === "google" ? "Redirecting…" : "Authenticate with Google OAuth"}
              </button>
            </form>
          )}

          <p className="mt-7 text-center text-[11px] text-slate-500 leading-relaxed">
            Use the admin account created in Supabase Authentication.
          </p>
        </div>
        <p className="mt-5 text-center">
          <Link to="/" className="text-[11px] text-slate-500 hover:text-cyan-300 font-mono">
            ← Return to site
          </Link>
        </p>
      </div>
    </div>
  )
}

function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const stars = Array.from({ length: 72 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.3 + 0.35,
      phase: Math.random() * Math.PI * 2,
    }))

    let raf = 0
    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const pts = stars.map((s) => ({
        x: s.x * w,
        y: s.y * h,
        r: s.r,
        a: 0.28 + 0.5 * (0.5 + 0.5 * Math.sin(s.phase + performance.now() / 1400)),
      }))

      const max = 150
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.hypot(dx, dy)
          if (d > max) continue
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.16 * (1 - d / max)})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(pts[i].x, pts[i].y)
          ctx.lineTo(pts[j].x, pts[j].y)
          ctx.stroke()
        }
      }

      for (const p of pts) {
        ctx.fillStyle = `rgba(165, 243, 252, ${p.a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.2 19.5 6v5.4c0 4.7-3.1 8.1-7.5 9.4C7.6 19.5 4.5 16.1 4.5 11.4V6L12 3.2Z"
        stroke="#22d3ee"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7.2 12 13l8-5.8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="14" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11 14h9.2l-2.1 2.1M16.2 14v2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.2 9.1 6.9 14.8 8 9.1 9.1 8 14.8 6.9 9.1 1.2 8 6.9 6.9Z" fill="url(#g-spark)" />
      <defs>
        <linearGradient id="g-spark" x1="1" y1="1" x2="15" y2="15">
          <stop stopColor="#22d3ee" />
          <stop offset="0.45" stopColor="#4ade80" />
          <stop offset="0.75" stopColor="#facc15" />
          <stop offset="1" stopColor="#f87171" />
        </linearGradient>
      </defs>
    </svg>
  )
}
