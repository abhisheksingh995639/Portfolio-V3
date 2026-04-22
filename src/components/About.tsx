import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { PortfolioData } from "../App";

export function About({ ui, aboutText, languages }: { ui?: any; aboutText: string; languages: PortfolioData["languages"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60;
    const connectionDistance = 150;

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }

      draw() {
        ctx!.fillStyle = "rgba(137, 170, 204, 0.5)";
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      canvas.width = canvas.parentElement!.clientWidth;
      canvas.height = canvas.parentElement!.clientHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.strokeStyle = `rgba(137, 170, 204, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => init();
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
            if (!animationFrameId) animate();
        } else {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = 0;
        }
      },
      { threshold: 0.1 }
    );

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    observer.observe(canvas);
    init();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section id="about" className="relative bg-surface py-24 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
           initial={{ opacity: 0, x: -50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#89AACC]" />
            <span className="text-xs text-[#89AACC] uppercase tracking-[0.3em]">{ui?.label || "About Me"}</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display italic text-text-primary mb-8">
            Driven by <span className="not-italic">Curiosity</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted font-light leading-relaxed italic border-l-2 border-stroke pl-8 py-4 mb-12">
            {aboutText || (ui?.tagline || "Crafting the next generation of intelligent digital tools and experiences.")}
          </p>

          {/* Languages Section */}
          {languages && languages.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#89AACC] uppercase tracking-[0.3em]">Linguistic Proficiency</span>
                <div className="flex-1 h-px bg-stroke/30" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {languages.map((lang, i) => (
                  <div key={i} className="group flex flex-col gap-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl md:text-3xl font-display italic text-text-primary tracking-tight">{lang.name}</span>
                      <span className="text-[10px] font-mono text-[#89AACC] uppercase tracking-[0.2em]">{lang.level}</span>
                    </div>
                    
                    <div className="relative h-px w-full bg-stroke rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lang.pct || 0}%` }}
                        transition={{ duration: 1.5, ease: "circOut", delay: i * 0.1 }}
                        className="absolute inset-y-0 left-0 accent-gradient shadow-[0_0_8px_rgba(137,170,204,0.3)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="relative aspect-square md:aspect-auto md:h-[500px] rounded-3xl overflow-hidden border border-stroke bg-bg/50 backdrop-blur-xl group"
        >
           <img 
            src="/MyPhoto.jpeg" 
            alt="Abhishek Singh" 
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
           <div className="absolute bottom-8 left-8 z-10">
              <span className="block text-4xl font-display italic text-[#89AACC] mb-1">AS</span>
              <p className="text-[10px] text-muted uppercase tracking-[0.5em]">System.Initialised()</p>
           </div>
           <div className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-10 transition-opacity" />
        </motion.div>
      </div>
    </section>
  );
}
