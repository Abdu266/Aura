import { Brain, Moon, Sun, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useLocation } from "wouter";

export default function AppHeader() {
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Brain className="text-white text-sm" size={16} />
            </div>
            <div>
              <h1 className="text-xl-accessible font-semibold text-gray-900 dark:text-white">Aura</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">by TechNeurology</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="text-yellow-400" size={16} />
              ) : (
                <Moon className="text-gray-600" size={16} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/more")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Open settings"
            >
              <Settings className="text-gray-600 dark:text-gray-300" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
