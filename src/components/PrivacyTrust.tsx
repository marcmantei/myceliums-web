"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  HardDrive,
  FileCode2,
  EyeOff,
  Unlink,
  Github,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { LICENSE_LABEL, LICENSE_SPDX_ID } from "@/data/license";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
}

const pillars: Pillar[] = [
  {
    icon: HardDrive,
    title: "Local-First Architecture",
    description:
      "Every bit of analysis happens on your machine. Your code never crosses a network boundary.",
    details: [
      "No cloud uploads or external API calls",
      "LanceDB embedded storage, no database server needed",
      "Works offline, works air-gapped",
    ],
  },
  {
    icon: FileCode2,
    title: "Open-Source & Auditable",
    description:
      `${LICENSE_SPDX_ID} licensed. Don't trust our claims? Read the code and verify them yourself.`,
    details: [
      "Full source on GitHub, every line",
      "No obfuscated binaries or black boxes",
      "Fork it, modify it, ship it",
    ],
  },
  {
    icon: EyeOff,
    title: "Zero Telemetry",
    description:
      "No analytics, no error reporting, no usage tracking. We collect nothing.",
    details: [
      "No phone-home endpoints",
      "No crash reporters or beacons",
      "No personal information stored",
    ],
  },
  {
    icon: Unlink,
    title: "No Vendor Lock-In",
    description:
      "Standard formats, no proprietary data. Walk away any time with everything intact.",
    details: [
      "Neo4j-compatible Cypher queries",
      "Local SQLite & LanceDB storage",
      "No accounts, no subscriptions, no keys",
    ],
  },
];

export default function PrivacyTrust() {
  return (
    <section id="privacy" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Badge */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs font-medium text-accent-glow tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Local &middot; Zero Telemetry
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4"
        >
          Privacy by architecture,{" "}
          <span className="text-accent-glow">not by promise.</span>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-secondary text-center max-w-2xl mx-auto mb-16"
        >
          Most tools ask you to trust them. Myceliums lets you verify. Every
          component runs locally, the source is open, and there is literally no
          code path that sends your data anywhere.
        </motion.p>

        {/* Pillar cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
              className="group p-6 bg-surface border border-border rounded-lg hover:border-accent/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                  <pillar.icon className="w-5 h-5 text-accent-glow" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{pillar.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
              <ul className="ml-14 space-y-1.5">
                {pillar.details.map((detail) => (
                  <li
                    key={detail}
                    className="text-sm text-text-secondary flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent-glow shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Audit CTA */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/marcmantei/myceliums"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border hover:border-accent/50 rounded-lg text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" />
            Audit the code yourself
          </a>
        </motion.div>
      </div>
    </section>
  );
}
