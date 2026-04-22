import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { gsap } from "gsap";
import { cn } from "../lib/utils";
import { Lock } from "lucide-react";

const marqueeDefault = [
  "BUILDING THE FUTURE",
  "CRAFTING DIGITAL EXPERIENCES",
  "ENGINEERING WITH PASSION",
  "DESIGNING FOR TOMORROW",
  "PUSHING THE BOUNDARIES",
];

export function Footer({ ui }: { ui?: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const marqueePhrases = ui?.marquee || marqueeDefault;

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
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 40,
        ease: "none",
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("Sending...");

    const formData = new FormData(e.currentTarget);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
      const result = await response.json();
      if (response.status === 200) {
        setFormStatus("Message Sent Successfully!");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus(result.message || "Something went wrong!");
      }
    } catch (error) {
      setFormStatus("Something went wrong!");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setFormStatus(""), 5000);
    }
  };

  return (
    <footer id="contact" className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden flex flex-col items-center">
      {/* Background Video (Reversed Y and dark overlay) */}
      <div className="absolute inset-0 z-0 scale-y-[-1]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Marquee */}
        <div className="w-full relative overflow-hidden mb-16 md:mb-24 flex whitespace-nowrap">
          <div ref={marqueeRef} className="flex">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex">
                {marqueePhrases.map((phrase: string, j: number) => (
                  <span key={`${i}-${j}`} className="text-4xl md:text-7xl lg:text-9xl font-display italic text-text-primary/20 shrink-0 px-4">
                    {phrase} <span className="opacity-50 mx-4">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-6xl px-6 mb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-left mb-12 lg:mb-0">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-display text-text-primary mb-6 tracking-tight">
              {ui?.contactTitle?.split('tomorrow.')[0] || "Let's build "} <br className="hidden lg:block" /><span className="italic text-[#89AACC]">{ui?.contactTitle?.includes('tomorrow.') ? 'tomorrow.' : (ui?.contactTitle || 'tomorrow.')}</span>
            </h2>
            <p className="text-muted text-lg max-w-md">{ui?.contactDesc || "Send an inquiry and I'll get back to you shortly."}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-8 backdrop-blur-md bg-surface/50 p-8 md:p-10 rounded-3xl border border-stroke shadow-xl">
            <input type="hidden" name="access_key" value="76a4594d-6f73-47f1-b59e-7472327cdb0c" />
            
            <div className="relative group">
              <input
                className="w-full bg-transparent border-0 border-b-2 border-stroke/50 py-4 focus:ring-0 focus:border-[#89AACC] peer transition-colors font-medium text-text-primary placeholder-transparent outline-none"
                id="name"
                name="name"
                placeholder="Name"
                type="text"
                required
              />
              <label
                className="absolute left-0 top-4 text-muted uppercase text-xs tracking-widest font-bold pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#89AACC] peer-focus:text-[10px] peer-valid:-top-4 peer-valid:text-[10px]"
                htmlFor="name"
              >
                Name
              </label>
            </div>

            <div className="relative group">
              <input
                className="w-full bg-transparent border-0 border-b-2 border-stroke/50 py-4 focus:ring-0 focus:border-[#89AACC] peer transition-colors font-medium text-text-primary placeholder-transparent outline-none"
                id="email"
                name="email"
                placeholder="Email Address"
                type="email"
                required
              />
              <label
                className="absolute left-0 top-4 text-muted uppercase text-xs tracking-widest font-bold pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#89AACC] peer-focus:text-[10px] peer-valid:-top-4 peer-valid:text-[10px]"
                htmlFor="email"
              >
                Email Address
              </label>
            </div>

            <div className="relative group">
              <textarea
                className="w-full bg-transparent border-0 border-b-2 border-stroke/50 py-4 focus:ring-0 focus:border-[#89AACC] peer transition-colors resize-none font-medium text-text-primary placeholder-transparent outline-none min-h-[120px]"
                id="message"
                name="message"
                placeholder="Your Message"
                required
              />
              <label
                className="absolute left-0 top-4 text-muted uppercase text-xs tracking-widest font-bold pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#89AACC] peer-focus:text-[10px] peer-valid:-top-4 peer-valid:text-[10px]"
                htmlFor="message"
              >
                Your Message
              </label>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full group relative flex items-center justify-center rounded-full bg-transparent border border-stroke text-text-primary py-5 hover:border-transparent transition-all overflow-hidden"
              type="submit"
            >
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-[1px] bg-bg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 text-xs font-bold uppercase tracking-[0.3em]">
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </span>
            </button>
            
            {formStatus && (
              <div className={cn("text-xs font-bold uppercase tracking-wider text-center mt-4", formStatus.includes("Success") ? "text-green-400" : "text-amber-400")}>
                {formStatus}
              </div>
            )}
          </form>
        </div>

        {/* Footer Bar */}
        <div className="w-full max-w-[1200px] px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-stroke/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted uppercase tracking-widest">{ui?.availabilityText || "Available for projects"}</span>
            </div>
            <a href="/admin.html" className="text-[10px] font-mono text-muted/40 hover:text-[#89AACC] transition-all flex items-center gap-2 group">
              <Lock className="w-3 h-3 group-hover:scale-110 transition-transform" />
              CONSOLE_ACCESS
            </a>
          </div>

          <div className="flex gap-6">
            <a href="https://github.com/abhisheksingh995639" target="_blank" rel="noreferrer" className="text-sm text-muted hover:text-[#89AACC] transition-colors">GitHub</a>
            <a href="https://linkedin.com/in/abhisheksingh995639" target="_blank" rel="noreferrer" className="text-sm text-muted hover:text-[#89AACC] transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
