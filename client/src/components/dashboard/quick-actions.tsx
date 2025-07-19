import { useState } from "react";
import { AlertCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import EpisodeLoggingModal from "@/components/episode/episode-logging-modal";
import ReliefTechniquesModal from "@/components/relief/relief-techniques-modal";

export default function QuickActions() {
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [showReliefModal, setShowReliefModal] = useState(false);

  return (
    <>
      <section className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl-accessible font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowEpisodeModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white p-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[120px] flex flex-col items-center justify-center"
            >
              <AlertCircle size={32} className="mb-2" />
              <span className="font-semibold text-lg">Log Episode</span>
            </Button>
            
            <Button
              onClick={() => setShowReliefModal(true)}
              className="bg-accent hover:bg-green-600 text-white p-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 min-h-[120px] flex flex-col items-center justify-center"
            >
              <Heart size={32} className="mb-2" />
              <span className="font-semibold text-lg">Relief Help</span>
            </Button>
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
