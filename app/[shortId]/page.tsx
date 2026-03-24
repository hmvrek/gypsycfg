"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { DownloadCard } from "@/components/download-card";
import { FloatingParticles } from "@/components/floating-particles";
import { Shield, Zap, Globe, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LinkData {
  id: string;
  title: string;
  description: string;
  url: string;
  file_size: string;
  short_id: string;
  created_at: string;
}

export default function DownloadPage() {
  const params = useParams();
  const shortId = params.shortId as string;
  
  const [link, setLink] = useState<LinkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLink() {
      if (!shortId) {
        setError("Invalid link");
        setIsLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("links")
          .select("*")
          .eq("short_id", shortId)
          .single();

        if (fetchError || !data) {
          setError("Link not found or has expired");
          setIsLoading(false);
          return;
        }

        setLink(data);
      } catch {
        setError("Failed to load link");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLink();
  }, [shortId]);

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
              Fast and secure downloads
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Your link is{" "}
              <span className="text-primary">ready</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto text-pretty">
              Click below to download or preview your content. 
              Ads support our free service.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground">Loading your download...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="bg-card/60 backdrop-blur-xl border border-destructive/50 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Link Not Found</h3>
                <p className="text-muted-foreground mb-4">
                  {error}
                </p>
                <a 
                  href="/"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  Go back to homepage
                </a>
              </div>
            </div>
          )}

          {/* Download Card */}
          {!isLoading && !error && link && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <DownloadCard
                id={link.id}
                title={link.title}
                description={link.description}
                fileSize={link.file_size}
                downloadUrl={link.url}
                previewUrl={link.url}
              />
            </div>
          )}

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="text-center space-y-3 p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Secure Links</h3>
              <p className="text-sm text-muted-foreground">All files are scanned for viruses and malware</p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">High-speed servers around the globe</p>
            </div>

            <div className="text-center space-y-3 p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Global Access</h3>
              <p className="text-sm text-muted-foreground">Available from anywhere in the world</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-20 border-t border-border/50 mt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>&copy; 2026 GypsyCFG. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
