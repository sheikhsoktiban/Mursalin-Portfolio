export type ProjectCategory = "fullstack" | "backend" | "ai" | "realtime"

export type Profile = {
  id: string
  first_name: string
  last_name: string
  role: string
  badge: string
  bio: string
  about: string
  location: string
  email: string
  phone: string
  github: string
  linkedin: string
  photo_meta: string
  portrait_url: string
  updated_at?: string
}

export type Project = {
  id: string
  title: string
  category: ProjectCategory
  description: string
  highlights: string[]
  tags: string[]
  github: string
  stars: number
  sort_order: number
}

export type GuestNote = {
  id: string
  name: string
  role: string
  message: string
  emoji: string
  tag: string
  created_at: string
}

export type InboxMessage = {
  id: string
  name: string
  email: string
  category: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export const CAT_LABELS: Record<ProjectCategory, string> = {
  fullstack: "Full-Stack",
  backend: "Backend",
  ai: "AI / ML",
  realtime: "Real-Time",
}

export const SKILL_GROUPS = {
  backend: [
    { name: "Java", level: "Expert", pct: 92 },
    { name: "Spring Boot", level: "Expert", pct: 90 },
    { name: "Spring Security / JWT / OAuth2", level: "Advanced", pct: 86 },
    { name: "Hibernate / JPA", level: "Advanced", pct: 84 },
    { name: "FastAPI", level: "Advanced", pct: 78 },
    { name: "WebSockets", level: "Advanced", pct: 82 },
  ],
  data: [
    { name: "PostgreSQL", level: "Advanced", pct: 85 },
    { name: "MongoDB", level: "Advanced", pct: 80 },
    { name: "REST API design", level: "Expert", pct: 90 },
    { name: "Schema & layered architecture", level: "Advanced", pct: 84 },
  ],
  ai: [
    { name: "LangChain & LLM APIs", level: "Advanced", pct: 80 },
    { name: "Python", level: "Advanced", pct: 82 },
    { name: "Docker", level: "Advanced", pct: 78 },
    { name: "Git / Maven", level: "Expert", pct: 88 },
  ],
  web: [
    { name: "HTML / CSS / JavaScript", level: "Advanced", pct: 80 },
    { name: "React (working clients)", level: "Intermediate", pct: 68 },
    { name: "Postman", level: "Advanced", pct: 86 },
    { name: "IntelliJ IDEA / VS Code", level: "Expert", pct: 90 },
  ],
} as const

export type SkillTab = keyof typeof SKILL_GROUPS
