"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" }
];

export function Nav() {
  return (
    <header className="nav-wrap">
      <div className="container nav glass">
        <Link href="/" className="brand">
          <span className="brand-mark">B</span>
          <span>
            <strong>Brake</strong>
            <small>.net</small>
          </span>
        </Link>

        <nav className="nav-links">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="btn btn-primary nav-cta">
          Start a Project
        </Link>
      </div>

      <style jsx>{`
        .nav-wrap {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 16px 0 0;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 16px 18px;
          border-radius: 999px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .brand span {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .brand small {
          color: var(--red);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .brand-mark {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--red), #ff6b76);
          color: white;
          box-shadow: 0 14px 28px rgba(240, 32, 44, 0.28);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
          color: var(--muted);
          font-weight: 600;
        }

        .nav-links :global(a:hover) {
          color: var(--text);
        }

        @media (max-width: 900px) {
          .nav-links {
            display: none;
          }
        }

        @media (max-width: 600px) {
          .nav {
            border-radius: 28px;
          }

          .nav-cta {
            padding-inline: 16px;
          }
        }
      `}</style>
    </header>
  );
}
