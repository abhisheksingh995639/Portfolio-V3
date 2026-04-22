import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { AdminLogin } from "./components/AdminLogin";
import { ControlCenterLayout } from "./components/ControlCenterLayout";

export function AdminApp() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#89AACC]/20 border-t-[#89AACC] rounded-full animate-spin" />
          <p className="text-[10px] text-[#89AACC] uppercase tracking-[0.4em] animate-pulse">Establishing Uplink...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <ControlCenterLayout user={user} />;
}
