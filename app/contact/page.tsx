"use client";

import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <section className="section contact-page">
      <div className="container contact-grid">
        <div>
          <span className="badge">Contact</span>
          <h1 className="section-title">Let's talk about your next brake.net project.</h1>
          <p className="section-copy">
            Send your project details and we will reply with the next steps.
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

        <ContactForm />
      </div>
    </section>
  );
}
