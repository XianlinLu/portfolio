import { Suspense } from "react";
import { Portfolio, PortfolioContent } from "@/components/Portfolio";

export default function Home() {
  return <Suspense fallback={<PortfolioContent locale="en" />}><Portfolio /></Suspense>;
}
