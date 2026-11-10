import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xianlin Lu — Design & Technology",
  description: "Xianlin Lu’s portfolio of original personal content, AIGC and interaction design explorations, and professional experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
