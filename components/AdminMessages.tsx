"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ToastProvider";

type Message = {
  id: number;
  fullName: string;
  email: string;
  projectDetails: string;
  createdAt: string;
  status: "new" | "read" | "replied";
};

type SessionState = "loading" | "authenticated" | "anonymous";

export function AdminMessages() {
  const { toast } = useToast();
  const [session, setSession] = useState<SessionState>("loading");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Message["status"]>("all");
  const [loading, setLoading] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [replyBusy, setReplyBusy] = useState(false);

  useEffect(() => {
    void checkSession();
  }, []);

  useEffect(() => {
    if (session === "authenticated") void loadMessages();
  }, [session, search, filter]);

  async function checkSession() {
    try {
      const response = await fetch("/api/admin/session", { credentials: "include" });
      setSession(response.ok ? "authenticated" : "anonymous");
    } catch {
      setSession("anonymous");
    }
  }

  async function loadMessages() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filter !== "all") params.set("status", filter);
      const response = await fetch(`/api/admin/messages?${params.toString()}`, {
        credentials: "include"
      });
      if (!response.ok) throw new Error("Unable to load messages.");
      const payload = await response.json();
      setMessages(payload.messages ?? []);
    } catch {
      toast({
        type: "error",
        title: "Could not load messages",
        description: "Check the admin session or database connection."
      });
    } finally {
      setLoading(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginBusy(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (!response.ok) {
        toast({
          type: "error",
          title: "Login failed",
          description: "Incorrect admin password."
        });
        return;
      }
      setSession("authenticated");
      setPassword("");
      toast({ type: "success", title: "Logged in", description: "Admin session created." });
    } finally {
      setLoginBusy(false);
    }
  }

  async function markStatus(id: number, status: Message["status"]) {
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (response.ok) {
      toast({ type: "success", title: "Updated", description: `Marked as ${status}.` });
      await loadMessages();
    }
  }

  async function removeMessage(id: number) {
    if (!window.confirm("Delete this message permanently?")) return;
    const response = await fetch(`/api/admin/messages/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (response.ok) {
      toast({ type: "success", title: "Deleted", description: "Message removed." });
      await loadMessages();
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    setReplyBusy(true);
    try {
      const response = await fetch(`/api/admin/messages/${selected.id}/reply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyText })
      });
      if (!response.ok) throw new Error("Reply failed");
      toast({ type: "success", title: "Reply sent", description: "The email was delivered." });
      setReplyText("");
      setSelected(null);
      await loadMessages();
    } catch {
      toast({
        type: "error",
        title: "Reply failed",
        description: "Check the email configuration and try again."
      });
    } finally {
      setReplyBusy(false);
    }
  }

  function exportCsv() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter !== "all") params.set("status", filter);
    window.open(`/api/admin/messages?format=csv&${params.toString()}`, "_blank", "noopener,noreferrer");
  }

  const counts = useMemo(() => {
    return {
      all: messages.length,
      new: messages.filter((message) => message.status === "new").length,
      read: messages.filter((message) => message.status === "read").length,
      replied: messages.filter((message) => message.status === "replied").length
    };
  }, [messages]);

  if (session !== "authenticated") {
    return (
      <form className="card admin-login" onSubmit={login}>
        <label>
          Admin Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter admin password"
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loginBusy}>
          {loginBusy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-toolbar card">
        <input
          type="search"
          placeholder="Search by name, email, or details"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={filter} onChange={(event) => setFilter(event.target.value as any)}>
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
        <button className="btn btn-secondary" type="button" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <div className="admin-stats">
        <div className="card stat-card">
          <strong>{counts.all}</strong>
          <span>Total</span>
        </div>
        <div className="card stat-card">
          <strong>{counts.new}</strong>
          <span>New</span>
        </div>
        <div className="card stat-card">
          <strong>{counts.replied}</strong>
          <span>Replied</span>
        </div>
      </div>

      <div className="card admin-table">
        {loading ? <p>Loading messages...</p> : null}
        {!loading && messages.length === 0 ? <p>No messages found.</p> : null}
        {messages.map((message) => (
          <article key={message.id} className="message-row">
            <div>
              <strong>{message.fullName}</strong>
              <span>{message.email}</span>
              <p>{message.projectDetails}</p>
            </div>
            <div className="message-actions">
              <span className={`status status-${message.status}`}>{message.status}</span>
              <button type="button" className="btn btn-secondary" onClick={() => setSelected(message)}>
                View / Reply
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => markStatus(message.id, "read")}
              >
                Mark Read
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => markStatus(message.id, "replied")}
              >
                Mark Replied
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => removeMessage(message.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {selected ? (
        <div className="reply-modal" role="dialog" aria-modal="true" aria-labelledby="reply-title">
          <div className="card reply-card">
            <h3 id="reply-title">Reply to {selected.fullName}</h3>
            <p>
              <strong>Email:</strong> {selected.email}
            </p>
            <p className="details">{selected.projectDetails}</p>
            <form onSubmit={sendReply}>
              <label>
                Reply message
                <textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} />
              </label>
              <div className="reply-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
                <button className="btn btn-primary" type="submit" disabled={replyBusy}>
                  {replyBusy ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
