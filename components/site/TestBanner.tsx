'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BANNER_STORAGE_KEY = 'kvibe-test-banner-dismissed';

export function TestBanner() {
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem(BANNER_STORAGE_KEY);
    setIsDismissed(dismissed === 'true');
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
    setIsDismissed(true);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 border-b border-yellow-500/20 bg-yellow-500/10 backdrop-blur-sm">
      <div className="container flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span className="font-medium text-yellow-500">Site em Testes</span>
          <span className="hidden text-foreground/70 sm:inline">
            – Algumas funcionalidades ainda estão em desenvolvimento
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 rounded-full px-2 text-foreground/70 hover:text-foreground"
          onClick={handleDismiss}
          aria-label="Fechar banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
