import type { ReactNode } from 'react';
import { Header, type View } from './Header';

export type { View };

interface LayoutProps {
  children: ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  return (
    <div className="app">
      <Header currentView={currentView} onNavigate={onNavigate} />
      <main className="main">{children}</main>
    </div>
  );
}
