import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, X } from "lucide-react";

export default function Track() {
  const [newTrigger, setNewTrigger] = useState({ name: "", category: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: triggers = [] } = useQuery({
    queryKey: ["/api/triggers"],
  });

  const createTriggerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/triggers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/triggers"] });
      setNewTrigger({ name: "", category: "" });
      toast({
        title: "Trigger added",
        description: "New trigger has been added to your list.",
      });
    },
  });

  const deleteTriggerMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/triggers/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/triggers"] });
      toast({
        title: "Trigger removed",
        description: "Trigger has been removed from your list.",
      });
    },
  });

  const handleAddTrigger = () => {
    if (!newTrigger.name || !newTrigger.category) {
      toast({
        title: "Missing information",
        description: "Please enter both trigger name and category.",
        variant: "destructive",
      });
      return;
    }

    createTriggerMutation.mutate(newTrigger);
  };

  const triggerCategories = [
    { value: "food", label: "Food & Drink" },
    { value: "stress", label: "Stress" },
    { value: "weather", label: "Weather" },
    { value: "sleep", label: "Sleep" },
    { value: "exercise", label: "Exercise" },
    { value: "environment", label: "Environment" },
    { value: "hormonal", label: "Hormonal" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl-accessible font-bold text-gray-900 dark:text-white mb-2">Track Triggers</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Identify and manage your migraine triggers to better understand your patterns.
          </p>
        </div>

        {/* Add New Trigger */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Trigger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="trigger-name">Trigger Name</Label>
              <Input
                id="trigger-name"
                value={newTrigger.name}
                onChange={(e) => setNewTrigger(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Red wine, Bright lights, Stress at work"
              />
            </div>
            <div>
              <Label htmlFor="trigger-category">Category</Label>
              <Select
                value={newTrigger.category}
                onValueChange={(value) => setNewTrigger(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {triggerCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAddTrigger}
              disabled={createTriggerMutation.isPending}
              className="w-full"
            >
              <Plus className="mr-2" size={16} />
              {createTriggerMutation.isPending ? "Adding..." : "Add Trigger"}
            </Button>
          </CardContent>
        </Card>

        {/* Current Triggers */}
        <Card>
          <CardHeader>
            <CardTitle>Your Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            {triggers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No triggers added yet. Add your first trigger above.
              </p>
            ) : (
              <div className="space-y-2">
                {triggers.map((trigger) => (
                  <div
                    key={trigger.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {trigger.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {trigger.category}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTriggerMutation.mutate(trigger.id)}
                      disabled={deleteTriggerMutation.isPending}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
