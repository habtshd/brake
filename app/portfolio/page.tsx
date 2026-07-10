"use client";

import { motion } from "framer-motion";

const projects = [
  { title: "Brake.net", tag: "Corporate website system" },
  { title: "Brake Design", tag: "Identity and visual assets" },
  { title: "Brake Market", tag: "Digital promotion campaigns" },
  { title: "Business Apps", tag: "Android and iOS solutions" }
];

export default function PortfolioPage() {
  return (
    <section className="section portfolio-page">
      <div className="container">
        <span className="badge">Portfolio</span>
        <h1 className="section-title">Selected work and brand directions.</h1>
        <p className="section-copy">
          Use this page to show screenshots, project summaries, results, and brand
          examples once you have them ready.
        </p>

        <div className="portfolio-grid">
          {projects.map((project) => (
            <motion.article key={project.title} whileHover={{ y: -4 }} className="card project">
              <div className="project-visual" />
              <h3>{project.title}</h3>
              <p>{project.tag}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
