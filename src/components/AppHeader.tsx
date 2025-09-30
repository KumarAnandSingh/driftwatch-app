'use client';

import Link from 'next/link';
import { Eye, Plus, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { signOut } from 'next-auth/react';

interface AppHeaderProps {
  currentPath?: string;
  userName?: string;
  userEmail?: string;
}

export function AppHeader({ currentPath, userName, userEmail }: AppHeaderProps) {
  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : userEmail?.charAt(0).toUpperCase() || 'U';

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(280,80%,50%)] shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">DriftWatch</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                currentPath === '/dashboard'
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Projects
            </Link>
            <Link
              href="/billing"
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                currentPath === '/billing'
                  ? 'bg-accent text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Billing
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="gap-2" asChild>
            <Link href="/new-project">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                  {initials}
                </div>
                <span className="hidden sm:inline">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
