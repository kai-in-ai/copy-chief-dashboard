import type { Metadata } from 'next';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatusBar } from '@/components/layout/StatusBar';
import { KeyboardShortcuts } from '@/components/layout/KeyboardShortcuts';
import { Providers } from '@/components/layout/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Copy Chief BLACK — Dashboard',
  description: 'HELIX Pipeline Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <KeyboardShortcuts />
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <StatusBar />
              <main className="flex-1 overflow-auto p-4">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
