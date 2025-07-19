import { Home, Plus, BarChart3, Pill, MoreHorizontal } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function BottomNavigation() {
  const [location, navigate] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/track", icon: Plus, label: "Track" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/medications", icon: Pill, label: "Meds" },
    { path: "/more", icon: MoreHorizontal, label: "More" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`flex-1 py-3 px-2 text-center rounded-none h-auto flex flex-col items-center gap-1 ${
                isActive 
                  ? "text-primary bg-blue-50 dark:bg-blue-900/20" 
                  : "text-gray-500 dark:text-gray-400 hover:text-primary"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
