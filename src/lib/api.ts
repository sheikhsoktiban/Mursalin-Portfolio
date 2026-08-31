import type { GuestNote, InboxMessage, Profile, Project } from "../types"
import { SEED_GUESTS, SEED_INBOX, SEED_PROFILE, SEED_PROJECTS } from "./seed"
import { isSupabaseConfigured, supabase } from "./supabase"

const KEYS = {
profile: "mm_profile",
projects: "mm_projects",
guestbook: "mm_guestbook",
inbox: "mm_inbox",
} as const

function readLs<T>(key: string, fallback: T): T {
try {
const raw = localStorage.getItem(key)
return raw ? (JSON.parse(raw) as T) : fallback
} catch {
return fallback
}
}

function writeLs(key: string, value: unknown) {
localStorage.setItem(key, JSON.stringify(value))
}

function asProject(row: Record<string, unknown>): Project {
return {
id: String(row.id),
title: String(row.title ?? ""),
category: row.category as Project["category"],
description: String(row.description ?? ""),
highlights: Array.isArray(row.highlights) ? (row.highlights as string[]) : [],
tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
github: String(row.github ?? ""),
stars: Number(row.stars ?? 0),
sort_order: Number(row.sort_order ?? 0),
}
}

function asGuest(row: Record<string, unknown>): GuestNote {
return {
id: String(row.id),
name: String(row.name ?? ""),
role: String(row.role ?? ""),
message: String(row.message ?? ""),
emoji: String(row.emoji ?? "🚀"),
tag: String(row.tag ?? "Guest"),
created_at: String(row.created_at ?? new Date().toISOString()),
}
}

function asMessage(row: Record<string, unknown>): InboxMessage {
return {
id: String(row.id),
name: String(row.name ?? ""),
email: String(row.email ?? ""),
category: String(row.category ?? row.service_category ?? ""),
subject: String(row.subject ?? ""),
message: String(row.message ?? ""),
read: Boolean(row.read),
created_at: String(row.created_at ?? new Date().toISOString()),
}
}

