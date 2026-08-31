import type { ReactNode } from "react"

export const fieldClass =
  "w-full bg-page border border-line rounded-xl px-3.5 py-2 text-xs text-ink placeholder-muted focus:outline-none focus:border-ink/40"

export function SectionHead({
  kicker,
  kickerClass,
  icon,
  title,
  subtitle,
}: {
  kicker: string
  kickerClass?: string
  icon: ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-14">
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono ${kickerClass ?? "bg-soft border border-line text-muted"}`}>
        {icon}
        {kicker}
      </span>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">{title}</h2>
      <p className="text-muted max-w-2xl text-sm sm:text-base">{subtitle}</p>
    </div>
  )
}
