"use client";
import { useState } from "react";
import Header from "./components/Header";
import YouTubeForm from "./components/YouTubeForm";
import TopTracks from "./components/TopTracks";
import AuthModal from "./components/AuthModal";

export default function HomePage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState(0); // 0 = login, 1 = registrar

  const openModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-500 text-white">
    <Header
      onLoginClick={() => { setAuthTab(0); setAuthOpen(true); }}
      onRegisterClick={() => { setAuthTab(1); setAuthOpen(true); }}
    />

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-12 gap-4">
        <YouTubeForm />
        <TopTracks />
      </main>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab={authTab}
      />
    </div>
  );
}
