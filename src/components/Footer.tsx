import { useSite } from "../context"

export function Footer() {
  const { profile } = useSite()
  return (
    <footer className="bg-page border-t border-line py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-line">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-card border border-line flex items-center justify-center text-ink font-bold font-mono">
              MM
            </span>
            <div>
              <p className="text-ink font-bold text-sm">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-xs text-muted font-mono">Vite + React + TypeScript · Supabase backend</p>
            </div>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted font-mono gap-4">
          <p>
            © {new Date().getFullYear()} {profile.first_name} {profile.last_name} · Bangladesh
          </p>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-ink">About</a>
            <a href="#projects" className="hover:text-ink">Projects</a>
            <a href="#contact" className="hover:text-ink">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
