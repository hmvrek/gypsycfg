"use client";

import { useState } from "react";
import { Link2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

interface LinkData {
  id: string;
  title: string;
  description: string;
  url: string;
  file_size: string;
  created_at: string;
}

interface LinkFormProps {
  onLinkAdd: (link: LinkData) => void;
}

export function LinkForm({ onLinkAdd }: LinkFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error: insertError } = await supabase
        .from("links")
        .insert({
          title: title.trim() || "My Link",
          description: description.trim() || "Click the button below to access your content.",
          url: url.trim(),
          file_size: fileSize.trim() || "Unknown",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onLinkAdd(data);
      
      // Reset form
      setTitle("");
      setDescription("");
      setUrl("");
      setFileSize("");
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
    } finally {
      setIsLoading(false);
    }
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
        onClick={() => setIsOpen(false)}
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
                Add New Link
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </h2>
              <p className="text-sm text-muted-foreground">Create a monetized download page</p>
            </div>
          </div>

          {/* Form */}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 h-11 border-border hover:bg-secondary"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Creating..."
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Link
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
