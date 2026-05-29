"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ExploreView from "@/components/explore/ExploreView";

function ExplorePage() {
  const searchParams = useSearchParams();
  const repoId = searchParams.get("repo") ?? "zod-d7c4a41f";
  const apiBase = searchParams.get("api") ?? "http://127.0.0.1:3001";

  return <ExploreView repoId={repoId} apiBaseUrl={apiBase} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
          Loading...
        </div>
      }
    >
      <ExplorePage />
    </Suspense>
  );
}
