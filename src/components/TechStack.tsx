import { motion } from "framer-motion";
import type { PortfolioData } from "../App";

export function TechStack({ skills }: { skills: PortfolioData["skills"] }) {
  const allTech = [
    ...(skills?.map(s => s.name) || []),
  ];

  // duplicate for seamless scrolling
  const firstRow = [...allTech, ...allTech];
  const secondRow = [...allTech].reverse();
  const secondRowDuplicated = [...secondRow, ...secondRow];

  return (
    <section className="bg-bg py-20 overflow-hidden border-y border-stroke/50">
      <div className="max-w-[1200px] mx-auto px-6 mb-12">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#89AACC]" />
            <span className="text-xs text-[#89AACC] uppercase tracking-[0.3em]">Expertise</span>
         </div>
         <h2 className="text-4xl md:text-5xl font-display italic text-text-primary">Technical <span className="not-italic">Stack</span></h2>
      </div>

      <div className="flex flex-col gap-8">
        {/* Row 1 */}
        <div className="relative flex overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="flex whitespace-nowrap gap-12 text-5xl md:text-7xl font-display italic text-text-primary/30"
          >
            {firstRow.map((tech, i) => (
              <span key={i} className="hover:text-[#89AACC] transition-colors cursor-default">
                {tech} <span className="mx-6 text-stroke">•</span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="relative flex overflow-hidden">
          <motion.div 
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
            className="flex whitespace-nowrap gap-12 text-5xl md:text-7xl font-display italic text-text-primary/30"
          >
            {secondRowDuplicated.map((tech, i) => (
              <span key={i} className="hover:text-[#4E85BF] transition-colors cursor-default">
                {tech} <span className="mx-6 text-stroke">•</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
