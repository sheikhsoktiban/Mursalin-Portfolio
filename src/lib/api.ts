async addMessage(msg: Omit<InboxMessage, "id" | "created_at" | "read">): Promise<InboxMessage> {
if (supabase) {
const { data, error } = await supabase
.from("messages")
.insert({
name: msg.name,
email: msg.email,
subject: msg.subject,
message: msg.message,
category: msg.category,
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

writeLs(KEYS.inbox, [created, ...readLs(KEYS.inbox, SEED_INBOX)])
return created
```

},
