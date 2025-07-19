import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const { data: medicationLogs } = useQuery({
    queryKey: ["/api/medication-logs"],
    select: (data) => data?.slice(0, 3) || [],
  });

  const { data: reliefActivities } = useQuery({
    queryKey: ["/api/relief-activities"],
    select: (data) => data?.slice(0, 2) || [],
  });

  // Combine and sort activities
  const activities = [
    ...(medicationLogs?.map(log => ({
      id: `med-${log.id}`,
      title: `Took medication`,
      time: formatDistanceToNow(new Date(log.takenAt), { addSuffix: true }),
      icon: Pill,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    })) || []),
    ...(reliefActivities?.map(activity => ({
      id: `relief-${activity.id}`,
      title: `Completed ${activity.type} exercise`,
      time: formatDistanceToNow(new Date(activity.completedAt), { addSuffix: true }),
      icon: Check,
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900",
    })) || []),
  ].slice(0, 3);

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent activity to show
            </p>
          ) : (
            activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`${activity.iconColor} text-sm`} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
