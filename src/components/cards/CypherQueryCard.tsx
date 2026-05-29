"use client";

import { useEffect, useState } from "react";

const QUERY = `MATCH (s)-[:CALLS]->(t)
WHERE t.name = 'auth'
RETURN s.name, s.file`;

const RESULTS = [
  { name: "loginRoute", file: "routes/login" },
  { name: "oauthCb", file: "routes/oauth" },
];

export default function CypherQueryCard() {
  const [chars, setChars] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    let c = 0;
    const type = setInterval(() => {
      c++;
      setChars(c);
      if (c >= QUERY.length) {
        clearInterval(type);
        setTimeout(() => setShowResults(true), 400);
        setTimeout(() => {
          setChars(0);
          setShowResults(false);
        }, 4000);
      }
    }, 50);

    const cycle = setInterval(() => {
      c = 0;
      setChars(0);
      setShowResults(false);
      const retype = setInterval(() => {
        c++;
        setChars(c);
        if (c >= QUERY.length) {
          clearInterval(retype);
          setTimeout(() => setShowResults(true), 400);
        }
      }, 50);
    }, 6000);

    return () => {
      clearInterval(type);
      clearInterval(cycle);
    };
  }, []);

  return (
    <div className="font-mono text-[9px] sm:text-[10px] p-3 space-y-2 h-full">
      <div className="text-text-secondary">
        {QUERY.slice(0, chars).split("\n").map((line, i) => (
          <div key={i}>
            {line.split(/(\b(?:MATCH|WHERE|RETURN)\b)/).map((part, j) =>
              /^(MATCH|WHERE|RETURN)$/.test(part) ? (
                <span key={j} className="text-accent">{part}</span>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </div>
        ))}
        {chars < QUERY.length && <span className="animate-pulse text-accent">|</span>}
      </div>

      {showResults && (
        <div className="border-t border-white/[0.06] pt-2 space-y-1">
          {RESULTS.map((r, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-accent">{r.name}</span>
              <span className="text-text-tertiary">{r.file}</span>
            </div>
          ))}
          <div className="text-success mt-1">2 rows · 0.003s</div>
        </div>
      )}
    </div>
  );
}
