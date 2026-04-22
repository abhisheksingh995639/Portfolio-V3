import { useState, useEffect, lazy, Suspense } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import { LoadingScreen } from "./components/LoadingScreen";
import { Hero } from "./components/Hero";
import { SelectedWorks } from "./components/SelectedWorks";
import { About } from "./components/About";
import { SmoothScroll } from "./components/SmoothScroll";

// Lazy load below-the-fold components
const Journal = lazy(() => import("./components/Journal").then(m => ({ default: m.Journal })));
const Stats = lazy(() => import("./components/Stats").then(m => ({ default: m.Stats })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const TechStack = lazy(() => import("./components/TechStack").then(m => ({ default: m.TechStack })));

export interface PortfolioData {
  general?: {
    tagline?: string;
    about?: string;
    resumeUrl?: string;
    stats?: { stat1Value?: number | string; stat2Value?: number | string; stat3Value?: number | string };
  };
  projects?: Array<{ title: string; imageUrl: string; desc: string; tags: string; github: string; link: string }>;
  experience?: Array<{ date: string; role: string; company: string; desc: string }>;
  skills?: Array<{ name: string; category: string }>;
  languages?: Array<{ name: string; level: string; pct: number }>;
  ui?: {
    hero: { roles: string[]; collectionYear: string; scrollText: string; seeWorksBtn: string; reachOutBtn: string; sayHiBtn: string; livesInText: string };
    footer: { marquee: string[]; contactTitle: string; contactDesc: string; availabilityText: string };
    loading: { words: string[]; label: string };
    sections: { 
      about: { label: string; tagline: string }; 
      works: { label: string; subtitle: string }; 
      journal: { label: string; subtitle: string };
    };
  };
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, "portfolio", "data");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data() as PortfolioData);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen ui={data?.ui?.loading} onComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <SmoothScroll>
          <main className="w-full bg-bg text-text-primary min-h-screen">
            <Hero data={data} />
            <About ui={data?.ui?.sections?.about} aboutText={data?.general?.about || ""} languages={data?.languages || []} />
            <SelectedWorks ui={data?.ui?.sections?.works} projects={data?.projects || []} />
            
            <Suspense fallback={null}>
              <TechStack skills={data?.skills || []} />
              <Journal ui={data?.ui?.sections?.journal} experiences={data?.experience || []} />
              <Stats data={data} />
              <Footer ui={data?.ui?.footer} />
            </Suspense>
          </main>
        </SmoothScroll>
      )}
    </>
  );
}

export default App;
