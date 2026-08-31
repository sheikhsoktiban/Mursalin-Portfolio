# Mohammad Mursalin — Portfolio

Vite + React + TypeScript + Supabase.

```bash
npm install
cp .env.example .env
npm run dev
```

Public site: `/`  
Admin: `/admin` (gear icon)

Admin login uses **Supabase Authentication only**. The old demo email/password login has been completely removed.

Connect Supabase: run `supabase/schema.sql`, create your admin user in Supabase Authentication, and set the project URL, publishable/anon key, and admin email in `.env`.
