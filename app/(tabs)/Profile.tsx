import PieChart from "@/components/ui/HabitDonutPieChart";
import LineChart from "@/components/ui/LineChart";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { RadarChart } from "@salmonco/react-native-radar-chart";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function ProfileScreen() {
  const streakBadges = [
    { days: 2, icon: "fire", color: "#FFE082" },
    { days: 5, icon: "fire", color: "#FFB300" },
    { days: 10, icon: "fire", color: "#FF6F00" },
    { days: 15, icon: "gem", color: "#B2EBF2" },
    { days: 20, icon: "gem", color: "#00BCD4" },
    { days: 30, icon: "gem", color: "#00838F" },
    { days: 40, icon: "crown", color: "#FFF176" },
    { days: 50, icon: "crown", color: "#FDD835" },
    { days: 60, icon: "crown", color: "#FBC02D" },
    { days: 70, icon: "trophy", color: "#D1C4E9" },
    { days: 80, icon: "trophy", color: "#9575CD" },
    { days: 90, icon: "trophy", color: "#673AB7" },
    { days: 100, icon: "medal", color: "#FFD54F" },
    { days: 120, icon: "medal", color: "#FFB300" },
    { days: 140, icon: "medal", color: "#FF8F00" },
    { days: 160, icon: "star", color: "#FFF59D" },
    { days: 180, icon: "star", color: "#FFEB3B" },
    { days: 200, icon: "star", color: "#FBC02D" },
    { days: 230, icon: "shield-alt", color: "#B0BEC5" },
    { days: 260, icon: "shield-alt", color: "#78909C" },
    { days: 290, icon: "shield-alt", color: "#546E7A" },
    { days: 320, icon: "bolt", color: "#E1F5FE" },
    { days: 350, icon: "bolt", color: "#4FC3F7" },
    { days: 400, icon: "bolt", color: "#0288D1" },
    { days: 450, icon: "brain", color: "#F8BBD0" },
    { days: 500, icon: "brain", color: "#F06292" },
    { days: 550, icon: "brain", color: "#C2185B" },
    { days: 600, icon: "rocket", color: "#C8E6C9" },
    { days: 650, icon: "rocket", color: "#81C784" },
    { days: 700, icon: "rocket", color: "#388E3C" },
    { days: 800, icon: "bullseye", color: "#D7CCC8" },
    { days: 900, icon: "bullseye", color: "#A1887F" },
    { days: 1000, icon: "bullseye", color: "#5D4037" },
    { days: 1100, icon: "infinity", color: "#B3E5FC" },
    { days: 1200, icon: "infinity", color: "#03A9F4" },
    { days: 1300, icon: "infinity", color: "#01579B" },
    { days: 1500, icon: "cannabis", color: "#CE93D8" },
    { days: 1700, icon: "cannabis", color: "#AB47BC" },
    { days: 1900, icon: "cannabis", color: "#6A1B9A" },
    { days: 2100, icon: "ghost", color: "#FFF9C4" },
    { days: 2300, icon: "ghost", color: "#FBC02D" },
    { days: 2500, icon: "ghost", color: "#F57F17" },
  ];

  const badgeCategories = [
    { title: "Beginner", badges: streakBadges.slice(0, 6) },
    { title: "Novice", badges: streakBadges.slice(6, 12) },
    { title: "Advanced", badges: streakBadges.slice(12, 18) },
    { title: "Professional", badges: streakBadges.slice(18, 24) },
    { title: "Expert", badges: streakBadges.slice(24, 30) },
    { title: "Master", badges: streakBadges.slice(30, 36) },
    { title: "Grandmaster", badges: streakBadges.slice(36, 42) },
  ];

  type StreakBadge = {
    days: number;
    icon: string;
    color: string;
    date?: string;
  };

  const [highestStreak, setHighestStreak] = useState<string>("");
  const [badges, setBadges] = useState<StreakBadge[]>([]);
  const [colorSchem, setColorScheme] = useState<String>("dark");
  const [activeTab, setActiveTab] = useState<string>("weekly");
  const [analysis, setAnalysis] = useState<boolean>(true);
  const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const [categories, setCategories] = useState<any[]>([]);

  const [problemWeekDays, setProblemWeekDays] = useState<{
    [habitName: string]: string[];
  }>({});
  const [problemHabits, setProblemHabits] = useState<string[]>([]);
  const [radarData, setRadarData] = useState<
    { label: string; value: number }[]
  >([]);
  const [radarDataall, setRadarDataall] = useState<
    { label: string; value: number }[]
  >([]);
  const [timeline, setTimeline] = useState<
    { name: string; date: string; icon?: string; color?: string }[]
  >([]);

  const [activeTab2, setActiveTab2] = useState<string>("analysis");

  useFocusEffect(
    useCallback(() => {
      const loadHighestStreak = async () => {
        try {
          const highestStreak = await AsyncStorage.getItem("Streak");
          if (highestStreak) {
            setHighestStreak(JSON.parse(highestStreak));
          }
        } catch (error) {
          console.log(error);
        }
      };
      loadHighestStreak();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const radarchart = async () => {
        try {
          const categories = await AsyncStorage.getItem("categories");
          if (categories) {
            const categoriesArray = JSON.parse(categories);
            setCategories(categoriesArray);
            const now = new Date();
            const day = now.getDay();
            const diffToMonday = (day + 6) % 7;
            const thisMonday = new Date(now);
            thisMonday.setDate(now.getDate() - diffToMonday);
            thisMonday.setHours(0, 0, 0, 0);

            const x: { label: string; value: number }[] = [];

            for (const category of categoriesArray) {
              let count = 0;
              for (const checkedDay of category.checkedDays || []) {
                const date = new Date(checkedDay.date);
                if (checkedDay.status && date >= thisMonday) {
                  count++;
                }
              }
              if (count > 0) {
                x.push({ label: category.name, value: count });
              }
            }

            setRadarData(x);
          } else {
            setRadarData([]);
          }
        } catch (error) {
          console.log(error);
        }
      };
      const radarchart2 = async () => {
        try {
          const categories = await AsyncStorage.getItem("categories");
          if (categories) {
            const categoriesArray = JSON.parse(categories);

            const x: { label: string; value: number }[] = [];

            for (const category of categoriesArray) {
              let count = 0;
              for (const checkedDay of category.checkedDays || []) {
                const date = new Date(checkedDay.date);
                if (checkedDay.status) {
                  count++;
                }
              }
              if (count > 0) {
                x.push({ label: category.name, value: count });
              }
            }

            setRadarDataall(x);
          } else {
            setRadarDataall([]);
          }
        } catch (error) {
          console.log(error);
        }
      };
      radarchart();
      radarchart2();
    }, [])
  );

  useEffect(() => {
    const updateAndSaveBadges = async () => {
      try {
        const stored = await AsyncStorage.getItem("badges");
        let achievedBadges: StreakBadge[] = stored ? JSON.parse(stored) : [];

        const newBadges = streakBadges
          .filter(
            (badge) =>
              parseInt(highestStreak) >= badge.days &&
              !achievedBadges.some((b) => b.days === badge.days)
          )
          .map((badge) => ({
            ...badge,
            date: new Date().toLocaleDateString("De-de"),
          }));

        const updatedBadges = [...achievedBadges, ...newBadges];
        await AsyncStorage.setItem("badges", JSON.stringify(updatedBadges));
        setBadges(updatedBadges);
      } catch (error) {
        console.log(error);
      }
    };

    updateAndSaveBadges();
  }, [highestStreak]);

  useFocusEffect(
    useCallback(() => {
      const HabitAnalysis = async () => {
        if (analysis == false) {
          return;
        }
        const problemDays: string[] = [];
        const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
        const weekdayStats: { [key: string]: any } = {};
        const today = new Date();
        const problemWeekdays: { [habitName: string]: string[] } = {};

        try {
          const habits = await AsyncStorage.getItem("categories");
          if (habits) {
            const updatedHabits = JSON.parse(habits);
            updatedHabits.forEach((habits: any, index: any) => {
              let lastChecked: Date;
              if (habits.lastCheckDate.includes(".")) {
                const [day, month, year] = habits.lastCheckDate
                  .split(".")
                  .map(Number);
                lastChecked = new Date(year, month - 1, day);
              } else {
                lastChecked = new Date(habits.lastCheckDate);
              }
              const diffInMs = today.getTime() - lastChecked.getTime();
              const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
              if (diffInDays > 10) {
                problemDays.push(habits.name);
              }
              weekdayStats[habits.name] = {};
              weekdays.forEach((wd) => {
                weekdayStats[habits.name][wd] = { scheduled: 0, completed: 0 };
              });
              let firstRealCheckDate = null;
              for (const day of habits.checkedDays) {
                if (day.status) {
                  const d = new Date(day.date);
                  d.setHours(0, 0, 0, 0);
                  firstRealCheckDate = d;
                  break;
                }
              }
              habits.checkedDays.forEach((day: any) => {
                const dateObj = new Date(day.date);
                if (firstRealCheckDate === null) {
                  return;
                }
                if (dateObj <= today && dateObj >= firstRealCheckDate) {
                  const weekday = new Date(day.date).toLocaleDateString(
                    "de-DE",
                    {
                      weekday: "short",
                    }
                  );
                  weekdayStats[habits.name][weekday].scheduled += 1;
                  if (day.status) {
                    weekdayStats[habits.name][weekday].completed += 1;
                  }
                }
              });
            });
          }
          Object.entries(weekdayStats).forEach(([habitName, stats]) => {
            problemWeekdays[habitName] = [];
            Object.entries(
              stats as {
                [weekday: string]: { scheduled: number; completed: number };
              }
            ).forEach(([weekday, { scheduled, completed }]) => {
              if (scheduled === 0) return;
              const failureRatio = (scheduled - completed) / scheduled;
              if (failureRatio > 0.5) {
                problemWeekdays[habitName].push(weekday);
              }
            });
          });
          setProblemWeekDays(problemWeekdays);
          setProblemHabits(problemDays);
        } catch (error) {
          console.log(error);
        }
      };
      HabitAnalysis();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const getcolor = async () => {
        try {
          const colorScheme = await AsyncStorage.getItem("color");
          if (colorScheme) {
            setColorScheme(JSON.parse(colorScheme));
          }
        } catch (e) {
          console.error("Laden fehlgeschlagen", e);
        }
      };
      getcolor();
    }, [])
  );
  const get_longest_streak = async () => {
    let o = 0;

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].longestStreak > o) {
        o = categories[i].longestStreak;
      }
    }
    return o;
  };
  const getPieChartData = async (index: number): Promise<number> => {
    const habits = await AsyncStorage.getItem("categories");
    let percent = 0;
    const maxDays = 30;
    const today = new Date();

    if (habits) {
      const categories = JSON.parse(habits);
      const category = categories[index];
      if (!category || !category.checkedDays || !category.startDate) {
        return 0;
      }
      let firstRealCheckDate = null;
      for (const day of category.checkedDays) {
        if (day.status) {
          const d = new Date(day.date);
          d.setHours(0, 0, 0, 0);
          firstRealCheckDate = d;
          break;
        }
      }

      if (!firstRealCheckDate) {
        return 0;
      }
      const diffTime = Math.abs(today.getTime() - firstRealCheckDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const days = diffDays < maxDays ? diffDays : maxDays;

      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - days);

      const checkedInLastDays = category.checkedDays.filter((entry: any) => {
        if (!entry.status) return false;
        const entryDate = new Date(entry.date);
        return entryDate >= fromDate && entryDate <= today;
      });

      const completed = checkedInLastDays.length;
      percent = Math.round((completed / days) * 100);
      return percent;
    }

    return percent;
  };

  const [percentages, setPercentages] = useState<number[]>([]);
  const [checkins, setCheckins] = useState<number[][]>([]);

  const getWeeklyCheckInData = async (
    index: number,
    weeks = 6
  ): Promise<number[]> => {
    const Categories = await AsyncStorage.getItem("categories");
    if (Categories) {
      const categories = JSON.parse(Categories);
      const category = categories[index];
      const today = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      const results: number[] = [];

      for (let i = weeks - 1; i >= 0; i--) {
        const start = new Date(today.getTime() - oneWeek * (i + 1));
        const end = new Date(today.getTime() - oneWeek * i);

        const count = category.checkedDays.filter((entry: any) => {
          const entryDate = new Date(entry.date);
          return entry.status && entryDate >= start && entryDate < end;
        }).length;

        results.push(count);
      }
      return results;
    } else {
      return [0];
    }
  };
  const loadCheckIns = async () => {
    const Categories = await AsyncStorage.getItem("categories");
    if (!Categories) {
      return;
    }
    const categories = JSON.parse(Categories);
    if (categories.length === 0) return;

    const results = await Promise.all(
      categories.map((_: any, index: any) => getWeeklyCheckInData(index))
    );
    setCheckins(results);
  };

  const loadPercentages = async () => {
    const Categories = await AsyncStorage.getItem("categories");
    if (!Categories) {
      return;
    }
    const categories = JSON.parse(Categories);
    if (categories.length === 0) return;
    const results = await Promise.all(
      categories.map((_: any, index: any) => getPieChartData(index))
    );
    setPercentages(results);
  };
  useEffect(() => {
    loadPercentages();
    loadCheckIns();
  }, [categories]);

  useFocusEffect(
    useCallback(() => {
      loadPercentages();
      loadCheckIns();
    }, [categories])
  );

  const generateTimeLineData = async () => {
    const habits = await AsyncStorage.getItem("categories");
    const badges = await AsyncStorage.getItem("badges");
    const TimelineData: {
      name: string;
      date: string;
      icon?: string;
      color?: string;
    }[] = [];
    let firstHabitPushed = false;

    if (habits) {
      const updatedHabits = JSON.parse(habits);
      for (const habit of updatedHabits) {
        let firstRealCheckDate = null;
        for (const day of habit.checkedDays) {
          if (day.status) {
            const d = new Date(day.date);
            d.setHours(0, 0, 0, 0);
            firstRealCheckDate = d;
            break;
          }
        }
        if (firstRealCheckDate && !firstHabitPushed) {
          TimelineData.push({
            name: "Your First Habit: " + habit.name,
            date: firstRealCheckDate.toLocaleDateString("De-de"),
          });
          firstHabitPushed = true;
          break;
        }
      }
    }

    if (badges) {
      const updatedBadges = JSON.parse(badges);
      updatedBadges.forEach((badge: StreakBadge) => {
        TimelineData.push({
          name: "Badge earned:",
          icon: badge.icon,
          date: badge.date ?? "",
          color: badge.color,
        });
      });
    }

    return TimelineData;
  };

  useFocusEffect(
    useCallback(() => {
      const loadTimeline = async () => {
        const data = await generateTimeLineData();
        setTimeline(data);
      };
      loadTimeline();
    }, [])
  );

  const isDark = colorSchem === "dark";
  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const cardBgColor = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const textMutedColor = isDark ? "text-gray-400" : "text-gray-500";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";
  const primaryColor = isDark ? "bg-violet-600" : "bg-violet-600";
  const primaryTextColor = isDark ? "text-violet-400" : "text-violet-600";
  const tabBgColor = isDark ? "bg-gray-800" : "bg-gray-200";
  const tabActiveBgColor = isDark ? "bg-violet-600" : "bg-violet-600";

  return (
    <ScrollView className={`flex-1 ${bgColor}`}>
      <View className={`flex-1 ${bgColor} py-8 px-5`}>
        <View className="mt-12 mb-6 ">
          <Text className={`${textColor} text-4xl font-bold mb-2`}>
            Profile
          </Text>
          <Text className={`${textMutedColor} text-base `}>
            Track your progress and achievements
          </Text>
        </View>

        <View className={`${cardBgColor} rounded-2xl p-1 mb-6 shadow-md`}>
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-xl ${
                activeTab2 === "analysis" ? tabActiveBgColor : ""
              }`}
              onPress={() => setActiveTab2("analysis")}
              activeOpacity={0.8}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab2 === "analysis" ? "text-white" : textMutedColor
                }`}
              >
                Analytics
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 px-4 rounded-xl ${
                activeTab2 === "badges" ? tabActiveBgColor : ""
              }`}
              onPress={() => setActiveTab2("badges")}
              activeOpacity={0.8}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab2 === "badges" ? "text-white" : textMutedColor
                }`}
              >
                Achievements
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab2 === "analysis" ? (
          <View className="w-full mb-10">
            <View className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}>
              <Text
                className={`${textColor} text-2xl font-bold mb-2 text-center`}
              >
                Performance Overview
              </Text>
              <Text className={`${textMutedColor} text-center mb-6`}>
                Track your habit completion rates
              </Text>

              <View className={`${tabBgColor} rounded-xl p-1 mb-6`}>
                <View className="flex-row">
                  <TouchableOpacity
                    className={`flex-1 py-2.5 px-4 rounded-lg ${
                      activeTab === "weekly" ? tabActiveBgColor : ""
                    }`}
                    onPress={() => setActiveTab("weekly")}
                    activeOpacity={0.8}
                  >
                    <Text
                      className={`text-center font-medium ${
                        activeTab === "weekly" ? "text-white" : textMutedColor
                      }`}
                    >
                      Weekly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 py-2.5 px-4 rounded-lg ${
                      activeTab === "alltime" ? tabActiveBgColor : ""
                    }`}
                    onPress={() => setActiveTab("alltime")}
                    activeOpacity={0.8}
                  >
                    <Text
                      className={`text-center font-medium ${
                        activeTab === "alltime" ? "text-white" : textMutedColor
                      }`}
                    >
                      All Time
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="items-center mb-4">
                {(activeTab === "weekly" ? radarData : radarDataall).length >
                2 ? (
                  <RadarChart
                    gradientColor={{
                      startColor: isDark ? "#1e1b4b" : "#f3f4f6",
                      endColor: isDark ? "#1e1b4b" : "#f3f4f6",
                      count: 5,
                    }}
                    maxValue={
                      activeTab === "weekly"
                        ? 7
                        : Math.max(
                            ...(activeTab === "weekly"
                              ? radarData
                              : radarDataall
                            ).map((d) => d.value)
                          )
                    }
                    strokeWidth={[1, 1, 1, 1, 1]}
                    dataFillColor="#8b5cf6"
                    dataStroke="#8b5cf6"
                    labelColor={isDark ? "#9ca3af" : "#4b5563"}
                    labelDistance={1.3}
                    data={activeTab === "weekly" ? radarData : radarDataall}
                    scale={0.8}
                    divisionStroke={isDark ? "#4b5563" : "#d1d5db"}
                    strokeOpacity={[0.1, 0.1, 0.1, 0.1, 0.1]}
                  />
                ) : (
                  <View className="py-12 items-center">
                    <Text className={`${textColor} text-lg font-medium mb-2`}>
                      Not enough data
                    </Text>
                    <Text className={`${textMutedColor} text-center`}>
                      Add more habits to see your performance chart
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}>
              <Text
                className={`${textColor} text-2xl font-bold mb-2 text-center`}
              >
                Insights & Analysis
              </Text>
              <Text className={`${textMutedColor} text-center mb-6`}>
                Identify areas for improvement
              </Text>

              {analysis && (
                <View>
                  <View className="mb-6">
                    <Text className={`${textColor} text-lg font-semibold mb-3`}>
                      Inactive Habits
                    </Text>
                    {problemHabits.length > 0 ? (
                      <View className="flex-row flex-wrap gap-2">
                        {problemHabits.map((habit, index) => (
                          <View
                            key={index}
                            className="bg-red-500 rounded-full px-3 py-1.5"
                          >
                            <Text className="text-white font-medium text-sm">
                              {habit}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View
                        className={`${borderColor} border rounded-xl p-4 items-center`}
                      >
                        <Text className={`${textMutedColor} font-medium`}>
                          All habits are active! 🎉
                        </Text>
                      </View>
                    )}
                  </View>

                  <View>
                    <Text className={`${textColor} text-lg font-semibold mb-3`}>
                      Weekly Performance Issues
                    </Text>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                      className="max-h-96"
                    >
                      {Object.entries(problemWeekDays).length > 0 ? (
                        <View className="gap-3">
                          {Object.entries(problemWeekDays).map(
                            ([habitName, problemDays]) => (
                              <View
                                key={habitName}
                                className={`${borderColor} border rounded-xl p-4`}
                              >
                                <Text
                                  className={`${textColor} font-semibold mb-3`}
                                >
                                  {habitName}
                                </Text>
                                <View className="flex-row justify-between">
                                  {weekdays.map((day, idx) => (
                                    <View key={idx} className="items-center">
                                      <View
                                        className={`w-8 h-8 rounded-full items-center justify-center ${
                                          problemDays.includes(day)
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                        }`}
                                      >
                                        <Text className="text-white font-medium text-xs">
                                          {day}
                                        </Text>
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )
                          )}
                        </View>
                      ) : (
                        <View
                          className={`${borderColor} border rounded-xl p-4 items-center`}
                        >
                          <Text className={`${textMutedColor} font-medium`}>
                            No performance issues detected! 🌟
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              )}

              <View className={`${cardBgColor} rounded-2xl p-5 mb-2 mt-5 `}>
                <Text
                  className={`${textColor} text-2xl font-bold mb-2 text-center`}
                >
                  Last Weeks Report
                </Text>
                <Text className={`${textMutedColor} text-center mb-6`}>
                  All checkins in the Last Weeks
                </Text>

                <FlatList
                  data={categories}
                  horizontal
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ paddingVertical: 16 }}
                  ItemSeparatorComponent={() => <View className="h-4" />}
                  renderItem={({ item, index }) => {
                    const Checkins = checkins[index];
                    return (
                      <View
                        className={`${borderColor} border rounded-xl pb-3 pt-3  `}
                      >
                        <View className="mb-3">
                          <Text
                            className={`${textColor} text-lg font-semibold text-center`}
                          >
                            {item.name}
                          </Text>
                        </View>

                        <LineChart
                          data={Checkins}
                          isDarkMode={colorSchem === "dark"}
                        ></LineChart>
                      </View>
                    );
                  }}
                  ListEmptyComponent={() => (
                    <View
                      className={`${borderColor} border rounded-xl p-4 items-center`}
                    >
                      <Text className={`${textMutedColor} font-medium`}>
                        No habits to display
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View className={`${cardBgColor} rounded-2xl p-5 mb-2 mt-5`}>
                <Text
                  className={`${textColor} text-2xl font-bold mb-2 text-center`}
                >
                  All Time Review
                </Text>
                <Text className={`${textMutedColor} text-center mb-6`}>
                  All completion rates for each habit
                </Text>

                <FlatList
                  data={categories}
                  horizontal
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ paddingVertical: 16 }}
                  ItemSeparatorComponent={() => <View className="h-4" />}
                  renderItem={({ item, index }) => {
                    const achieved = percentages[index] ?? 0;
                    return (
                      <View className={`${borderColor} border rounded-xl p-11`}>
                        <View className="mb-3">
                          <Text
                            className={`${textColor} text-lg font-semibold text-center`}
                          >
                            {item.name}
                          </Text>
                          <Text
                            className={`${textMutedColor} text-center text-sm`}
                          >
                            {achieved}% completed
                          </Text>
                        </View>
                        <PieChart
                          percentage={achieved}
                          isDarkMode={colorSchem === "dark"}
                        />
                      </View>
                    );
                  }}
                  ListEmptyComponent={() => (
                    <View
                      className={`${borderColor} border rounded-xl p-4 items-center`}
                    >
                      <Text className={`${textMutedColor} font-medium`}>
                        No habits to display
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </View>
        ) : (
          <View className="w-full mb-10">
            <View className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}>
              <Text
                className={`${textColor} text-2xl font-bold mb-2 text-center`}
              >
                Achievement Badges
              </Text>
              <Text className={`${textMutedColor} text-center mb-6`}>
                Unlock badges by maintaining streaks
              </Text>

              {badgeCategories.map((category, catIndex) => (
                <View key={catIndex} className="mb-10">
                  <View className="flex-row items-center mb-4">
                    <View className="flex-1 h-px bg-gray-500" />

                    <Text
                      className={`${textColor} text-lg font-semibold mx-2 text-center`}
                    >
                      {category.title}
                    </Text>

                    <View className="flex-1 h-px bg-gray-500" />
                  </View>
                  <View className="flex-row flex-wrap justify-between">
                    {category.badges.map((badge, index) => {
                      const earned = badges.some((b) => b.days === badge.days);
                      return (
                        <View key={index} className="items-center w-[30%] mb-6">
                          <View
                            className={`w-16 h-16 rounded-full items-center justify-center ${
                              earned ? cardBgColor : tabBgColor
                            } shadow-md`}
                            style={{
                              shadowColor: earned ? badge.color : "#CBD5E1",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: earned ? 0.3 : 0.1,
                              shadowRadius: 4,
                              elevation: earned ? 4 : 1,
                            }}
                          >
                            <FontAwesome5
                              name={badge.icon as any}
                              size={earned ? 28 : 24}
                              color={
                                earned
                                  ? badge.color
                                  : isDark
                                  ? "#6b7280"
                                  : "#9ca3af"
                              }
                            />
                          </View>
                          <Text
                            className={`mt-2 font-medium text-sm ${
                              earned ? textColor : textMutedColor
                            }`}
                          >
                            {badge.days} days
                          </Text>
                          {earned && (
                            <View className="bg-green-500 rounded-full px-2 py-0.5 mt-1">
                              <Text className="text-white text-xs font-medium">
                                Earned!
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>

            {/* Timeline Section */}
            <View className={`${cardBgColor} rounded-2xl p-5 shadow-md`}>
              <Text
                className={`${textColor} text-2xl font-bold mb-2 text-center`}
              >
                Your Journey
              </Text>
              <Text className={`${textMutedColor} text-center mb-6`}>
                Milestones and achievements timeline
              </Text>

              <View className="relative">
                <View
                  className={`absolute left-1/2 w-0.5 h-full ${borderColor} bg-gray-300`}
                  style={{ marginLeft: -1 }}
                />
                {timeline.map((item, idx) => {
                  const isLeft = idx % 2 === 0;
                  return (
                    <View
                      key={idx}
                      className="flex-row w-full mb-6 items-center"
                    >
                      <View
                        className={`flex-1 ${
                          isLeft ? "pr-4" : "pr-4 opacity-0"
                        }`}
                      >
                        {isLeft && (
                          <View
                            className={`${cardBgColor} ${borderColor} border rounded-xl p-3 shadow-sm`}
                          >
                            <View className="flex-row items-center">
                              <Text
                                className={`${textColor} font-semibold flex-1`}
                              >
                                {item.name}
                              </Text>
                              {item.icon && (
                                <FontAwesome5
                                  name={item.icon as any}
                                  size={20}
                                  color={item.color}
                                  style={{ marginLeft: 8 }}
                                />
                              )}
                            </View>
                            <Text className={`${textMutedColor} text-sm mt-1`}>
                              {item.date}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View className="w-4 h-4 rounded-full bg-violet-600 z-10" />

                      <View
                        className={`flex-1 ${
                          !isLeft ? "pl-4" : "pl-4 opacity-0"
                        }`}
                      >
                        {!isLeft && (
                          <View
                            className={`${cardBgColor} ${borderColor} border rounded-xl p-3 shadow-sm`}
                          >
                            <View className="flex-row items-center">
                              {item.icon && (
                                <FontAwesome5
                                  name={item.icon as any}
                                  size={20}
                                  color={item.color}
                                  style={{ marginRight: 8 }}
                                />
                              )}
                              <Text
                                className={`${textColor} font-semibold flex-1`}
                              >
                                {item.name}
                              </Text>
                            </View>
                            <Text className={`${textMutedColor} text-sm mt-1`}>
                              {item.date}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
