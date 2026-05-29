import { HERO_FEATURES } from "@/data/features";
import HeroFeatureSection from "@/components/sections/HeroFeatureSection";

export default function McpHero() {
  const mcpFeature = HERO_FEATURES.find((f) => f.id === "mcp-integration");
  if (!mcpFeature) return null;
  return <HeroFeatureSection feature={mcpFeature} index={0} />;
}
