import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { api } from "./lib/api"
import { supabase } from "./lib/supabase"
import { SEED_PROFILE, SEED_PROJECTS } from "./lib/seed"
import type { GuestNote, InboxMessage, Profile, Project } from "./types"

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)?.trim().toLowerCase()

type AuthUser = { email: string }

type SiteCtx = {
  profile: Profile
  projects: Project[]
  guestbook: GuestNote[]
  inbox: InboxMessage[]
  loading: boolean
  configured: boolean
  refresh: () => Promise<void>
  updateProfile: (p: Profile) => Promise<void>
  upsertProject: (p: Project) => Promise<void>
  removeProject: (id: string) => Promise<void>
  starProject: (id: string) => Promise<void>
  addGuest: (note: Omit<GuestNote, "id" | "created_at">) => Promise<void>
  removeGuest: (id: string) => Promise<void>
  addMessage: (msg: Omit<InboxMessage, "id" | "created_at" | "read">) => Promise<void>
  removeMessage: (id: string) => Promise<void>
  resetContent: () => Promise<void>
}

type AuthCtx = {
  user: AuthUser | null
  ready: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const SiteContext = createContext<SiteCtx | null>(null)
const AuthContext = createContext<AuthCtx | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(SEED_PROFILE)
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS)
  const [guestbook, setGuestbook] = useState<GuestNote[]>([])
  const [inbox, setInbox] = useState<InboxMessage[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [p, pr, g] = await Promise.all([api.loadProfile(), api.loadProjects(), api.loadGuestbook()])
    setProfile(p)
    setProjects(pr)
    setGuestbook(g)
    setInbox(await api.loadInbox())
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const value = useMemo<SiteCtx>(
    () => ({
      profile,
      projects,
      guestbook,
      inbox,
      loading,
      configured: api.configured,
      refresh,
      updateProfile: async (p) => setProfile(await api.saveProfile(p)),
      upsertProject: async (p) => {
        const saved = await api.saveProject(p)
        setProjects((curr) => {
          const i = curr.findIndex((x) => x.id === saved.id)
          if (i >= 0) {
            const next = [...curr]
            next[i] = saved
            return next
          }
          return [saved, ...curr]
        })
      },
      removeProject: async (id) => {
        await api.deleteProject(id)
        setProjects((curr) => curr.filter((p) => p.id !== id))
      },
      starProject: async (id) => {
        const n = await api.starProject(id)
        setProjects((curr) => curr.map((p) => (p.id === id ? { ...p, stars: n } : p)))
      },
      addGuest: async (note) => {
        const created = await api.addGuest(note)
        setGuestbook((curr) => [created, ...curr])
      },
      removeGuest: async (id) => {
        await api.deleteGuest(id)
        setGuestbook((curr) => curr.filter((g) => g.id !== id))
      },
      addMessage: async (msg) => {
        const created = await api.addMessage(msg)
        setInbox((curr) => [created, ...curr])
      },
      removeMessage: async (id) => {
        await api.deleteMessage(id)
        setInbox((curr) => curr.filter((m) => m.id !== id))
      },
      resetContent: async () => {
        await api.resetContent()
        await refresh()
      },
    }),
    [profile, projects, guestbook, inbox, loading, refresh],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return
    }

    const client = supabase

    client.auth.getSession().then(async ({ data }) => {
      const email = data.session?.user?.email?.trim().toLowerCase()

      if (email && ADMIN_EMAIL && email !== ADMIN_EMAIL) {
        await client.auth.signOut()
        setUser(null)
      } else {
        setUser(email ? { email } : null)
      }

      setReady(true)
    })

    const { data } = client.auth.onAuthStateChange((_e, session) => {
      const email = session?.user?.email?.trim().toLowerCase()
      if (email && ADMIN_EMAIL && email !== ADMIN_EMAIL) {
        setUser(null)
        setTimeout(() => { void client.auth.signOut() }, 0)
        return
      }
      setUser(email ? { email } : null)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      signIn: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()

        if (!supabase) throw new Error("Supabase is not configured.")
        if (ADMIN_EMAIL && normalizedEmail !== ADMIN_EMAIL) {
          throw new Error("This email is not authorized for the admin portal.")
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })

        if (error || !data.user) throw new Error("Invalid email or password.")
      },
      signInWithGoogle: async () => {
        if (!supabase) throw new Error("Connect Supabase to enable Google sign-in.")
        const redirectTo = `${window.location.origin}${window.location.pathname}#/admin`
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo },
        })
        if (error) throw new Error(error.message || "Google sign-in failed.")
      },
      signOut: async () => {
        setUser(null)
        if (supabase) await supabase.auth.signOut()
      },
    }),
    [user, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error("useSite must be used inside SiteProvider")
  return ctx
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
