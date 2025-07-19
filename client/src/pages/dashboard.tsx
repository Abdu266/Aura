import QuickActions from "@/components/dashboard/quick-actions";
import StatusCard from "@/components/dashboard/status-card";
import WeeklyOverview from "@/components/dashboard/weekly-overview";
import RecentActivity from "@/components/dashboard/recent-activity";
import AIInsights from "@/components/dashboard/ai-insights";

export default function Dashboard() {
  return (
    <>
      <QuickActions />
      <section className="p-4">
        <div className="max-w-lg mx-auto space-y-6">
          <StatusCard />
          <WeeklyOverview />
          <RecentActivity />
          <AIInsights />
        </div>
      </section>
    </>
  );
}
