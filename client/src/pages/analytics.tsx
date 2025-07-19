import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingDown, TrendingUp, Clock } from "lucide-react";
import WeeklyChart from "@/components/charts/weekly-chart";

export default function Analytics() {
  const { data: weeklyData = [] } = useQuery({
    queryKey: ["/api/analytics/weekly-episodes"],
  });

  const { data: thisWeekCount = 0 } = useQuery({
    queryKey: ["/api/analytics/episode-count"],
    select: (data) => data?.count || 0,
  });

  const { data: thisMonthCount = 0 } = useQuery({
    queryKey: ["/api/analytics/episode-count", { params: { days: 30 } }],
    select: (data) => data?.count || 0,
  });

  const { data: episodes = [] } = useQuery({
    queryKey: ["/api/episodes"],
    select: (data) => data?.slice(0, 10) || [],
  });

  // Calculate averages
  const avgPainLevel = episodes.length > 0 
    ? (episodes.reduce((sum, ep) => sum + ep.painLevel, 0) / episodes.length).toFixed(1)
    : "0";

  const avgDuration = episodes.length > 0
    ? Math.round(episodes.filter(ep => ep.duration).reduce((sum, ep) => sum + (ep.duration || 0), 0) / episodes.filter(ep => ep.duration).length)
    : 0;

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl-accessible font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your migraine patterns and trends over time.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Calendar className="text-primary" size={20} />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{thisWeekCount}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-orange-500" size={20} />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{thisMonthCount}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingDown className="text-red-500" size={20} />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgPainLevel}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Avg Pain Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="text-blue-500" size={20} />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgDuration}h</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Avg Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyChart data={weeklyData} />
            <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-200 dark:bg-red-800 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Episode Days</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Migraine-Free Days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Episodes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            {episodes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No episodes recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {episodes.slice(0, 5).map((episode) => (
                  <div key={episode.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        Pain Level {episode.painLevel}/10
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(episode.startTime).toLocaleDateString()}
                        {episode.duration && ` • ${episode.duration} minutes`}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      episode.painLevel <= 3 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : episode.painLevel <= 6
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {episode.painLevel <= 3 ? 'Mild' : episode.painLevel <= 6 ? 'Moderate' : 'Severe'}
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
