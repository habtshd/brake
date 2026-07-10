import { AdminMessages } from "@/components/AdminMessages";

export default function AdminPage() {
  return (
    <section className="section admin-page">
      <div className="container">
        <span className="badge">Admin</span>
        <h1 className="section-title">Manage contact submissions.</h1>
        <p className="section-copy">
          Search, filter, read, reply to, and export contact messages from the production contact form.
        </p>
        <AdminMessages />
      </div>
    </section>
  );
}

