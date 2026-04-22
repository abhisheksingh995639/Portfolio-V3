import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import type { PortfolioData } from "../App";

function TimelineItem({ exp }: { exp: any }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -40% 0px" }}
      className="relative pl-16 lg:pl-28"
    >
      {/* Marker */}
      <motion.div
        variants={{
          hidden: { scale: 1, borderColor: "hsl(var(--stroke))", backgroundColor: "hsl(var(--surface))" },
          visible: { scale: 1.15, borderColor: "transparent", backgroundColor: "#89AACC" },
        }}
        transition={{ duration: 0.4 }}
        className="absolute w-10 h-10 rounded-full border-4 flex items-center justify-center z-10 left-[11px] lg:left-[27px] top-[-4px] overflow-hidden"
      >
        {/* Fill marker with gradient on active */}
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          className="absolute inset-0 accent-gradient"
        />
        <motion.span
          variants={{
             hidden: { scale: 0 },
             visible: { scale: 1 }
          }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative z-10 text-bg text-xs font-bold"
        >
          ✓
        </motion.span>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 40 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="font-display text-3xl italic opacity-60 mb-2">{exp.date || "Present"}</p>
          </div>
          <div className="lg:col-span-9">
             <h3 className="text-3xl font-bold mb-2 text-text-primary">{exp.role}</h3>
             <p className="text-[#89AACC] font-bold mb-6 tracking-wide uppercase text-sm">
               {exp.company}
             </p>
             <p className="text-muted text-lg leading-relaxed max-w-2xl">{exp.desc}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Journal({ ui, experiences }: { ui?: any; experiences: NonNullable<PortfolioData["experience"]> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Progress line from 0 to 1 based on vertical scroll intersecting the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const displayExperiences = experiences.length > 0
    ? experiences
    : [
        { role: "Senior Developer", company: "Tech Innovators", date: "2024", desc: "Leading the frontend engineering team." },
        { role: "Fullstack Engineer", company: "Digital Solutions", date: "2021", desc: "Built full-stack applications with React and Node." },
      ];

  return (
    <section id="experience" className="bg-bg py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mimicking old UI exactly */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-24">
          <h2 className="font-display text-6xl md:text-8xl font-bold text-text-primary uppercase tracking-tighter mb-4 md:mb-0">
            {ui?.label || "Timeline"}
          </h2>
          <p className="uppercase tracking-[0.4em] text-sm font-bold text-[#89AACC]">
            {ui?.subtitle || "Academic & Professional Journey"}
          </p>
        </div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative max-w-5xl mx-auto pb-10">
          
          {/* Background Line */}
          <div className="absolute top-0 bottom-0 w-[2px] bg-stroke left-[30px] lg:left-[46px] z-[1]"></div>
          
          {/* Interactive Progress Line */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute top-0 bottom-0 w-[2px] left-[30px] lg:left-[46px] z-[2] accent-gradient origin-top shadow-[0_0_15px_rgba(137,170,204,0.4)]"
          />

          <div className="space-y-24">
            {displayExperiences.map((exp, idx) => (
               <TimelineItem key={idx} exp={exp} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
