import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type ThemeMode = "light" | "dark" | "system"

const KEY = "mm_color_mode"

type ThemeCtx = {
  mode: ThemeMode
  resolved: "light" | "dark"
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeCtx | null>(null)

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function resolve(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") return prefersDark() ? "dark" : "light"
  return mode
}

export function applyTheme(mode: ThemeMode) {
  const resolved = resolve(mode)
  document.documentElement.classList.toggle("dark", resolved === "dark")
  document.documentElement.classList.toggle("light", resolved === "light")
  document.documentElement.style.colorScheme = resolved
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute("content", resolved === "dark" ? "#000000" : "#f4f4f1")
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved === "light" || saved === "dark" || saved === "system") return saved
    } catch {
      /* ignore */
    }
    return "dark"
  })

  useEffect(() => {
    applyTheme(mode)
    try {
      localStorage.setItem(KEY, mode)
    } catch {
      /* ignore */
    }
  }, [mode])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      if (mode === "system") applyTheme("system")
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [mode])

  const value = useMemo<ThemeCtx>(
    () => ({
      mode,
      resolved: resolve(mode),
      setMode: setModeState,
    }),
    [mode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return ctx
}
