import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Edmeca Academy - Empowering Tomorrow's Leaders",
  description: "Edmeca Academy provides world-class education that transforms lives and builds futures. Join a community dedicated to academic excellence, personal growth, and lifelong success.",
  keywords: "education, academy, learning, South Africa, Edmeca, school, programs, courses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
