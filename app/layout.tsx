import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Brake.net | Modern Digital Studio",
  description:
    "Brake.net builds modern web, system, app, design, and digital marketing experiences for growing brands."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="site-shell">
            <Nav />
            <main>{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
