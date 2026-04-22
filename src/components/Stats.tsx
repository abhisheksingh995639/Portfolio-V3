import type { PortfolioData } from "../App";

export function Stats({ data }: { data: PortfolioData | null }) {
  // Fallbacks if data is not loaded or missing
  const s = data?.general?.stats || {};
  
  // Calculate dynamic stats exactly like old js/main.js
  const calcYears = data?.experience && data.experience.length > 0 
    ? (new Date().getFullYear() - 2021).toString() 
    : "0";
  
  const calcProjects = data?.projects ? data.projects.length.toString() : "0";
  const calcTech = ((data?.skills?.length || 0) + (data?.languages?.length || 0)).toString();

  const stats = [
    { value: s.stat1Value || calcYears + "+", label: "Years Experience" },
    { value: s.stat2Value || calcProjects + "+", label: "Projects Done" },
    { value: s.stat3Value || calcTech + "+", label: "Technologies" },
  ];

  return (
    <section className="bg-bg py-16 md:py-24 border-y border-stroke">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-stroke">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-center pt-8 md:pt-0 first:pt-0">
              <h3 className="text-6xl md:text-7xl lg:text-8xl font-display italic text-text-primary mb-4">
                {stat.value}
              </h3>
              <p className="text-sm text-muted uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
