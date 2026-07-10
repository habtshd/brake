import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer section">
      <div className="container footer-grid card">
        <div>
          <div className="eyebrow">Brake.net</div>
          <h3>Modern systems, websites, apps, design, and digital growth.</h3>
          <p>
            We build clean, fast, and engaging digital products for organizations
            that want a strong modern presence.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div>
          <h4>Services</h4>
          <span>System Development</span>
          <span>Web Development</span>
          <span>App Development</span>
          <span>Digital Marketing</span>
        </div>
      </div>
    </footer>
  );
}
