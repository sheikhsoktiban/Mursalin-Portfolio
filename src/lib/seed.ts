import type { GuestNote, InboxMessage, Profile, Project } from "../types"

export const SEED_PROFILE: Profile = {
  id: "00000000-0000-0000-0000-000000000001",
  first_name: "Mohammad",
  last_name: "Mursalin",
  role: "Backend Software Engineer",
  badge: "Available for Backend Roles & Collaborations",
  bio: "I build secure, scalable REST systems with Java and Spring Boot — JWT, OAuth2, real-time WebSockets, and LangChain-powered AI. Clean architecture. Production-ready backends.",
  about:
    "I’m a backend-focused software engineer. I treat APIs like products: secure by default, layered with intent, and ready for real traffic. Java and Spring Boot are home; Python and FastAPI show up when the problem is language.",
  location: "Bangladesh / Remote",
  email: "mursalinlamon@gmail.com",
  phone: "+8801814958978",
  github: "https://github.com/mohammad-mursalin",
  linkedin: "https://www.linkedin.com/in/mohammad-mursalin-67326a287",
  photo_meta: "Bangladesh · Available for roles",
  portrait_url: "/portrait.jpg",
}

export const SEED_PROJECTS: Project[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Full-Stack E-Commerce Platform",
    category: "fullstack",
    description:
      "Architected a full-stack B2C e-commerce platform with a React storefront and a Spring Boot REST API, following a clean layered architecture.",
    highlights: [
      "Layered Spring Boot API with JWT-secured customer sessions",
      "Stripe checkout in the purchase flow",
      "Real-time updates over WebSockets",
      "PostgreSQL persistence and a React client that respects the API boundary",
    ],
    tags: ["React", "Spring Boot", "PostgreSQL", "Stripe", "JWT", "WebSockets"],
    github: "https://github.com/mohammad-mursalin/ecom_with_payment",
    stars: 0,
    sort_order: 1,
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    title: "AI Research Paper Translator",
    category: "ai",
    description:
      "Intelligent system that translates academic PDFs while preserving structure, equations, and technical meaning using LangChain-orchestrated LLM pipelines.",
    highlights: [
      "Structure-aware PDF ingestion",
      "LangChain orchestration for multi-step translation",
      "Preserves equations and domain terminology",
      "FastAPI service with a React client",
    ],
    tags: ["FastAPI", "LangChain", "Python", "LLM APIs", "PDF", "React"],
    github: "https://github.com/mohammad-mursalin/research-paper-translator",
    stars: 0,
    sort_order: 2,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    title: "Real-Time Chat Application",
    category: "realtime",
    description:
      "Scalable chat system supporting private and group messaging with WebSocket delivery and JWT authentication.",
    highlights: [
      "Private threads and group rooms",
      "WebSocket delivery for live messages",
      "JWT-authenticated sessions",
      "MongoDB as the message store",
    ],
    tags: ["Spring Boot", "WebSockets", "MongoDB", "JavaScript", "JWT"],
    github: "https://github.com/mohammad-mursalin/chat-app",
    stars: 0,
    sort_order: 3,
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    title: "Hospital Queue & Appointments",
    category: "backend",
    description:
      "High-traffic backend for online appointments and real-time queue management with role-based dashboards.",
    highlights: [
      "Role-based dashboards and access control",
      "Live queue updates over WebSockets",
      "JWT-secured REST APIs",
      "PostgreSQL and MongoDB together",
    ],
    tags: ["Spring Boot", "REST", "JWT", "PostgreSQL", "MongoDB", "WebSockets"],
    github: "https://github.com/mohammad-mursalin/live-queue-monitoring-system",
    stars: 0,
    sort_order: 4,
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    title: "Smart Complaint Management",
    category: "backend",
    description:
      "Secure role-based platform allowing users to submit complaints and admins to manage responses.",
    highlights: [
      "Role-based access for users and admins",
      "JWT-secured Spring Boot services",
      "PostgreSQL as the system of record",
      "Server-rendered JSP operational UI",
    ],
    tags: ["Spring Boot", "JWT", "PostgreSQL", "JSP"],
    github: "https://github.com/mohammad-mursalin/smart-complaint-management-system",
    stars: 0,
    sort_order: 5,
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    title: "Mess Management System",
    category: "backend",
    description: "Operational system for mess billing, members, and day-to-day tracking.",
    highlights: [
      "Python service for member and meal operations",
      "Practical ops tooling rather than a demo CRUD app",
    ],
    tags: ["Python"],
    github: "https://github.com/mohammad-mursalin/mess-management-system",
    stars: 0,
    sort_order: 6,
  },
]

export const SEED_GUESTS: GuestNote[] = []
export const SEED_INBOX: InboxMessage[] = []
