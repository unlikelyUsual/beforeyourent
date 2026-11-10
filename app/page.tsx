import type { Metadata } from "next";
import { BuildingExplorer } from "@/components/building-explorer";
import { listAreas, listBuildings, listSampleReviews } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Explore sample buildings",
};

export default function HomePage() {
  return (
    <BuildingExplorer buildings={listBuildings()} sampleReviews={listSampleReviews()} areas={listAreas()} />
  );
}
