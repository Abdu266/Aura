import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X, Utensils, Cloud, Bed } from "lucide-react";

interface EpisodeLoggingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EpisodeLoggingModal({ open, onOpenChange }: EpisodeLoggingModalProps) {
  const [painLevel, setPainLevel] = useState<number | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: triggers = [] } = useQuery({
    queryKey: ["/api/triggers"],
    enabled: open,
  });

  const createEpisodeMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/episodes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Episode logged",
        description: "Your migraine episode has been recorded.",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log episode. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setPainLevel(null);
    setSelectedTriggers([]);
    setNotes("");
  };

  const handleSave = () => {
    if (!painLevel) {
      toast({
        title: "Pain level required",
        description: "Please select a pain level to continue.",
        variant: "destructive",
      });
      return;
    }

    createEpisodeMutation.mutate({
      painLevel,
      startTime: new Date().toISOString(),
      notes,
      triggers: selectedTriggers,
    });
  };

  const toggleTrigger = (triggerId: number) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(id => id !== triggerId)
        : [...prev, triggerId]
    );
  };

  const painLevelColors = (level: number) => {
    if (level <= 3) return "border-green-500 bg-green-500 text-white";
    if (level <= 6) return "border-yellow-500 bg-yellow-500 text-white";
    return "border-red-500 bg-red-500 text-white";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl-accessible font-semibold">Log Migraine Episode</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pain Level Selector */}
          <div>
            <Label className="block text-lg font-medium mb-3">Pain Level (1-10)</Label>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  onClick={() => setPainLevel(level)}
                  className={`p-3 text-lg font-semibold ${
                    painLevel === level 
                      ? painLevelColors(level)
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Triggers */}
          <div>
            <Label className="block text-lg font-medium mb-3">Possible Triggers</Label>
            <div className="grid grid-cols-2 gap-2">
              {triggers.slice(0, 4).map((trigger) => (
                <Button
                  key={trigger.id}
                  variant="outline"
                  onClick={() => toggleTrigger(trigger.id)}
                  className={`p-3 text-left ${
                    selectedTriggers.includes(trigger.id)
                      ? "bg-primary text-white border-primary"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {trigger.category === 'food' && <Utensils className="mr-2" size={16} />}
                  {trigger.category === 'weather' && <Cloud className="mr-2" size={16} />}
                  {trigger.category === 'sleep' && <Bed className="mr-2" size={16} />}
                  {trigger.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="block text-lg font-medium mb-3">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional symptoms or details..."
              className="min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createEpisodeMutation.isPending}
              className="flex-1 bg-primary text-white hover:bg-blue-700"
            >
              {createEpisodeMutation.isPending ? "Saving..." : "Save Episode"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
