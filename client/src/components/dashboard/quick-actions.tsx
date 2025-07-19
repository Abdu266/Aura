import { useState } from "react";
import { AlertCircle, Heart, Pill, FileText, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import EpisodeLoggingModal from "@/components/episode/episode-logging-modal";
import ReliefTechniquesModal from "@/components/relief/relief-techniques-modal";

export default function QuickActions() {
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [showReliefModal, setShowReliefModal] = useState(false);
  const [, navigate] = useLocation();

  const quickActionItems = [
    {
      title: "Log Episode",
      icon: AlertCircle,
      color: "bg-red-500 hover:bg-red-600",
      action: () => setShowEpisodeModal(true),
    },
    {
      title: "Relief Help",
      icon: Heart,
      color: "bg-accent hover:bg-green-600",
      action: () => setShowReliefModal(true),
    },
    {
      title: "Medications",
      icon: Pill,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => navigate("/medications"),
    },
    {
      title: "Analytics",
      icon: BarChart3,
      color: "bg-purple-500 hover:bg-purple-600",
      action: () => navigate("/analytics"),
    },
    {
      title: "Track Triggers",
      icon: Clock,
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => navigate("/track"),
    },
    {
      title: "Export Report",
      icon: FileText,
      color: "bg-gray-500 hover:bg-gray-600",
      action: () => {
        // Mock export functionality
        alert("Export feature would generate a report for your doctor");
      },
    },
  ];

  return (
    <>
      <section className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl-accessible font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActionItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.title}
                  onClick={item.action}
                  className={`${item.color} text-white p-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[100px] flex flex-col items-center justify-center`}
                >
                  <Icon size={24} className="mb-2" />
                  <span className="font-medium text-sm text-center">{item.title}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <EpisodeLoggingModal 
        open={showEpisodeModal} 
        onOpenChange={setShowEpisodeModal} 
      />
      <ReliefTechniquesModal 
        open={showReliefModal} 
        onOpenChange={setShowReliefModal} 
      />
    </>
  );
}
