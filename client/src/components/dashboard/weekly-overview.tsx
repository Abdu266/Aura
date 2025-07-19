import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import WeeklyChart from "@/components/charts/weekly-chart";

export default function WeeklyOverview() {
  const { data: weeklyData } = useQuery({
    queryKey: ["/api/analytics/weekly-episodes"],
  });

  const { data: thisWeekCount } = useQuery({
    queryKey: ["/api/analytics/episode-count"],
    select: (data) => data?.count || 0,
  });

  const { data: lastWeekCount } = useQuery({
    queryKey: ["/api/analytics/episode-count", { params: { days: 14 } }],
    select: (data) => data?.count || 0,
  });

  const improvement = lastWeekCount ? thisWeekCount - (lastWeekCount - thisWeekCount) : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">This Week</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{thisWeekCount || 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Episodes</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${improvement <= 0 ? 'text-accent' : 'text-red-500'}`}>
              {improvement <= 0 ? improvement : `+${improvement}`}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">vs Last Week</div>
          </div>
        </div>
        
        <div className="mt-4">
          <WeeklyChart data={weeklyData || []} />
        </div>
      </CardContent>
    </Card>
  );
}
