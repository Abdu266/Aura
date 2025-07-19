import { ReactNode } from "react";
import AppHeader from "./app-header";
import BottomNavigation from "./bottom-navigation";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark">
      <AppHeader />
      <main className="pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
