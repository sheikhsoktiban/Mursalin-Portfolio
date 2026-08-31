import { useTheme, type ThemeMode } from "../theme"

const MODES: { id: ThemeMode; label: string; icon: string }[] = [
  { id: "light", label: "Light", icon: "☀" },
  { id: "system", label: "System", icon: "◐" },
  { id: "dark", label: "Dark", icon: "☾" },
]

export function ThemeToggle() {
  const { mode, setMode } = useTheme()
  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-lg border border-line bg-soft"
      role="group"
      aria-label="Color theme"
    >
      {MODES.map((m) => {
        const on = mode === m.id
        return (
          <button
            key={m.id}
            type="button"
            title={`${m.label} mode`}
            aria-pressed={on}
            onClick={() => setMode(m.id)}
            className={`w-7 h-7 rounded-md text-[11px] leading-none flex items-center justify-center transition-colors ${
              on ? "bg-accent text-accent-fg" : "text-muted hover:text-ink"
            }`}
          >
            <span className="sr-only">{m.label}</span>
            <span aria-hidden="true">{m.icon}</span>
          </button>
        )
      })}
    </div>
  )
}
