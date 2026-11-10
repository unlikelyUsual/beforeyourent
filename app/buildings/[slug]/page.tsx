import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuildingDetail } from "@/components/building-detail";
import { getBuilding, getSampleReviewsForBuilding, listBuildings } from "@/lib/sample-data";
import type { ReviewKind } from "@/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export function generateStaticParams() {
  return listBuildings().map((building) => ({ slug: building.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const building = getBuilding(slug);
  if (!building) return { title: "Sample building not found" };
  return {
    title: `${building.name} sample page`,
    description: `Fictional sample notes for the page named ${building.name}.`,
  };
}

function initialTab(value: string | undefined): ReviewKind {
  if (value === "unit" || value === "owner" || value === "building") return value;
  return "building";
}

export default async function BuildingPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const building = getBuilding(slug);
  if (!building) notFound();
  const { tab } = await searchParams;

  return (
    <BuildingDetail
      building={building}
      sampleReviews={getSampleReviewsForBuilding(slug)}
      initialTab={initialTab(tab)}
    />
  );
}
