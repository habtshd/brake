"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { MAX_EMAIL, MAX_FULL_NAME, MAX_PROJECT_DETAILS } from "@/lib/contact";

type FormState = {
  fullName: string;
  email: string;
  projectDetails: string;
  honeypot: string;
};

type FormErrors = Partial<Record<keyof FormState | "form", string>>;

const initialForm: FormState = {
  fullName: "",
  email: "",
  projectDetails: "",
  honeypot: ""
};

function validate(values: FormState) {
  const errors: FormErrors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim().toLowerCase();
  const projectDetails = values.projectDetails.trim();

  if (!fullName) errors.fullName = "Full name is required.";
  else if (fullName.length > MAX_FULL_NAME) errors.fullName = "Full name is too long.";

  if (!email) errors.email = "Email is required.";
  else if (email.length > MAX_EMAIL) errors.email = "Email is too long.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";

  if (!projectDetails) errors.projectDetails = "Project details are required.";
  else if (projectDetails.length > MAX_PROJECT_DETAILS) {
    errors.projectDetails = "Project details are too long.";
  }

  return errors;
}

export function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/contact/csrf", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (active && typeof data.csrfToken === "string") setCsrfToken(data.csrfToken);
      })
      .catch(() => {
        if (active) {
          toast({
            type: "error",
            title: "Security token unavailable",
            description: "Please refresh the page and try again."
          });
        }
      });

    return () => {
      active = false;
    };
  }, [toast]);

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast({
        type: "error",
        title: "Fix the form fields",
        description: "Please review the highlighted fields and try again."
      });
      return;
    }

    if (!csrfToken) {
      toast({
        type: "error",
        title: "Security token missing",
        description: "Please refresh the page and submit again."
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          projectDetails: form.projectDetails,
          honeypot: form.honeypot
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(payload.errors ?? { form: payload.error ?? "Something went wrong." });
        toast({
          type: "error",
          title: "Message not sent",
          description: payload.error ?? "Please try again."
        });
        return;
      }

      toast({
        type: "success",
        title: "Message sent",
        description: "We received your project details and will respond soon."
      });
      setForm(initialForm);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } catch {
      toast({
        type: "error",
        title: "Network error",
        description: "Your message could not be submitted right now."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {submitted ? (
        <div className="card success-banner">
          <strong>Thanks. Your message was sent successfully.</strong>
          <span>We will review it and reply as soon as possible.</span>
        </div>
      ) : null}

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <input
          className="hidden-input"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={(event) => updateField("honeypot", event.target.value)}
        />

        <label>
          Full Name
          <input
            type="text"
            placeholder="Your name"
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            required
          />
          {errors.fullName ? (
            <span className="field-error" id="fullName-error">
              {errors.fullName}
            </span>
          ) : null}
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          {errors.email ? (
            <span className="field-error" id="email-error">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label>
          Project Details
          <textarea
            placeholder="Tell us about your website, app, design, or marketing needs."
            value={form.projectDetails}
            onChange={(event) => updateField("projectDetails", event.target.value)}
            aria-invalid={Boolean(errors.projectDetails)}
            aria-describedby={errors.projectDetails ? "projectDetails-error" : undefined}
            required
          />
          {errors.projectDetails ? (
            <span className="field-error" id="projectDetails-error">
              {errors.projectDetails}
            </span>
          ) : null}
        </label>

        {errors.form ? <div className="field-error">{errors.form}</div> : null}

        <button className="btn btn-primary submit-btn" type="submit" disabled={!canSubmit}>
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </>
  );
}
