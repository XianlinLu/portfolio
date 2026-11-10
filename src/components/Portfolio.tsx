"use client";

import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { PortfolioSection } from "@/components/PortfolioSection";
import type { Locale } from "@/content/profile";

export function PortfolioContent({ locale, interactive = false }: { locale: Locale; interactive?: boolean }) {
  return <>
    <PortfolioSection name="story" locale={locale} />
    <div className="content" id="content">
      <PortfolioSection name="about" locale={locale} />
      <PortfolioSection name="numbers" locale={locale} />
      <PortfolioSection name="work" locale={locale} />
      <PortfolioSection name="contact" locale={locale} />
    </div>
    {interactive && <Script src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/scene.js`} strategy="afterInteractive" />}
    <noscript><p>Enable JavaScript for the interactive story. 启用 JavaScript 以体验互动故事。</p></noscript>
  </>;
}

export function Portfolio() {
  const params = useSearchParams();
  return <PortfolioContent locale={params.get("lang") === "zh" ? "zh" : "en"} interactive />;
}
