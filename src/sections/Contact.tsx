import { useState, type FormEvent } from "react"
import { fieldClass, SectionHead } from "../components/ui"
import { useSite } from "../context"

export function Contact() {
const { profile, addMessage } = useSite()
const [ok, setOk] = useState(false)
const [err, setErr] = useState("")

const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
e.preventDefault()
setErr("")
setOk(false)

const form = e.currentTarget
const formData = new FormData(form)

const name = String(formData.get("name") ?? "").trim()
const email = String(formData.get("email") ?? "").trim()
const category = String(formData.get("category") ?? "").trim()
const subject = String(formData.get("subject") ?? "").trim()
const message = String(formData.get("message") ?? "").trim()

if (!name) {
  setErr("Please enter your name.")
  return
}

if (!email) {
  setErr("Please enter your email.")
  return
}

if (!email.includes("@")) {
  setErr("Please enter a valid email address.")
  return
}

if (!message) {
  setErr("Please enter your message.")
  return
}

if (message.length < 8) {
  setErr("Your message should be at least 8 characters.")
  return
}

try {
  await addMessage({
    name,
    email,
    category,
    subject: subject || category || "Hello",
    message,
  })

  form.reset()
  setOk(true)
} catch (ex) {
  setErr(ex instanceof Error ? ex.message : "Could not send")
}

}

return (
<section id="contact" className="py-20 bg-page">
<div className="max-w-7xl mx-auto px-4">
<SectionHead
kicker="Direct Inbox"
kickerClass="bg-soft border border-line text-muted"
icon={<span>◆</span>}
title="Get in Touch / Let's Build Together"
subtitle="Have an engineering role, internship, or project idea? Send a message."
/>

    <form
      onSubmit={onSubmit}
      className="max-w-3xl mx-auto bg-card border border-line rounded-3xl p-6 sm:p-10 space-y-4"
    >
      {ok && (
        <p className="text-xs text-muted font-mono">
          Message received. I’ll get back to you — or write {profile.email}.
        </p>
      )}

      {err && (
        <p className="text-xs text-muted font-mono">
          {err}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="name"
          required
          placeholder="Your name"
          className={fieldClass}
        />

        <input
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select name="category" className={fieldClass}>
          <option value="Full-Time Role">Full-Time Role</option>
          <option value="Internship">Internship</option>
          <option value="Project Collaboration">
            Project Collaboration
          </option>
          <option value="Consulting / Freelance">
            Consulting / Freelance
          </option>
          <option value="General Inquiry">General Inquiry</option>
        </select>

        <input
          name="subject"
          placeholder="Subject"
          className={fieldClass}
        />
      </div>

      <textarea
        name="message"
        required
        rows={6}
        placeholder="Hi Sheikh..."
        className={fieldClass}
      />

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl bg-accent text-accent-fg text-xs font-semibold"
      >
        Send Message
      </button>
    </form>
  </div>
</section>

)
}
