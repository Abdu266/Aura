import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";

export default function AIInsights() {
  const { data: insights } = useQuery({
    queryKey: ["/api/insights"],
    select: (data) => data?.slice(0, 2) || [],
  });

  // Mock insights if none available
  const mockInsights = [
    {
      id: 1,
      type: "pattern",
      title: "Pattern Detected",
      message: "Weather pressure drops may trigger episodes. Consider monitoring barometric changes.",
      confidence: 0.85,
    },
    {
      id: 2,
      type: "prediction",
      title: "Tomorrow's Forecast",
      message: "Low risk based on your patterns. Good day for outdoor activities.",
      confidence: 0.72,
    },
  ];

  const displayInsights = insights && insights.length > 0 ? insights : mockInsights;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">AI Insights</h3>
        <div className="space-y-4">
          {displayInsights.map((insight, index) => (
            <div
              key={insight.id}
              className={`border rounded-lg p-4 ${
                index === 0
                  ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className="flex items-start space-x-3">
                {index === 0 ? (
                  <TrendingUp className="text-yellow-600 dark:text-yellow-400 mt-1" size={20} />
                ) : (
                  <Calendar className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {insight.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
