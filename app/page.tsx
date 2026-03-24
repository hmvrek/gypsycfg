"use client";

import { Header } from "@/components/header";
import { DownloadCard } from "@/components/download-card";
import { FloatingParticles } from "@/components/floating-particles";
import { Shield, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image with Blur and Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/images/background.jpg')" }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background/50" />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-20">
        <Header />

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-sm text-primary">
              <Zap className="w-4 h-4" />
              Szybkie i bezpieczne pobieranie
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Twój link jest{" "}
              <span className="text-primary">gotowy</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto text-pretty">
              Kliknij poniżej, aby pobrać plik lub zobaczyć zawartość. 
              Reklamy wspierają nasz darmowy serwis.
            </p>
          </div>

          {/* Download Card */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <DownloadCard
              title="Przykładowy plik"
              description="Kliknij przycisk poniżej, aby rozpocząć pobieranie. Link jest aktywny przez 24 godziny."
              fileSize="12.5 MB"
              downloadUrl="https://example.com/download"
              previewUrl="https://example.com/preview"
            />
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="text-center space-y-3 p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Bezpieczne linki</h3>
              <p className="text-sm text-muted-foreground">Wszystkie pliki są skanowane pod kątem wirusów</p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Błyskawiczne pobieranie</h3>
              <p className="text-sm text-muted-foreground">Szybkie serwery na całym świecie</p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Globalny dostęp</h3>
              <p className="text-sm text-muted-foreground">Dostępne z każdego miejsca na świecie</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-20 border-t border-border/50 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>&copy; 2026 LinkBoost. Wszystkie prawa zastrzeżone.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-foreground transition-colors">Regulamin</a>
                <a href="#" className="hover:text-foreground transition-colors">Polityka prywatności</a>
                <a href="#" className="hover:text-foreground transition-colors">Kontakt</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
