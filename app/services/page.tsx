import { ServiceCard } from "@/components/SectionBlocks";

const services = [
  {
    title: "System Development",
    description: "Internal tools, admin dashboards, business automation, and secure workflows."
  },
  {
    title: "Web Development",
    description: "Fast, responsive, modern websites and web applications built for engagement."
  },
  {
    title: "Android & iOS",
    description: "Mobile apps that feel polished, intuitive, and ready for real-world use."
  },
  {
    title: "Graphics Design",
    description: "Strong visual identity work for brake.net, brakedesign, and campaign assets."
  },
  {
    title: "Digital Marketing",
    description: "SEO, social promotion, content strategy, and visibility planning."
  },
  {
    title: "Digital Promotion",
    description: "Launch promotion, audience growth, and conversion-focused campaigns."
  }
];

export default function ServicesPage() {
  return (
    <section className="section services-page">
      <div className="container">
        <span className="badge">Services</span>
        <h1 className="section-title">A full stack of digital services under brake.net.</h1>
        <p className="section-copy">
          This page is designed to present your technical and creative services with
          clear structure and strong brand coherence.
        </p>

        <div className="grid service-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
