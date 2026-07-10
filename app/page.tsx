"use client";

import Link from "next/link";
import { CTA, ServiceCard, Stat } from "@/components/SectionBlocks";

const services = [
  {
    title: "System Development",
    description: "Custom business systems, dashboards, automation, and workflow tools."
  },
  {
    title: "Web Development",
    description: "Modern responsive websites and web apps designed for speed and clarity."
  },
  {
    title: "Mobile Apps",
    description: "Android and iOS app development with smooth product-focused experiences."
  },
  {
    title: "Graphics Design",
    description: "Brand identities, posters, social media visuals, and marketing assets."
  },
  {
    title: "Digital Marketing",
    description: "SEO, social media promotion, campaign strategy, and audience growth."
  },
  {
    title: "Digital Promotion",
    description: "Conversion-driven promotion for launches, services, and brand awareness."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="hero section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="badge">Modern digital studio</span>
            <h1>
              Brake.net builds <span>web, app, design, and marketing</span> systems.
            </h1>
            <p>
              We create calm, high-clarity digital experiences for organizations that
              want a premium brand presence and reliable growth.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">
                Start a Project
              </Link>
              <Link href="/services" className="btn btn-secondary">
                Explore Services
              </Link>
            </div>
            <div className="hero-meta">
              <div>
                <strong>Brake Design</strong>
                <span>Identity and visual direction</span>
              </div>
              <div>
                <strong>Brake Market</strong>
                <span>Promotion and growth campaigns</span>
              </div>
            </div>
          </div>

          <div className="hero-visual card">
            <div className="visual-panel">
              <div className="panel-top">
                <span className="badge">Brake.net</span>
                <span className="panel-chip">Design • Development • Growth</span>
              </div>

              <div className="panel-illustration">
                <div className="shape shape-a" />
                <div className="shape shape-b" />
                <div className="dashboard">
                  <div className="dashboard-row">
                    <div className="dash-card dash-primary">
                      <strong>Web systems</strong>
                      <span>Fast, responsive, scalable</span>
                    </div>
                    <div className="dash-card">
                      <strong>Brand design</strong>
                      <span>Clean and consistent identity</span>
                    </div>
                  </div>
                  <div className="dash-card dash-wide">
                    <strong>Digital promotion</strong>
                    <span>Targeted campaigns and visibility</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stats-grid">
          <Stat value="4" label="Core brands and service directions" />
          <Stat value="6+" label="Primary service offerings to showcase" />
          <Stat value="100%" label="Responsive, modern, and engagement focused" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Services</div>
          <h2 className="section-title">Everything under one modern digital roof.</h2>
          <p className="section-copy">
            The site structure highlights your technology, creative, and growth
            services in a simple way that feels premium, transparent, and easy to scan.
          </p>

          <div className="grid services-grid">
            {services.map((service) => (
              <div key={service.title}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CTA
            title="Ready to shape brake.net into a premium multi-page brand site?"
            text="We can now connect the pages, add the service details, and finish the full modern experience for brake.net, brakedesign, and brakemarket."
            button="Build the full site"
          />
        </div>
      </section>

      <style jsx>{`
        .hero {
          padding-top: 28px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 42px;
          align-items: center;
          min-height: calc(100vh - 140px);
        }

        .hero-copy h1 {
          font-size: clamp(2.8rem, 5vw, 5rem);
          line-height: 1.02;
          letter-spacing: -0.06em;
          margin: 18px 0;
          max-width: 12ch;
        }

        .hero-copy h1 span {
          color: #d62f37;
        }

        .hero-copy p {
          color: var(--muted);
          max-width: 580px;
          font-size: 1.03rem;
          line-height: 1.85;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 26px;
        }

        .hero-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .hero-meta div {
          padding: 16px 18px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.58);
          border: 1px solid rgba(12, 31, 48, 0.08);
        }

        .hero-meta strong {
          display: block;
          margin-bottom: 6px;
          font-size: 0.98rem;
        }

        .hero-meta span {
          display: block;
          color: var(--muted);
          line-height: 1.5;
          font-size: 0.92rem;
        }

        .hero-visual {
          position: relative;
          padding: 22px;
          min-height: 620px;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(240, 32, 44, 0.12), transparent 34%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(247, 251, 253, 0.72));
        }

        .visual-panel {
          position: relative;
          height: 100%;
          border-radius: 32px;
          border: 1px solid rgba(12, 31, 48, 0.08);
          background:
            radial-gradient(circle at top left, rgba(12, 31, 48, 0.05), transparent 24%),
            radial-gradient(circle at 80% 18%, rgba(240, 32, 44, 0.12), transparent 22%),
            rgba(255, 255, 255, 0.72);
          padding: 24px;
          overflow: hidden;
        }

        .panel-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .panel-chip {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--muted);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(12, 31, 48, 0.08);
          border-radius: 999px;
          padding: 8px 14px;
        }

        .panel-illustration {
          position: absolute;
          inset: 86px 24px 24px;
          border-radius: 28px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.95));
          border: 1px solid rgba(12, 31, 48, 0.06);
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 999px;
          filter: blur(8px);
        }

        .shape-a {
          width: 280px;
          height: 280px;
          top: -110px;
          right: -60px;
          background: rgba(240, 32, 44, 0.12);
        }

        .shape-b {
          width: 260px;
          height: 260px;
          left: -110px;
          bottom: -100px;
          background: rgba(12, 31, 48, 0.08);
        }

        .dashboard {
          position: absolute;
          inset: 34px;
          display: grid;
          gap: 16px;
          align-content: end;
        }

        .dashboard-row {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 16px;
        }

        .dash-card {
          min-height: 128px;
          padding: 22px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(12, 31, 48, 0.08);
          box-shadow: 0 18px 40px rgba(12, 31, 48, 0.08);
        }

        .dash-primary {
          background: linear-gradient(135deg, rgba(240, 32, 44, 0.1), rgba(255, 255, 255, 0.88));
        }

        .dash-wide {
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.78)),
            radial-gradient(circle at right top, rgba(240, 32, 44, 0.08), transparent 32%);
        }

        .dash-card strong {
          display: block;
          font-size: 1rem;
          margin-bottom: 8px;
        }

        .dash-card span {
          color: var(--muted);
          line-height: 1.6;
        }

        .stats-grid {
          grid-template-columns: repeat(3, 1fr);
        }

        .services-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 28px;
        }

        @media (max-width: 980px) {
          .hero-grid {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .hero-meta {
            grid-template-columns: 1fr;
          }

          .stats-grid,
          .services-grid {
            grid-template-columns: 1fr;
          }

          .hero-visual {
            min-height: 520px;
          }

          .dashboard-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
