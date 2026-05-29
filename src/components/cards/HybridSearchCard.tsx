"use client";

import { useEffect, useState } from "react";

const RESULTS = [
  { name: "handleRequest", score: 0.92, type: "Semantic" },
  { name: "processRequest", score: 0.87, type: "BM25" },
  { name: "requestHandler", score: 0.81, type: "Hybrid" },
];

export default function HybridSearchCard() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const fullQuery = "handleRequest";

  useEffect(() => {
    let i = 0;
    const type = setInterval(() => {
      i++;
      setQuery(fullQuery.slice(0, i));
      if (i >= fullQuery.length) {
        clearInterval(type);
        setTimeout(() => setShowResults(true), 300);
        setTimeout(() => {
          setQuery("");
          setShowResults(false);
        }, 4000);
      }
    }, 80);

    const cycle = setInterval(() => {
      i = 0;
      setQuery("");
      setShowResults(false);
      const retype = setInterval(() => {
        i++;
        setQuery(fullQuery.slice(0, i));
        if (i >= fullQuery.length) {
          clearInterval(retype);
          setTimeout(() => setShowResults(true), 300);
        }
      }, 80);
    }, 5500);

    return () => {
      clearInterval(type);
      clearInterval(cycle);
    };
  }, []);

  return (
    <div className="p-3 font-mono text-[9px] sm:text-[10px] h-full flex flex-col">
      {/* Search bar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-white/[0.03] border border-white/[0.06]">
        <span className="text-text-tertiary">$</span>
        <span className="text-foreground">{query}</span>
        {!showResults && <span className="animate-pulse text-accent">|</span>}
      </div>

      {/* Results */}
      {showResults && (
        <div className="mt-2 space-y-1.5 flex-1">
          {RESULTS.map((r, i) => (
            <div key={i} className="flex items-center gap-2" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="text-accent flex-shrink-0">{r.name}</span>
              <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${r.score * 100}%`, transition: "width 0.5s ease" }}
                />
              </div>
              <span className="text-text-tertiary text-[8px] flex-shrink-0">{r.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
