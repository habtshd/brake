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
              Brake.net builds <span>web, app, design, and marketing</span> systems
              with a clean modern edge.
            </h1>
            <p>
              We create transparent, engaging, and high-clarity digital experiences
              for organizations that want to look premium and perform better online.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">
                Start a Project
              </Link>
              <Link href="/services" className="btn btn-secondary">
                Explore Services
              </Link>
            </div>
          </div>

          <div className="hero-visual card">
            <div className="orb orb-a" />
            <div className="orb orb-b" />
            <div className="badge floating">Brake.net</div>
            <div className="visual-panel glass">
              <div className="mini">
                <strong>Brake Design</strong>
                <span>Brand visuals</span>
              </div>
              <div className="mini accent">
                <strong>Brake Market</strong>
                <span>Digital promotion</span>
              </div>
              <div className="mini">
                <strong>Development</strong>
                <span>Systems and apps</span>
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
              <motion.div
                key={service.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ServiceCard {...service} />
              </motion.div>
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
          padding-top: 34px;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: center;
          min-height: calc(100vh - 120px);
        }

        .hero-copy h1 {
          font-size: clamp(3rem, 6vw, 5.8rem);
          line-height: 0.96;
          letter-spacing: -0.07em;
          margin: 18px 0;
          max-width: 10ch;
        }

        .hero-copy h1 span {
          color: var(--red);
        }

        .hero-copy p {
          color: var(--muted);
          max-width: 620px;
          font-size: 1.1rem;
          line-height: 1.9;
        }

        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 26px;
        }

        .hero-visual {
          position: relative;
          padding: 26px;
          min-height: 560px;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(4px);
        }

        .orb-a {
          width: 320px;
          height: 320px;
          background: rgba(240, 32, 44, 0.16);
          top: -90px;
          right: -80px;
        }

        .orb-b {
          width: 300px;
          height: 300px;
          background: rgba(12, 31, 48, 0.12);
          bottom: -120px;
          left: -120px;
        }

        .floating {
          position: absolute;
          top: 22px;
          left: 22px;
        }

        .visual-panel {
          position: absolute;
          inset: 112px 26px 26px;
          border-radius: 34px;
          padding: 26px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
          align-content: center;
        }

        .mini {
          padding: 20px 22px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(12, 31, 48, 0.08);
        }

        .mini strong {
          display: block;
          font-size: 1.05rem;
          margin-bottom: 8px;
        }

        .mini span {
          color: var(--muted);
        }

        .mini.accent {
          background: linear-gradient(135deg, rgba(240, 32, 44, 0.14), rgba(255, 255, 255, 0.9));
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

          .stats-grid,
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
