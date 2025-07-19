interface WeeklyChartProps {
  data: { date: string; count: number }[];
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div>
      <div className="flex items-end space-x-2 h-20">
        {data.slice(-7).map((day, index) => {
          const height = (day.count / maxCount) * 80;
          const isEpisodeDay = day.count > 0;
          
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full rounded-t transition-all duration-300 ${
                  isEpisodeDay 
                    ? 'bg-red-200 dark:bg-red-800' 
                    : 'bg-green-200 dark:bg-green-800'
                }`}
                style={{ height: Math.max(height, 8) }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        {dayLabels.map(label => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
