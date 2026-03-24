"use client";

import { useState } from "react";
import { Download, Eye, Shield, Clock, CheckCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdModal } from "./ad-modal";

interface DownloadCardProps {
  id: string;
  title: string;
  description: string;
  fileSize?: string;
  downloadUrl: string;
  previewUrl?: string;
}

export function DownloadCard({ 
  id,
  title, 
  description, 
  fileSize = "Unknown", 
  downloadUrl,
  previewUrl,
}: DownloadCardProps) {
  void id;
  const [showAdModal, setShowAdModal] = useState(false);
  const [actionType, setActionType] = useState<"download" | "preview">("download");
  const [isCompleted, setIsCompleted] = useState(false);

  const handleDownloadClick = () => {
    setActionType("download");
    setShowAdModal(true);
  };

  const handlePreviewClick = () => {
    setActionType("preview");
    setShowAdModal(true);
  };

  const handleAdComplete = () => {
    setShowAdModal(false);
    setIsCompleted(true);
    
    // Open the target URL
    const targetUrl = actionType === "download" ? downloadUrl : (previewUrl || downloadUrl);
    window.open(targetUrl, "_blank");
    
    // Reset after a delay
    setTimeout(() => setIsCompleted(false), 3000);
  };

  return (
    <>
      <div className="group relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 md:p-8 shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.02] hover:border-primary/50">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Content */}
        <div className="relative space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
              <LinkIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground truncate">{title}</h2>
              <p className="text-muted-foreground mt-1 line-clamp-2">{description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Download className="w-4 h-4" />
              <span>{fileSize}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure link</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Permanent link</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownloadClick}
              className="flex-1 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
              disabled={isCompleted && actionType === "download"}
            >
              {isCompleted && actionType === "download" ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Download started!
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </>
              )}
            </Button>
            
            {previewUrl && (
              <Button
                onClick={handlePreviewClick}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-border hover:bg-secondary hover:border-primary/50 transition-all duration-300"
                disabled={isCompleted && actionType === "preview"}
              >
                {isCompleted && actionType === "preview" ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Opened!
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Preview
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground/70 text-center">
            Clicking the button will show an ad that supports our free service
          </p>
        </div>
      </div>

      <AdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onComplete={handleAdComplete}
        downloadUrl={actionType === "download" ? downloadUrl : (previewUrl || downloadUrl)}
      />
    </>
  );
}
