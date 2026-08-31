import { useEffect, useState } from "react"
import { Footer } from "../components/Footer"
import { CommandPalette, ProjectModal, ResumeModal } from "../components/Modals"
import { Nav } from "../components/Nav"
import { About } from "../sections/About"
import { Contact } from "../sections/Contact"
import { Experience } from "../sections/Experience"
import { Guestbook } from "../sections/Guestbook"
import { Hero } from "../sections/Hero"
import { Projects } from "../sections/Projects"
import { Skills } from "../sections/Skills"
import { Terminal } from "../sections/Terminal"
import type { Project } from "../types"

export function Home() {
  const [cmdk, setCmdk] = useState(false)
  const [resume, setResume] = useState(false)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCmdk((v) => !v)
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault()
        window.location.hash = "#/admin"
      }
      if (e.key === "Escape") {
        setCmdk(false)
        setResume(false)
        setProject(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (window.location.hash) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    }
  }, [])

  return (
    <div className="min-h-screen bg-page text-ink">
      <Nav onCommand={() => setCmdk(true)} />
      <main id="top">
        <Hero onResume={() => setResume(true)} />
        <About />
        <Experience />
        <Projects onOpen={setProject} />
        <Skills />
        <Terminal onResume={() => setResume(true)} />
        <Guestbook />
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={cmdk} onClose={() => setCmdk(false)} onResume={() => setResume(true)} />
      <ProjectModal project={project} onClose={() => setProject(null)} />
      <ResumeModal open={resume} onClose={() => setResume(false)} />
    </div>
  )
}