export const api = {
configured: isSupabaseConfigured,

async loadProfile(): Promise<Profile> {
if (supabase) {
const { data, error } = await supabase
.from("profile")
.select("*")
.limit(1)
.maybeSingle()

```
  if (!error && data) return data as Profile
}

return readLs(KEYS.profile, SEED_PROFILE)
```

},

async saveProfile(profile: Profile): Promise<Profile> {
if (supabase) {
const { data, error } = await supabase
.from("profile")
.upsert({
...profile,
updated_at: new Date().toISOString(),
})
.select()
.single()

```
  if (error) throw error
  return data as Profile
}

writeLs(KEYS.profile, profile)
return profile
```

},

async loadProjects(): Promise<Project[]> {
if (supabase) {
const { data, error } = await supabase
.from("projects")
.select("*")
.order("sort_order", { ascending: true })

```
  if (!error && data) {
    return (data as Record<string, unknown>[]).map(asProject)
  }
}

return readLs(KEYS.projects, SEED_PROJECTS)
```

},

async saveProject(project: Project): Promise<Project> {
if (supabase) {
const payload: Record<string, unknown> = { ...project }

```
  if (!project.id) delete payload.id

  const { data, error } = await supabase
    .from("projects")
    .upsert(payload)
    .select()
    .single()

  if (error) throw error
  return asProject(data as Record<string, unknown>)
}

const list = readLs(KEYS.projects, SEED_PROJECTS)

if (!project.id) {
  const created = {
    ...project,
    id: crypto.randomUUID(),
  }

  writeLs(KEYS.projects, [created, ...list])
  return created
}

const next = list.some((p) => p.id === project.id)
  ? list.map((p) => (p.id === project.id ? project : p))
  : [project, ...list]

writeLs(KEYS.projects, next)
return project
```

},

async deleteProject(id: string): Promise<void> {
if (supabase) {
const { error } = await supabase
.from("projects")
.delete()
.eq("id", id)

```
  if (error) throw error
  return
}

writeLs(
  KEYS.projects,
  readLs(KEYS.projects, SEED_PROJECTS).filter((p) => p.id !== id),
)
```

},

async starProject(id: string): Promise<number> {
if (supabase) {
const { data, error } = await supabase.rpc(
"increment_project_stars",
{ pid: id },
)

```
  if (error) throw error
  return Number(data ?? 0)
}

const list = readLs(KEYS.projects, SEED_PROJECTS).map((p) =>
  p.id === id
    ? { ...p, stars: p.stars + 1 }
    : p,
)

writeLs(KEYS.projects, list)

return list.find((p) => p.id === id)?.stars ?? 0
```

},

async loadGuestbook(): Promise<GuestNote[]> {
if (supabase) {
const { data, error } = await supabase
.from("guestbook")
.select("*")
.order("created_at", { ascending: false })

```
  if (!error && data) {
    return (data as Record<string, unknown>[]).map(asGuest)
  }
}

return readLs(KEYS.guestbook, SEED_GUESTS)
```

},

async addGuest(
note: Omit<GuestNote, "id" | "created_at">,
): Promise<GuestNote> {
if (supabase) {
const { data, error } = await supabase
.from("guestbook")
.insert(note)
.select()
.single()

```
  if (error) throw error
  return asGuest(data as Record<string, unknown>)
}

const created: GuestNote = {
  ...note,
  id: crypto.randomUUID(),
  created_at: new Date().toISOString(),
}

writeLs(
  KEYS.guestbook,
  [created, ...readLs(KEYS.guestbook, SEED_GUESTS)],
)

return created
```

},

async deleteGuest(id: string): Promise<void> {
if (supabase) {
const { error } = await supabase
.from("guestbook")
.delete()
.eq("id", id)

```
  if (error) throw error
  return
}

writeLs(
  KEYS.guestbook,
  readLs(KEYS.guestbook, SEED_GUESTS).filter(
    (g) => g.id !== id,
  ),
)
```

},

async loadInbox(): Promise<InboxMessage[]> {
if (supabase) {
const { data, error } = await supabase
.from("messages")
.select("*")
.order("created_at", { ascending: false })

```
  if (error) return []

  return (data as Record<string, unknown>[]).map(asMessage)
}

return readLs(KEYS.inbox, SEED_INBOX)
```

},

async addMessage(
msg: Omit<InboxMessage, "id" | "created_at" | "read">,
): Promise<InboxMessage> {
if (supabase) {
const { data, error } = await supabase
.from("messages")
.insert({
name: msg.name,
email: msg.email,
subject: msg.subject,
message: msg.message,
service_category: msg.category,
read: false,
})
.select()
.single()

```
  if (error) {
    console.error("Supabase message error:", error)
    throw new Error(error.message)
  }

  return asMessage(data as Record<string, unknown>)
}

const created: InboxMessage = {
  ...msg,
  id: crypto.randomUUID(),
  read: false,
  created_at: new Date().toISOString(),
}

writeLs(
  KEYS.inbox,
  [created, ...readLs(KEYS.inbox, SEED_INBOX)],
)

return created
```

},

async deleteMessage(id: string): Promise<void> {
if (supabase) {
const { error } = await supabase
.from("messages")
.delete()
.eq("id", id)

```
  if (error) throw error
  return
}

writeLs(
  KEYS.inbox,
  readLs(KEYS.inbox, SEED_INBOX).filter(
    (m) => m.id !== id,
  ),
)
```

},

async resetContent(): Promise<void> {
if (supabase) {
await supabase
.from("projects")
.delete()
.neq(
"id",
"00000000-0000-0000-0000-000000000000",
)

```
  await supabase
    .from("profile")
    .upsert(SEED_PROFILE)

  for (const p of SEED_PROJECTS) {
    await supabase
      .from("projects")
      .upsert(p)
  }

  return
}

writeLs(KEYS.profile, SEED_PROFILE)
writeLs(KEYS.projects, SEED_PROJECTS)
```

},
}
