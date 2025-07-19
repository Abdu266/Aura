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
import { Plus, Pill, Clock, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Medications() {
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    type: "",
    instructions: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: medications = [] } = useQuery({
    queryKey: ["/api/medications"],
  });

  const { data: medicationLogs = [] } = useQuery({
    queryKey: ["/api/medication-logs"],
    select: (data) => data?.slice(0, 10) || [],
  });

  const createMedicationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/medications", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medications"] });
      setNewMedication({ name: "", dosage: "", type: "", instructions: "" });
      setShowAddForm(false);
      toast({
        title: "Medication added",
        description: "New medication has been added to your list.",
      });
    },
  });

  const logMedicationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/medication-logs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medication-logs"] });
      toast({
        title: "Medication logged",
        description: "Your medication has been recorded.",
      });
    },
  });

  const deleteMedicationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/medications/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medications"] });
      toast({
        title: "Medication removed",
        description: "Medication has been removed from your list.",
      });
    },
  });

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.type) {
      toast({
        title: "Missing information",
        description: "Please enter medication name and type.",
        variant: "destructive",
      });
      return;
    }

    createMedicationMutation.mutate(newMedication);
  };

  const handleLogMedication = (medicationId: number) => {
    logMedicationMutation.mutate({
      medicationId,
      takenAt: new Date().toISOString(),
    });
  };

  const medicationTypes = [
    { value: "preventive", label: "Preventive" },
    { value: "abortive", label: "Abortive" },
    { value: "rescue", label: "Rescue" },
  ];

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl-accessible font-bold text-gray-900 dark:text-white mb-2">Medications</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your medications and track when you take them.
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            variant="outline"
            size="sm"
          >
            <Plus size={16} className="mr-1" />
            Add
          </Button>
        </div>

        {/* Add Medication Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Medication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="med-name">Medication Name</Label>
                <Input
                  id="med-name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Sumatriptan, Ibuprofen"
                />
              </div>
              <div>
                <Label htmlFor="med-dosage">Dosage</Label>
                <Input
                  id="med-dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 50mg, 200mg"
                />
              </div>
              <div>
                <Label htmlFor="med-type">Type</Label>
                <Select
                  value={newMedication.type}
                  onValueChange={(value) => setNewMedication(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select medication type" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="med-instructions">Instructions</Label>
                <Textarea
                  id="med-instructions"
                  value={newMedication.instructions}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="When and how to take this medication..."
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMedication}
                  disabled={createMedicationMutation.isPending}
                  className="flex-1"
                >
                  {createMedicationMutation.isPending ? "Adding..." : "Add Medication"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Your Medications</CardTitle>
          </CardHeader>
          <CardContent>
            {medications.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No medications added yet.
              </p>
            ) : (
              <div className="space-y-3">
                {medications.map((medication) => (
                  <div key={medication.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {medication.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {medication.dosage} • {medication.type}
                        </div>
                        {medication.instructions && (
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {medication.instructions}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMedicationMutation.mutate(medication.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <Button
                      onClick={() => handleLogMedication(medication.id)}
                      disabled={logMedicationMutation.isPending}
                      className="w-full"
                      size="sm"
                    >
                      <Pill className="mr-2" size={16} />
                      Log as Taken
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Medication Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {medicationLogs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No medication logs yet.
              </p>
            ) : (
              <div className="space-y-3">
                {medicationLogs.map((log) => (
                  <div key={log.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Pill className="text-blue-600 dark:text-blue-400" size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        Medication taken
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(log.takenAt), { addSuffix: true })}
                      </div>
                    </div>
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
