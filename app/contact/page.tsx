"use client";

export default function ContactPage() {
  return (
    <section className="section contact-page">
      <div className="container contact-grid">
        <div>
          <span className="badge">Contact</span>
          <h1 className="section-title">Let’s talk about your next brake.net project.</h1>
          <p className="section-copy">
            Add your phone number, email, and location here. This form is ready to
            connect to your backend or form service when you are ready.
          </p>

          <div className="card contact-info">
            <strong>Email</strong>
            <span>hello@brake.net</span>
            <strong>Phone</strong>
            <span>+251 ...</span>
            <strong>Location</strong>
            <span>Add your office location</span>
          </div>
        </div>

        <form className="card form">
          <label>
            Full name
            <input type="text" placeholder="Your name" />
          </label>
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>
          <label>
            Project details
            <textarea placeholder="Tell us about your website, app, design, or marketing needs." />
          </label>
          <button className="btn btn-primary" type="submit">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
