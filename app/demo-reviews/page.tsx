import type { Metadata } from "next";
import { DemoReviewsPanel } from "@/components/demo-reviews-panel";

export const metadata: Metadata = {
  title: "Your demo reviews",
};

export default function DemoReviewsPage() {
  return <DemoReviewsPanel />;
}
