import Link from "next/link";

export function ServiceCard({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="service card">
      <span className="icon">◆</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function Stat({
  value,
  label
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="stat card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function CTA({
  title,
  text,
  button
}: {
  title: string;
  text: string;
  button: string;
}) {
  return (
    <div className="cta card">
      <div>
        <div className="eyebrow">Next Step</div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <Link className="btn btn-primary" href="/contact">
        {button}
      </Link>
    </div>
  );
}
