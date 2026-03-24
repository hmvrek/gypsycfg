"use client";

import { Link2, Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="relative z-20 w-full">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/30 transition-all duration-300">
              <Link2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                LinkBoost
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </h1>
              <p className="text-xs text-muted-foreground">Skracanie linków</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-foreground font-semibold">12.5K+</p>
              <p className="text-muted-foreground text-xs">Linków</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-foreground font-semibold">99.9%</p>
              <p className="text-muted-foreground text-xs">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
