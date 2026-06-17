"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const AdminLogin = dynamic(() => import("./AdminLogin"), { ssr: false });
const AdminDashboard = dynamic(() => import("./AdminDashboard"), { ssr: false });

const AUTH_KEY = "wm_admin_auth";

export default function AdminLauncher() {
  const [showLogin, setShowLogin] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
  }, []);

  function handleLaunch() {
    if (authed) {
      // already signed in — reopening dashboard
      setShowLogin(false);
    } else {
      setShowLogin(true);
    }
  }

  function handleSuccess() {
    sessionStorage.setItem(AUTH_KEY, "1");
    setAuthed(true);
    setShowLogin(false);
  }

  function handleSignOut() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  }

  return (
    <>
      {!authed && (
        <button
          type="button"
          onClick={handleLaunch}
          aria-label="Admin access"
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/10 bg-white/80 text-ink-800/50 shadow-card backdrop-blur transition-all hover:scale-110 hover:text-watermelon-600"
        >
          <Lock className="h-4 w-4" />
        </button>
      )}

      <AnimatePresence>
        {showLogin && (
          <AdminLogin onClose={() => setShowLogin(false)} onSuccess={handleSuccess} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {authed && <AdminDashboard onSignOut={handleSignOut} />}
      </AnimatePresence>
    </>
  );
}
