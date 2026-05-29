"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import KnowledgeGraphAnimation from "./KnowledgeGraphAnimation";
import CliOutput from "./CliOutput";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background image layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.webp"
          alt="Hero background graph visualization"
          fill
          priority
          quality={85}
          className="object-cover opacity-30 mix-blend-multiply"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay for additional contrast and brand colors */}
      <div className="absolute inset-0 z-1 hero-gradient bg-grid"></div>

      {/* Content layer */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side: Animation (hidden on mobile for performance) */}
          <div className="hidden md:flex justify-center order-2 md:order-1">
            <div className="w-full max-w-md">
              <KnowledgeGraphAnimation />
            </div>
          </div>

          {/* Right side: Text content */}
          <div className="text-center md:text-left order-1 md:order-2">
            <motion.h1
              {...fadeUp}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              AI agents that{" "}
              <span className="text-accent-glow">actually understand</span>{" "}
              your architecture
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto md:mx-0 mb-8"
            >
              Myceliums builds a code knowledge graph with symbols, call chains,
              communities, and impact zones so your AI agents know what breaks
              before you ship.
            </motion.p>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-base md:text-lg text-accent-glow/90 max-w-2xl mx-auto md:mx-0 mb-8 font-medium"
            >
              Understand any codebase in minutes, not days. 14 languages.
              Interactive visualization. Open source.
            </motion.p>

            {/* Demo stats */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10 max-w-2xl mx-auto md:mx-0"
            >
              <CliOutput
                lines={[
                  {
                    type: "input",
                    content: "myc analyze ./my-project",
                    delay: 0,
                  },
                  {
                    type: "output",
                    content: "Analyzing /home/user/my-project ...",
                    delay: 300,
                  },
                  {
                    type: "output",
                    content: "",
                    delay: 200,
                  },
                  {
                    type: "stats",
                    content: "  Symbols:       41,952",
                    delay: 200,
                  },
                  {
                    type: "stats",
                    content: "  Relationships: 45,028",
                    delay: 150,
                  },
                  {
                    type: "stats",
                    content: "  Communities:   86",
                    delay: 150,
                  },
                  {
                    type: "stats",
                    content: "  Processes:     214",
                    delay: 150,
                  },
                  {
                    type: "output",
                    content: "",
                    delay: 200,
                  },
                  {
                    type: "stats",
                    content: "Completed in 1.6s  (5,000+ files)",
                    delay: 300,
                  },
                ]}
                animate={false}
              />
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4"
            >
              <a
                href="#get-started"
                className="px-6 py-3 bg-accent hover:bg-accent-glow text-white font-medium rounded-lg transition-colors text-sm"
              >
                Get Started
              </a>
              <a
                href="https://github.com/marcmantei/myceliums"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-border hover:border-accent/50 text-text-secondary hover:text-foreground font-medium rounded-lg transition-colors text-sm"
              >
                View on GitHub
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
