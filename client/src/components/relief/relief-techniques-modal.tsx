import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Wind, Snowflake, Sparkles, Phone } from "lucide-react";

interface ReliefTechniquesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReliefTechniquesModal({ open, onOpenChange }: ReliefTechniquesModalProps) {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createReliefActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/relief-activities", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/relief-activities"] });
    },
  });

  const startBreathing = () => {
    toast({
      title: "Breathing Exercise Started",
      description: "Follow the 4-7-8 pattern: Breathe in for 4, hold for 7, exhale for 8.",
    });
    
    createReliefActivityMutation.mutate({
      type: "breathing",
      duration: 5,
      completedAt: new Date().toISOString(),
    });
  };

  const startColdTimer = () => {
    setActiveTimer("cold");
    toast({
      title: "Cold Therapy Timer",
      description: "15-minute timer started. Apply ice pack to forehead or neck.",
    });

    // Start 15-minute timer
    setTimeout(() => {
      setActiveTimer(null);
      toast({
        title: "Cold Therapy Complete",
        description: "15 minutes completed. How do you feel?",
      });
      
      createReliefActivityMutation.mutate({
        type: "cold_therapy",
        duration: 15,
        completedAt: new Date().toISOString(),
      });
    }, 15 * 60 * 1000); // 15 minutes
  };

  const startRelaxation = () => {
    toast({
      title: "Relaxation Session",
      description: "Starting progressive muscle relaxation. Find a comfortable position.",
    });
    
    createReliefActivityMutation.mutate({
      type: "relaxation",
      duration: 10,
      completedAt: new Date().toISOString(),
    });
  };

  const emergencyCall = () => {
    // In a real app, this would call the emergency contact
    toast({
      title: "Emergency Contact",
      description: "This feature would call your emergency contact.",
    });
  };

  const techniques = [
    {
      id: "breathing",
      title: "Breathing Exercise",
      description: "4-7-8 breathing technique to reduce stress and pain",
      icon: Wind,
      color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      action: startBreathing,
      buttonText: "Start Exercise",
    },
    {
      id: "cold",
      title: "Cold Therapy",
      description: "Apply ice pack to forehead or neck for 15-20 minutes",
      icon: Snowflake,
      color: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800",
      buttonColor: "bg-cyan-600 hover:bg-cyan-700",
      action: startColdTimer,
      buttonText: activeTimer === "cold" ? "Timer Running..." : "Start 15min Timer",
    },
    {
      id: "relaxation",
      title: "Progressive Relaxation",
      description: "Guided muscle relaxation technique",
      icon: Sparkles,
      color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      action: startRelaxation,
      buttonText: "Begin Session",
    },
    {
      id: "emergency",
      title: "Emergency Contact",
      description: "Call your emergency contact or doctor",
      icon: Phone,
      color: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      buttonColor: "bg-red-600 hover:bg-red-700",
      action: emergencyCall,
      buttonText: "Call Now",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md max-h-[80vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-xl-accessible font-semibold">Relief Techniques</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {techniques.map((technique) => {
            const Icon = technique.icon;
            return (
              <div key={technique.id} className={`border rounded-lg p-4 ${technique.color}`}>
                <div className="flex items-center mb-3">
                  <Icon className={`mr-3 text-xl ${technique.id === 'breathing' ? 'text-blue-600 dark:text-blue-400' : technique.id === 'cold' ? 'text-cyan-600 dark:text-cyan-400' : technique.id === 'relaxation' ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`} size={24} />
                  <h4 className="font-semibold text-gray-900 dark:text-white">{technique.title}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{technique.description}</p>
                <Button
                  onClick={technique.action}
                  disabled={activeTimer === technique.id}
                  className={`w-full py-2 text-white rounded-lg font-medium transition-colors ${technique.buttonColor}`}
                >
                  {technique.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
