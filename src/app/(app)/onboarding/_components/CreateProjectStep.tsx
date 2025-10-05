'use client';

import { motion } from 'framer-motion';
import { Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface CreateProjectStepProps {
  onNext: (projectData: { name: string; url: string }) => void;
  onBack: () => void;
  onSkip: () => void;
}

export function CreateProjectStep({ onNext, onBack, onSkip }: CreateProjectStepProps) {
  const [name, setName] = useState('My Website');
  const [url, setUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    onNext({ name, url });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div className="text-center space-y-2">
        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mx-auto">
          <Globe className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold">Create your first project</h2>
        <p className="text-muted-foreground">
          Tell us about the website you want to monitor
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="My Awesome Website"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <p className="text-sm text-muted-foreground">
            A friendly name to identify your project
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <p className="text-sm text-muted-foreground">
            The URL of the website you want to scan
          </p>
        </div>

        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="button" variant="ghost" onClick={onSkip}>
              Skip for now
            </Button>
          </div>
          <Button type="submit" disabled={isCreating || !url}>
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
