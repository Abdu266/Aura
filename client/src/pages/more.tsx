import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { apiRequest } from "@/lib/queryClient";
import { 
  Settings, 
  Download, 
  Phone, 
  Moon, 
  Type, 
  Contrast,
  User,
  FileText,
  HelpCircle 
} from "lucide-react";
import { useState } from "react";

export default function More() {
  const { toast } = useToast();
  const { theme, fontSize, highContrast, toggleTheme, setFontSize, toggleHighContrast } = useTheme();
  const queryClient = useQueryClient();
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");

  const { data: preferences } = useQuery({
    queryKey: ["/api/user/preferences"],
    onSuccess: (data) => {
      if (data) {
        setEmergencyContact(data.emergencyContact || "");
        setEmergencyContactName(data.emergencyContactName || "");
      }
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", "/api/user/preferences", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/preferences"] });
      toast({
        title: "Preferences updated",
        description: "Your settings have been saved.",
      });
    },
  });

  const handleSaveEmergencyContact = () => {
    updatePreferencesMutation.mutate({
      emergencyContact,
      emergencyContactName,
    });
  };

  const handleExportData = () => {
    // In a real app, this would generate and download a report
    toast({
      title: "Export started",
      description: "Your migraine data report will be ready for download shortly.",
    });
  };

  const settingSections = [
    {
      title: "Display Settings",
      icon: Settings,
      items: [
        {
          label: "Dark Mode",
          icon: Moon,
          control: (
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          ),
        },
        {
          label: "Font Size",
          icon: Type,
          control: (
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          ),
        },
        {
          label: "High Contrast",
          icon: Contrast,
          control: (
            <Switch
              checked={highContrast}
              onCheckedChange={toggleHighContrast}
            />
          ),
        },
      ],
    },
    {
      title: "Emergency Contact",
      icon: Phone,
      items: [
        {
          label: "Contact Name",
          icon: User,
          control: (
            <Input
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              placeholder="Dr. Smith"
              className="w-32"
            />
          ),
        },
        {
          label: "Phone Number",
          icon: Phone,
          control: (
            <Input
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-32"
            />
          ),
        },
      ],
    },
  ];

  const actionItems = [
    {
      label: "Export Data",
      description: "Download your migraine data for doctor visits",
      icon: Download,
      action: handleExportData,
    },
    {
      label: "Help & Support",
      description: "Get help using the app",
      icon: HelpCircle,
      action: () => toast({ title: "Help", description: "Help documentation would open here." }),
    },
    {
      label: "Privacy Policy",
      description: "Review our privacy policy",
      icon: FileText,
      action: () => toast({ title: "Privacy", description: "Privacy policy would open here." }),
    },
  ];

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl-accessible font-bold text-gray-900 dark:text-white mb-2">More</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your app settings and access additional features.
          </p>
        </div>

        {/* Settings Sections */}
        {settingSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SectionIcon size={20} />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ItemIcon size={16} className="text-gray-500 dark:text-gray-400" />
                        <Label className="text-gray-900 dark:text-white">{item.label}</Label>
                      </div>
                      {item.control}
                    </div>
                  );
                })}
                {section.title === "Emergency Contact" && (
                  <Button
                    onClick={handleSaveEmergencyContact}
                    disabled={updatePreferencesMutation.isPending}
                    className="w-full mt-4"
                  >
                    Save Emergency Contact
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.label}
                  variant="ghost"
                  onClick={item.action}
                  className="w-full justify-start h-auto p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={20} className="text-gray-500 dark:text-gray-400" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Aura</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">by TechNeurology</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Version 1.0.0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
