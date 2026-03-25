"use client";

import { useState, useEffect, useRef } from "react";
import { X, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  downloadUrl?: string;
}

export function AdModal({ isOpen, onClose, onComplete }: AdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [canSkip, setCanSkip] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanSkip(false);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Try to inject ad script when modal opens
  useEffect(() => {
    if (!isOpen || !adContainerRef.current) return;

    // Clear previous content
    adContainerRef.current.innerHTML = '';

    // Create ad container div
    const adDiv = document.createElement('div');
    adDiv.id = 'modal-ad-container';
    adContainerRef.current.appendChild(adDiv);

    // The main ad script is already loaded in layout.tsx
    // This container will be used by the ad network
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={canSkip ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                {canSkip ? "Ad completed - Click continue" : `Please wait ${countdown}s...`}
              </span>
            </div>
            {canSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Ad Content Area */}
          <div className="p-6 space-y-6">
            {/* Ad Container - Adsterra will inject content here */}
            <div 
              ref={adContainerRef}
              className="aspect-video bg-secondary/50 rounded-xl border border-border flex items-center justify-center relative overflow-hidden min-h-[250px]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,107,255,0.1)_50%,transparent_75%)] bg-[length:200%_200%] animate-[shimmer_2s_infinite]" />
              <div className="text-center space-y-2 relative z-10">
                <div className="w-16 h-16 mx-auto rounded-xl bg-primary/20 flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Advertisement</p>
                <p className="text-xs text-muted-foreground/60">Loading ad content...</p>
              </div>
            </div>

            {/* Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Ads support our service and allow us to offer free downloads
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={!canSkip}
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {canSkip ? (
                <>
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Continue to download
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 mr-2 animate-pulse" />
                  Wait {countdown}s...
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
