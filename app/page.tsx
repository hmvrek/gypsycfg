"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { FloatingParticles } from "@/components/floating-particles";
import { LinkForm } from "@/components/link-form";
import { Shield, Zap, Globe, Link2, Copy, Check, ExternalLink, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface LinkData {
  id: string;
  title: string;
  description: string;
  url: string;
  file_size: string;
  short_id: string;
  created_at: string;
}

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && url.length > 0 && key.length > 0);
}

export default function Home() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    if (typeof window === "undefined") return;

    // Check if Supabase is configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("links")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setLinks(data);
          setIsLoading(false);
          return;
        }
      } catch {
        // Supabase failed
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadLinks();
  }, [loadLinks]);

  const handleAddLink = async (link: LinkData) => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("links")
          .insert({
            title: link.title,
            description: link.description,
            url: link.url,
            file_size: link.file_size,
            short_id: link.short_id,
          })
          .select()
          .single();

        if (!error && data) {
          setLinks([data, ...links]);
          return;
        }
      } catch {
        // Fall through
      }
    }

    // Fallback - just add to state
    setLinks([link, ...links]);
  };

  const handleDeleteLink = async (id: string) => {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from("links")
          .delete()
          .eq("id", id);

        if (!error) {
          setLinks(links.filter(l => l.id !== id));
          return;
        }
      } catch {
        // Fall through
      }
    }

    setLinks(links.filter(l => l.id !== id));
  };

  const getShortUrl = (shortId: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${shortId}`;
    }
    return `/${shortId}`;
  };

  const handleCopy = async (shortId: string) => {
    try {
      await navigator.clipboard.writeText(getShortUrl(shortId));
      setCopiedId(shortId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getShortUrl(shortId);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(shortId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

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
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-sm text-primary">
              <Zap className="w-4 h-4" />
              Link Management Panel
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Your{" "}
              <span className="text-primary">Links</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto text-pretty">
              Create shortened links with ad monetization. 
              Share them and earn from every visit.
            </p>
          </div>

          {/* Loading State */}
          {(!mounted || isLoading) && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Links List */}
          {mounted && !isLoading && links && links.length > 0 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="group relative bg-card/80 backdrop-blur-xl border border-border rounded-xl p-4 md:p-6 shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:border-primary/30"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Link Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Link2 className="w-6 h-6 text-primary" />
                    </div>

                    {/* Link Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate">{link.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{link.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs bg-secondary/50 px-2 py-1 rounded font-mono text-primary">
                          /{link.short_id}
                        </code>
                        <span className="text-xs text-muted-foreground">{link.file_size}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(link.short_id)}
                        className="h-9 px-3 border-border hover:bg-secondary hover:border-primary/30"
                      >
                        {copiedId === link.short_id ? (
                          <>
                            <Check className="w-4 h-4 mr-1 text-green-500" />
                            <span className="text-green-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      <a
                        href={getShortUrl(link.short_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 border-border hover:bg-secondary hover:border-primary/30"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                        className="h-9 px-3 border-border hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : mounted && !isLoading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <Link2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No links yet</h3>
                <p className="text-muted-foreground mb-4">
                  Click the + button to add your first monetized link
                </p>
              </div>
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

      {/* Add Link Button */}
      <LinkForm onLinkAdd={handleAddLink} />
    </main>
  );
}
