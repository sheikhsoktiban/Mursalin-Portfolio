import { useEffect, useState } from "react"

export function Typewriter({ words }: { words: string[] }) {
  const [ri, setRi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {
    const word = words[ri] ?? ""
    let delay = del ? 36 : 70
    if (!del && ci === word.length) delay = 1400
    const t = window.setTimeout(() => {
      if (!del && ci < word.length) setCi((c) => c + 1)
      else if (!del && ci === word.length) setDel(true)
      else if (del && ci > 0) setCi((c) => c - 1)
      else {
        setDel(false)
        setRi((r) => (r + 1) % words.length)
      }
    }, delay)
    return () => window.clearTimeout(t)
  }, [ci, del, ri, words])

  return (
    <p className="text-xl sm:text-2xl font-mono text-muted font-medium">
      <span>{(words[ri] ?? "").slice(0, ci)}</span>
      <span className="animate-pulse text-ink font-bold">|</span>
    </p>
  )
}
