"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SectionBlobs from "@/components/ui/section-blobs";

// Lazy-load sections for code splitting
const Hero = dynamic(() => import("@/components/sections/Hero"));
const McpHero = dynamic(() => import("@/components/sections/McpHero"));
const OrchestratorHero = dynamic(() => import("@/components/sections/OrchestratorHero"));
const Architecture = dynamic(() => import("@/components/sections/Architecture"));
const IngestSurface = dynamic(() => import("@/components/sections/IngestSurface"));
const Features = dynamic(() => import("@/components/sections/Features"));
const ProblemSolution = dynamic(() => import("@/components/sections/ProblemSolution"));
const UseCases = dynamic(() => import("@/components/sections/UseCases"));
const PrivacyTrust = dynamic(() => import("@/components/sections/PrivacyTrust"));
const CompetitorComparison = dynamic(() => import("@/components/sections/CompetitorComparison"));
const Benchmarks = dynamic(() => import("@/components/sections/Benchmarks"));
const GetStarted = dynamic(() => import("@/components/sections/GetStarted"));
const RealOutput = dynamic(() => import("@/components/sections/RealOutput"));
const CodebaseVisualizationSection = dynamic(() => import("@/components/sections/CodebaseVisualizationSection"));
const ArchitectureIntelligence = dynamic(() => import("@/components/sections/ArchitectureIntelligence"));
const ArchGuardianStrip = dynamic(() => import("@/components/sections/ArchGuardianStrip"));

function WithBlobs({ seed, children }: { seed: number; children: React.ReactNode }) {
  return (
    <div className="relative">
      <SectionBlobs seed={seed} />
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <WithBlobs seed={101}>
          <McpHero />
        </WithBlobs>

        <WithBlobs seed={202}>
          <OrchestratorHero />
        </WithBlobs>

        <WithBlobs seed={303}>
          <Architecture />
        </WithBlobs>

        <WithBlobs seed={404}>
          <IngestSurface />
        </WithBlobs>

        <WithBlobs seed={505}>
          <Features />
        </WithBlobs>

        <WithBlobs seed={556}>
          <ArchitectureIntelligence />
        </WithBlobs>

        <ArchGuardianStrip />

        <WithBlobs seed={606}>
          <CodebaseVisualizationSection />
        </WithBlobs>

        <WithBlobs seed={707}>
          <ProblemSolution />
        </WithBlobs>

        <WithBlobs seed={808}>
          <UseCases />
        </WithBlobs>

        <WithBlobs seed={909}>
          <PrivacyTrust />
        </WithBlobs>

        <WithBlobs seed={1010}>
          <CompetitorComparison />
        </WithBlobs>

        <WithBlobs seed={1111}>
          <Benchmarks />
        </WithBlobs>

        <WithBlobs seed={1212}>
          <GetStarted />
        </WithBlobs>

      </main>
      <Footer />
    </>
  );
}
