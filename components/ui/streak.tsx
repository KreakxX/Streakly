import { Text, View } from "react-native";

const GRAY_COLOR = "#1f2937";

interface StreakProps {
  streak: number;
}

const Streak = ({ streak }: StreakProps) => {
  const totalBoxes = 119;
  const daysInWeek = 7;
  const totalWeeks = Math.ceil(totalBoxes / daysInWeek);

  const streakData = Array.from({ length: totalBoxes }, (_, i) =>
    i < streak ? Math.floor(Math.random() * 5) : -1
  );

  const weeks = Array.from({ length: totalWeeks }, (_, weekIdx) =>
    streakData.slice(weekIdx * daysInWeek, (weekIdx + 1) * daysInWeek)
  );

  return (
    <View className="p-4 bg-[#0f172a] rounded-lg shadow-md w-[270px] self-start relative bottom-5">
      <Text className="text-[14px] text-[#9ca3af] mb-2">Streak</Text>
      <View className="flex-row gap-1">
        {weeks.map((week, weekIdx) => (
          <View key={weekIdx} className="flex-col gap-1">
            {week.map((level, dayIdx) => {
              const globalDayIdx = weekIdx * daysInWeek + dayIdx + 1;
              return (
                <View
                  key={dayIdx}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor:
                      level === -1
                        ? GRAY_COLOR
                        : globalDayIdx % 10 === 0
                        ? "#93c5fd"
                        : "#3b82f6",
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Streak;
