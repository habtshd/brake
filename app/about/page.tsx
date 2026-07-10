"use client";

import { motion } from "framer-motion";
import { CTA } from "@/components/SectionBlocks";

export default function AboutPage() {
  return (
    <>
      <section className="section">
        <div className="container page-hero">
          <div>
            <span className="badge">About brake.net</span>
            <h1 className="section-title">
              We build modern digital systems with clarity, motion, and brand strength.
            </h1>
            <p className="section-copy">
              Brake.net is the umbrella brand for development, design, and digital
              promotion. The goal is to help organizations present themselves with a
              premium, trustworthy, and future-ready identity.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          {[
            {
              title: "Our mission",
              text: "Deliver digital work that feels modern, sharp, and genuinely useful."
            },
            {
              title: "Our vision",
              text: "Create a trusted technology and marketing brand that scales with your goals."
            },
            {
              title: "Our style",
              text: "Transparent visuals, strong hierarchy, clean motion, and easy navigation."
            }
          ].map((item) => (
            <motion.div key={item.title} whileHover={{ y: -4 }}>
              <div className="card info">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <CTA
            title="Let’s build the full brake.net experience next."
            text="The site is structured for easy expansion, so we can add your logo, final content, and service details page by page."
            button="Continue to contact"
          />
        </div>
      </section>

      <style jsx>{`
        .page-hero {
          padding-top: 30px;
        }

        .about-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .info {
          padding: 28px;
          min-height: 220px;
        }

        .info h3 {
          margin: 0 0 12px;
          font-size: 1.3rem;
        }

        .info p {
          margin: 0;
          color: var(--muted);
          line-height: 1.8;
        }

        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
