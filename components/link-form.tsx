"use client";

import { useState } from "react";
import { Link2, Plus, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LinkData {
  id: string;
  title: string;
  description: string;
  url: string;
  file_size: string;
  short_id: string;
  created_at: string;
}

interface LinkFormProps {
  onLinkAdd: (link: LinkData) => void;
}

// Generate a random short ID (8 characters)
function generateShortId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function LinkForm({ onLinkAdd }: LinkFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [error, setError] = useState("");
  const [createdLink, setCreatedLink] = useState<LinkData | null>(null);
  const [copied, setCopied] = useState(false);

  const getShortUrl = (shortId: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/${shortId}`;
    }
    return `/${shortId}`;
  };

  const handleCopy = async () => {
    if (!createdLink) return;
    
    try {
      await navigator.clipboard.writeText(getShortUrl(createdLink.short_id));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getShortUrl(createdLink.short_id);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL (include https://)");
      return;
    }

    // Generate short ID
    const shortId = generateShortId();

    // Create link data with unique ID
    const newLink: LinkData = {
      id: crypto.randomUUID(),
      title: title.trim() || "My Link",
      description: description.trim() || "Click the button below to access your content.",
      url: url.trim(),
      file_size: fileSize.trim() || "Unknown",
      short_id: shortId,
      created_at: new Date().toISOString(),
    };

    onLinkAdd(newLink);
    setCreatedLink(newLink);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedLink(null);
    setTitle("");
    setDescription("");
    setUrl("");
    setFileSize("");
    setCopied(false);
  };

  const handleAddAnother = () => {
    setCreatedLink(null);
    setTitle("");
    setDescription("");
    setUrl("");
    setFileSize("");
    setCopied(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl shadow-primary/30 bg-primary hover:bg-primary/90 hover:scale-110 transition-all duration-300 z-40"
      >
        <Plus className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border bg-secondary/30">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Link2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                {createdLink ? "Link Created!" : "Add New Link"}
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </h2>
              <p className="text-sm text-muted-foreground">
                {createdLink ? "Share this link with others" : "Add a new config link"}
              </p>
            </div>
          </div>

          {/* Success State - Show shortened link */}
          {createdLink ? (
            <div className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{createdLink.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your shortened link is ready</p>
                </div>
              </div>

              {/* Shortened URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Shortened URL</label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={getShortUrl(createdLink.short_id)}
                    className="h-11 bg-secondary/50 border-border font-mono text-sm"
                  />
                  <Button
                    type="button"
                    onClick={handleCopy}
                    className="h-11 px-4 bg-primary hover:bg-primary/90"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-green-500">Copied to clipboard!</p>
                )}
              </div>

              {/* Preview Link */}
              <a
                href={getShortUrl(createdLink.short_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                Open link in new tab
              </a>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-11 border-border hover:bg-secondary"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={handleAddAnother}
                  className="flex-1 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another
                </Button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  URL <span className="text-destructive">*</span>
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/your-file"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-11 bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  type="text"
                  placeholder="My awesome file"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Input
                  type="text"
                  placeholder="A brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-11 bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">File Size</label>
                <Input
                  type="text"
                  placeholder="e.g. 25 MB"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="h-11 bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-11 border-border hover:bg-secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Link
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
