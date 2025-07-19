import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function StatusCard() {
  const { data: episodeCount } = useQuery({
    queryKey: ["/api/analytics/episode-count"],
  });

  // Calculate hours without migraine (mock for now)
  const hoursWithoutMigraine = "18h";
  const dailyInsight = "Your sleep pattern has improved this week - keep it up!";

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Today's Status</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-lg text-gray-700 dark:text-gray-300">Migraine-Free</span>
          </div>
          <span className="text-2xl font-bold text-accent">{hoursWithoutMigraine}</span>
        </div>
        <div className="mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Lightbulb className="inline text-yellow-500 mr-2" size={16} />
            {dailyInsight}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
