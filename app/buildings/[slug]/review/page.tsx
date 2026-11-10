import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review-form";
import { getBuilding, listBuildings } from "@/lib/sample-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listBuildings().map((building) => ({ slug: building.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const building = getBuilding(slug);
  if (!building) return { title: "Demo review" };
  return { title: `Demo review for ${building.name}` };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const building = getBuilding(slug);
  if (!building) notFound();
  return <ReviewForm building={building} />;
}
