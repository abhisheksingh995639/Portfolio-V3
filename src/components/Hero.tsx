import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { gsap } from "gsap";
import { ArrowUpRight, FileText } from "lucide-react";
import { cn } from "../lib/utils";
import type { PortfolioData } from "../App";
import { motion } from "framer-motion";
import { useLenis } from "@studio-freight/react-lenis";

export function Hero({ data }: { data: PortfolioData | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const lenis = useLenis();
  const roles = data?.ui?.hero?.roles || ["Developer", "AI Engineer", "Creator", "Scholar"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const src = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        videoRef.current.src = src;
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [roles.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.to(".name-reveal", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.1,
        ease: "power3.out",
      }).to(
        ".blur-in",
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        },
        "-=1"
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center pt-24 pb-12">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Premium Dynamic Island Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none">
        <motion.div
          animate={{
            y: scrolled ? -4 : 0,
            scale: scrolled ? 0.98 : 1,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-auto inline-flex items-center rounded-full backdrop-blur-2xl px-2 py-2 transition-all duration-500",
            scrolled 
              ? "bg-surface/80 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
              : "bg-surface/40 border border-white/5 shadow-xl"
          )}
        >
          {/* Logo */}
          <div onClick={() => lenis?.scrollTo(0)} className={cn("group relative flex items-center justify-center rounded-full cursor-pointer transition-all duration-500", scrolled ? "w-9 h-9" : "w-10 h-10")}>
            <div className="absolute inset-0 rounded-full accent-gradient group-hover:[animation-direction:reverse] group-hover:animate-spin opacity-80" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-[1px] bg-bg rounded-full flex items-center justify-center">
              <span className={cn("font-display italic text-text-primary translate-y-[1px] transition-all", scrolled ? "text-[11px]" : "text-[14px]")}>AS</span>
            </div>
          </div>

          <motion.div animate={{ width: scrolled ? 16 : 24 }} className="h-px bg-stroke/50 mx-2 hidden md:block" />

          {/* Magic Pill Nav Links */}
          <div className="hidden md:flex items-center relative" onMouseLeave={() => setHoveredNav(null)}>
            {["Home", "About", "Work", "Timeline"].map((link) => (
              <a
                key={link}
                href={
                  link === "Home" ? "#home" : 
                  link === "About" ? "#about" : 
                  link === "Work" ? "#work" : 
                  "#experience"
                }
                onMouseEnter={() => setHoveredNav(link)}
                className={cn(
                  "relative rounded-full text-center transition-all z-10",
                  scrolled ? "px-4 py-2 text-xs" : "px-5 py-2 text-sm",
                  hoveredNav === link ? "text-white" : "text-muted hover:text-white"
                )}
              >
                {hoveredNav === link && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 font-medium">{link}</span>
              </a>
            ))}
          </div>

          <motion.div animate={{ width: scrolled ? 16 : 24 }} className="h-px bg-stroke/50 mx-2 hidden md:block" />

          {/* Say Hi Button */}
          <a href="#contact" className={cn("group relative rounded-full bg-text-primary text-bg overflow-hidden inline-block transition-all", scrolled ? "px-3 py-1.5 text-xs ml-2 md:ml-0" : "px-5 py-2 text-sm ml-3 md:ml-0")}>
             <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
             <div className="relative flex items-center gap-2 bg-text-primary group-hover:bg-transparent rounded-full font-bold transition-colors h-full w-full">
               {data?.ui?.hero?.sayHiBtn || "Say hi"} <ArrowUpRight className={cn("transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5", scrolled ? "w-3 h-3" : "w-4 h-4")} />
             </div>
          </a>
        </motion.div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6" id="home">
        <p className="blur-in opacity-0 translate-y-5 blur-[10px] text-xs text-muted uppercase tracking-[0.3em] mb-8">
          {data?.ui?.hero?.collectionYear || "COLLECTION '26"}
        </p>

        <h1 className="name-reveal opacity-0 translate-y-12 text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          Abhishek Singh
        </h1>

        <div className="blur-in opacity-0 translate-y-5 blur-[10px] text-xl md:text-3xl text-text-primary mb-6 flex items-center justify-center gap-2 h-10">
          A{" "}
          <span key={roleIndex} className="font-display italic text-text-primary animate-role-fade-in inline-block">
            {roles[roleIndex]}
          </span>
          {" "}{data?.ui?.hero?.livesInText || "lives in digital space."}
        </div>

        <p className="blur-in opacity-0 translate-y-5 blur-[10px] text-sm md:text-base text-muted max-w-md mx-auto mb-12 text-balance">
          {data?.general?.tagline || "Crafting digital experiences at the intersection of Artificial Intelligence and Modern Web Technologies."}
        </p>

        <div className="blur-in opacity-0 translate-y-5 blur-[10px] flex flex-wrap justify-center gap-4">
          <a href="#work" className="group relative inline-flex items-center justify-center rounded-full text-sm px-7 py-3.5 hover:scale-105 transition-all duration-300 bg-text-primary text-bg overflow-hidden hover:text-text-primary">
            <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 font-medium">{data?.ui?.hero?.seeWorksBtn || "See Works"}</span>
          </a>

          <a 
            href={data?.general?.resumeUrl || "/Resume.pdf"} 
            target="_blank" 
            rel="noopener noreferrer"
            download
            className="group relative inline-flex items-center justify-center rounded-full text-sm px-7 py-3.5 hover:scale-105 transition-all duration-300 border-2 border-stroke bg-bg text-text-primary hover:border-transparent"
          >
            <span className="absolute inset-[-2px] accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            <span className="absolute inset-[2px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 font-medium whitespace-nowrap flex items-center gap-2">
              <FileText className="w-4 h-4 transition-transform group-hover:scale-110" />
              Download Resume
            </span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10">
        <span className="text-[10px] text-muted uppercase tracking-[0.2em]">{data?.ui?.hero?.scrollText || "SCROLL"}</span>
        <div className="w-px h-10 bg-stroke overflow-hidden relative">
          <div className="absolute top-0 w-px h-1/2 accent-gradient animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
