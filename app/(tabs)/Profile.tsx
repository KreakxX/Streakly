import PieChart from "@/components/ui/HabitDonutPieChart";
import LineChart from "@/components/ui/LineChart";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { RadarChart } from "@salmonco/react-native-radar-chart";
import { vars } from "nativewind";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");
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

  const [longest_streak_routine, setlongest_streak_routine] =
    useState<number>(0);
  const [longest_streak_habbit, setlongest_streak_habbit] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<string>("");
  const [badges, setBadges] = useState<StreakBadge[]>([]);
  const [colorSchem, setcolorSchem] = useState<String>("dark");
  const [activeTab, setActiveTab] = useState<string>("weekly");
  const [analysis, setAnalysis] = useState<boolean>(true);
  const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const [activeTabHabitOrRoutine, setActiveTabHabitOrRoutine] =
    useState<string>("habits");
  const [categories, setCategories] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);

  const [problemWeekDays, setProblemWeekDays] = useState<{
    [habitName: string]: string[];
  }>({});

  const [problemWeekDaysRoutine, setProblemWeekDaysRoutine] = useState<{
    [routineName: string]: string[];
  }>({});
  const [problemHabits, setProblemHabits] = useState<string[]>([]);
  const [problemHabitsRoutine, setProblemHabitsRoutine] = useState<string[]>(
    []
  );

  const [radarData, setRadarData] = useState<
    { label: string; value: number }[]
  >([]);
  const [radarDataRoutines, setRadarDataRoutines] = useState<
    { label: string; value: number }[]
  >([]);
  const [radarDataall, setRadarDataall] = useState<
    { label: string; value: number }[]
  >([]);
  const [radarDataallRoutines, setRadarDataallRoutines] = useState<
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

      const radarChartRoutines = async () => {
        try {
          const routines = await AsyncStorage.getItem("routines");
          if (routines) {
            const routinesArray = JSON.parse(routines);
            setRoutines(routinesArray);
            const now = new Date();
            const day = now.getDay();
            const diffToMonday = (day + 6) % 7;
            const thisMonday = new Date(now);
            thisMonday.setDate(now.getDate() - diffToMonday);
            thisMonday.setHours(0, 0, 0, 0);

            const x: { label: string; value: number }[] = [];

            for (const category of routinesArray) {
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

            setRadarDataRoutines(x);
          } else {
            setRadarDataRoutines([]);
          }
        } catch (error) {
          console.log(error);
        }
      };

      const radardChart2Routines = async () => {
        try {
          const routines = await AsyncStorage.getItem("routines");
          if (routines) {
            const routinesArray = JSON.parse(routines);

            const x: { label: string; value: number }[] = [];

            for (const category of routinesArray) {
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

            setRadarDataallRoutines(x);
          } else {
            setRadarDataallRoutines([]);
          }
        } catch (error) {
          console.log(error);
        }
      };
      radarchart();
      radarchart2();
      radarChartRoutines();
      radardChart2Routines();
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

  const HabitAnalysisHabits = async () => {
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
              const weekday = new Date(day.date).toLocaleDateString("de-DE", {
                weekday: "short",
              });
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

  const HabitAnalysisRoutine = async () => {
    if (analysis == false) {
      return;
    }
    const problemDays: string[] = [];
    const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    const weekdayStats: { [key: string]: any } = {};
    const today = new Date();
    const problemWeekdays: { [routineName: string]: string[] } = {};

    try {
      const routines = await AsyncStorage.getItem("routines");
      if (routines) {
        const updatedRoutines = JSON.parse(routines);
        updatedRoutines.forEach((routine: any, index: any) => {
          let lastChecked: Date;

          if (routine.lastCheckedDate.includes(".")) {
            const [day, month, year] = routine.lastCheckedDate
              .split(".")
              .map(Number);
            lastChecked = new Date(year, month - 1, day);
          } else {
            lastChecked = new Date(routine.lastCheckedDate);
          }

          const diffInMs = today.getTime() - lastChecked.getTime();
          const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
          if (diffInDays > 10) {
            problemDays.push(routine.name);
          }
          weekdayStats[routine.name] = {};
          weekdays.forEach((wd) => {
            weekdayStats[routine.name][wd] = { scheduled: 0, completed: 0 };
          });
          let firstRealCheckDate = null;
          for (const day of routine.checkedDays) {
            if (day.status) {
              const d = new Date(day.date);
              d.setHours(0, 0, 0, 0);
              firstRealCheckDate = d;
              break;
            }
          }
          routine.checkedDays.forEach((day: any) => {
            const dateObj = new Date(day.date);
            if (firstRealCheckDate === null) {
              return;
            }
            if (dateObj <= today && dateObj >= firstRealCheckDate) {
              const weekday = new Date(day.date).toLocaleDateString("de-DE", {
                weekday: "short",
              });
              weekdayStats[routine.name][weekday].scheduled += 1;
              if (day.status) {
                weekdayStats[routine.name][weekday].completed += 1;
              }
            }
          });
        });
      }
      Object.entries(weekdayStats).forEach(([routineName, stats]) => {
        problemWeekdays[routineName] = [];
        Object.entries(
          stats as {
            [weekday: string]: { scheduled: number; completed: number };
          }
        ).forEach(([weekday, { scheduled, completed }]) => {
          if (scheduled === 0) return;
          const failureRatio = (scheduled - completed) / scheduled;
          if (failureRatio > 0.5) {
            problemWeekdays[routineName].push(weekday);
          }
        });
      });
      setProblemWeekDaysRoutine(problemWeekdays);
      setProblemHabitsRoutine(problemDays);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      HabitAnalysisHabits();
      HabitAnalysisRoutine();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const getcolor = async () => {
        try {
          const colorSchem = await AsyncStorage.getItem("color");
          if (colorSchem) {
            setcolorSchem(JSON.parse(colorSchem));
          }
        } catch (e) {
          console.error("Laden fehlgeschlagen", e);
        }
      };
      getcolor();
    }, [])
  );
  const get_longest_streak_habbit = async () => {
    let o = "You have no Habbit";

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].longestStreak > o) {
        o = categories[i].longestStreak;
      }
    }
    return o;
  };

  const get_longest_streak = async () => {
    let o = 0;
    const Categories = await AsyncStorage.getItem("categories");
    if (Categories) {
      const categories = JSON.parse(Categories);
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].longestStreak > o) {
          o = categories[i].longestStreak;
          console.log(o);
        }
      }
      setlongest_streak_habbit(o);
    }
  };

  const get_longest_streak_routine = async () => {
    let o = 0;
    const Routines = await AsyncStorage.getItem("routines");
    if (Routines) {
      const routines = JSON.parse(Routines);
      for (let i = 0; i < routines.length; i++) {
        if (routines[i].longestStreak > o) {
          o = routines[i].longestStreak;
          console.log(o);
        }
      }
      setlongest_streak_routine(o);
    }
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

  const getPieChartDataRoutines = async (index: number): Promise<number> => {
    const routines = await AsyncStorage.getItem("routines");
    let percent = 0;
    const maxDays = 30;
    const today = new Date();

    if (routines) {
      const Routines = JSON.parse(routines);
      const routine = Routines[index];
      if (!routine || !routine.checkedDays || !routine.startDate) {
        return 0;
      }
      let firstRealCheckDate = null;
      for (const day of routine.checkedDays) {
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

      const checkedInLastDays = routine.checkedDays.filter((entry: any) => {
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
  const [percentagesRoutines, setPercentagesRoutines] = useState<number[]>([]);

  const [checkins, setCheckins] = useState<number[][]>([]);
  const [checkinsRoutines, setCheckinsRoutines] = useState<number[][]>([]);

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

  const getWeeklyCheckInDataRoutines = async (
    index: number,
    weeks = 6
  ): Promise<number[]> => {
    const Routines = await AsyncStorage.getItem("routines");
    if (Routines) {
      const routines = JSON.parse(Routines);
      const routine = routines[index];
      const today = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      const results: number[] = [];

      for (let i = weeks - 1; i >= 0; i--) {
        const start = new Date(today.getTime() - oneWeek * (i + 1));
        const end = new Date(today.getTime() - oneWeek * i);

        const count = routine.checkedDays.filter((entry: any) => {
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

  const loadCheckInsRoutine = async () => {
    const Routines = await AsyncStorage.getItem("routines");
    if (!Routines) {
      return;
    }
    const routines = JSON.parse(Routines);
    if (routines.length === 0) return;

    const results = await Promise.all(
      routines.map((_: any, index: any) => getWeeklyCheckInDataRoutines(index))
    );
    setCheckinsRoutines(results);
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

  const loadPercentagesRoutines = async () => {
    const Routines = await AsyncStorage.getItem("routines");
    if (!Routines) {
      return;
    }
    const routines = JSON.parse(Routines);
    if (routines.length === 0) return;
    const results = await Promise.all(
      routines.map((_: any, index: any) => getPieChartDataRoutines(index))
    );
    setPercentagesRoutines(results);
  };
  useEffect(() => {
    loadPercentages();
    loadCheckIns();
    loadCheckInsRoutine();
    loadPercentagesRoutines();
    get_longest_streak();
    get_longest_streak_routine();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPercentages();
      loadCheckInsRoutine();
      loadCheckIns();
      loadPercentagesRoutines();
      get_longest_streak();
      get_longest_streak_routine();
    }, [])
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

  const [activeTheme, setActiveTheme] = useState<string>("default");

  const loadTheme = async () => {
    const Theme = await AsyncStorage.getItem("theme");
    if (Theme) {
      const theme = JSON.parse(Theme);
      setActiveTheme(theme);
    }
  };

  useFocusEffect(() => {
    loadTheme();
  });

  useEffect(() => {
    loadTheme();
  });

  const themes = {
    default: {
      primary: {
        main: "#7c3aed", // violet-600
        light: "#8b5cf6", // violet-500
        dark: "#6d28d9", // violet-700
        text: colorSchem === "dark" ? "#c4b5fd" : "#7c3aed", // violet-400 : violet-600
        bg: colorSchem === "dark" ? "#1f2937" : "#f5f3ff", // violet-950 : violet-50
      },
      bg: colorSchem === "dark" ? "#030712" : "#f9fafb", // gray-950 : gray-50
      card: colorSchem === "dark" ? "#111827" : "#ffffff", // gray-900 : white
      text: colorSchem === "dark" ? "#ffffff" : "#1f2937", // white : gray-800
      textMuted: colorSchem === "dark" ? "#9ca3af" : "#6b7280", // gray-400 : gray-500
      border: colorSchem === "dark" ? "#1f2937" : "#e5e7eb", // gray-800 : gray-200
      tab: colorSchem === "dark" ? "#1f2937" : "#e5e7eb", // gray-800 : gray-200
    },
    ocean: {
      primary: {
        main: "#2563eb", // blue-600
        light: "#3b82f6", // blue-500
        dark: "#1d4ed8", // blue-700
        text: colorSchem === "dark" ? "#60a5fa" : "#2563eb", // blue-400 : blue-600
        bg: colorSchem === "dark" ? "#0c0a09" : "#eff6ff", // blue-950 : blue-50
      },
      bg: colorSchem === "dark" ? "#020617" : "#f8fafc", // slate-950 : slate-50
      card: colorSchem === "dark" ? "#0f172a" : "#ffffff", // slate-900 : white
      text: colorSchem === "dark" ? "#ffffff" : "#1e293b", // white : slate-800
      textMuted: colorSchem === "dark" ? "#94a3b8" : "#64748b", // slate-400 : slate-500
      border: colorSchem === "dark" ? "#1e293b" : "#e2e8f0", // slate-800 : slate-200
      tab: colorSchem === "dark" ? "#1e293b" : "#e2e8f0", // slate-800 : slate-200
    },
    forest: {
      primary: {
        main: "#059669", // emerald-600
        light: "#10b981", // emerald-500
        dark: "#047857", // emerald-700
        text: colorSchem === "dark" ? "#34d399" : "#059669", // emerald-400 : emerald-600
        bg: colorSchem === "dark" ? "#022c22" : "#ecfdf5", // emerald-950 : emerald-50
      },
      bg: colorSchem === "dark" ? "#022c22" : "#ecfdf5", // emerald-950 : emerald-50
      card: colorSchem === "dark" ? "#064e3b" : "#ffffff", // emerald-900 : white
      text: colorSchem === "dark" ? "#ffffff" : "#064e3b", // white : emerald-800
      textMuted: colorSchem === "dark" ? "#34d399" : "#059669", // emerald-400 : emerald-500
      border: colorSchem === "dark" ? "#064e3b" : "#a7f3d0", // emerald-800 : emerald-200
      tab: colorSchem === "dark" ? "#064e3b" : "#a7f3d0", // emerald-800 : emerald-200
    },
    sunset: {
      primary: {
        main: "#ea580c", // orange-600
        light: "#f97316", // orange-500
        dark: "#c2410c", // orange-700
        text: colorSchem === "dark" ? "#fb923c" : "#ea580c", // orange-400 : orange-600
        bg: colorSchem === "dark" ? "#431407" : "#fff7ed", // orange-950 : orange-50
      },
      bg: colorSchem === "dark" ? "#431407" : "#fff7ed", // orange-950 : orange-50
      card: colorSchem === "dark" ? "#7c2d12" : "#ffffff", // orange-900 : white
      text: colorSchem === "dark" ? "#ffffff" : "#9a3412", // white : orange-800
      textMuted: colorSchem === "dark" ? "#fb923c" : "#fb923c", // orange-400 : orange-500
      border: colorSchem === "dark" ? "#9a3412" : "#fed7aa", // orange-800 : orange-200
      tab: colorSchem === "dark" ? "#9a3412" : "#fed7aa", // orange-800 : orange-200
    },
    berry: {
      primary: {
        main: "#c026d3", // fuchsia-600
        light: "#d946ef", // fuchsia-500
        dark: "#a21caf", // fuchsia-700
        text: colorSchem === "dark" ? "#f0abfc" : "#c026d3", // fuchsia-400 : fuchsia-600
        bg: colorSchem === "dark" ? "#4a044e" : "#fdf4ff", // fuchsia-950 : fuchsia-50
      },
      bg: colorSchem === "dark" ? "#4a044e" : "#fdf4ff", // fuchsia-950 : fuchsia-50
      card: colorSchem === "dark" ? "#86198f" : "#ffffff", // fuchsia-900 : white
      text: colorSchem === "dark" ? "#ffffff" : "#701a75", // white : fuchsia-800
      textMuted: colorSchem === "dark" ? "#f0abfc" : "#f0abfc", // fuchsia-400 : fuchsia-500
      border: colorSchem === "dark" ? "#701a75" : "#fae8ff", // fuchsia-800 : fuchsia-200
      tab: colorSchem === "dark" ? "#701a75" : "#fae8ff", // fuchsia-800 : fuchsia-200
    },
    monochrome: {
      primary: {
        main: "#525252", // neutral-600
        light: "#737373", // neutral-500
        dark: "#404040", // neutral-700
        text: colorSchem === "dark" ? "#A3A3A3" : "#525252", // neutral-400 : neutral-600
        bg: colorSchem === "dark" ? "#0A0A0A" : "#FAFAFA", // neutral-950 : neutral-50
      },
      bg: colorSchem === "dark" ? "#0A0A0A" : "#FAFAFA", // neutral-950 : neutral-50
      card: colorSchem === "dark" ? "#171717" : "#FFFFFF", // neutral-900 : white
      text: colorSchem === "dark" ? "#FFFFFF" : "#262626", // white : neutral-800
      textMuted: colorSchem === "dark" ? "#A3A3A3" : "#737373", // neutral-400 : neutral-500
      border: colorSchem === "dark" ? "#262626" : "#E5E5E5", // neutral-800 : neutral-200
      tab: colorSchem === "dark" ? "#262626" : "#E5E5E5", // neutral-800 : neutral-200
    },
  };
  const isDark = colorSchem === "dark";
  const currentTheme =
    themes[activeTheme as keyof typeof themes] || themes.default;

  const themeVars = vars({
    "--bg-color": currentTheme.bg,
    "--card-color": currentTheme.card,
    "--text-color": currentTheme.text,
    "--text-muted-color": currentTheme.textMuted,
    "--border-color": currentTheme.border,
    "--primary-color": currentTheme.primary.main,
    "--primary-text-color": currentTheme.primary.text,
    "--tab-color": currentTheme.tab,
    "--primary-bg-color": currentTheme.primary.bg,
  });

  const bgColor = "bg-[var(--bg-color)]";
  const cardBgColor = "bg-[var(--card-color)]";
  const textColor = "text-[var(--text-color)]";
  const textMutedColor = "text-[var(--text-muted-color)]";
  const borderColor = "border-[var(--border-color)]";
  const primaryColor = "bg-[var(--primary-color)]";
  const primaryTextColor = "text-[var(--primary-text-color)]";
  const tabBgColor = "bg-[var(--primary-bg-color)]";
  const tabActiveBgColor = "bg-[var(--primary-color)]";

  return (
    <ScrollView className={`flex-1 ${bgColor}`} style={themeVars}>
      <View className={`flex-1 ${bgColor} py-8 px-5`}>
        <View className="mt-12 mb-6 ">
          <Text className={`${textColor} text-4xl font-bold mb-2`}>
            Profile
          </Text>
          <Text className={`${textMutedColor} text-base `}>
            Track your progress and achievements
          </Text>
        </View>

        <View className={`${cardBgColor} rounded-2xl p-4 mb-6 shadow-md`}>
          <View className={`${tabBgColor} rounded-xl p-1 mb-4`}>
            <View className="flex-row">
              <TouchableOpacity
                className={`flex-1 py-3 px-4 rounded-lg ${
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
                className={`flex-1 py-3 px-4 rounded-lg ${
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

          {activeTab2 === "analysis" && (
            <View className={`${tabBgColor} rounded-xl p-1`}>
              <View className="flex-row">
                <TouchableOpacity
                  className={`flex-1 py-2.5 px-4 rounded-lg ${
                    activeTabHabitOrRoutine === "habits" ? tabActiveBgColor : ""
                  }`}
                  onPress={() => setActiveTabHabitOrRoutine("habits")}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center justify-center">
                    <FontAwesome5
                      name="check-circle"
                      size={14}
                      color={
                        activeTabHabitOrRoutine === "habits"
                          ? "#ffffff"
                          : isDark
                          ? "#9ca3af"
                          : "#6b7280"
                      }
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      className={`font-medium text-sm ${
                        activeTabHabitOrRoutine === "habits"
                          ? "text-white"
                          : textMutedColor
                      }`}
                    >
                      Habits
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 py-2.5 px-4 rounded-lg ${
                    activeTabHabitOrRoutine === "routines"
                      ? tabActiveBgColor
                      : ""
                  }`}
                  onPress={() => setActiveTabHabitOrRoutine("routines")}
                  activeOpacity={0.8}
                >
                  <View className="flex-row items-center justify-center">
                    <FontAwesome5
                      name="list-ul"
                      size={14}
                      color={
                        activeTabHabitOrRoutine === "routines"
                          ? "#ffffff"
                          : isDark
                          ? "#9ca3af"
                          : "#6b7280"
                      }
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      className={`font-medium text-sm ${
                        activeTabHabitOrRoutine === "routines"
                          ? "text-white"
                          : textMutedColor
                      }`}
                    >
                      Routines
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {activeTab2 === "analysis" ? (
          <View>
            {activeTabHabitOrRoutine === "habits" ? (
              <View className="w-full mb-10">
                <View
                  className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}
                >
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
                            activeTab === "weekly"
                              ? "text-white"
                              : textMutedColor
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
                            activeTab === "alltime"
                              ? "text-white"
                              : textMutedColor
                          }`}
                        >
                          All Time
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="items-center mb-4">
                    {(activeTab === "weekly" ? radarData : radarDataall)
                      .length > 2 ? (
                      <RadarChart
                        gradientColor={{
                          startColor: currentTheme.bg,
                          endColor: currentTheme.bg,
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
                        dataFillColor={currentTheme.primary.main}
                        dataStroke={currentTheme.primary.main}
                        labelColor={currentTheme.textMuted}
                        labelDistance={1.3}
                        data={activeTab === "weekly" ? radarData : radarDataall}
                        scale={0.8}
                        divisionStroke={isDark ? "#4b5563" : "#d1d5db"}
                        strokeOpacity={[0.1, 0.1, 0.1, 0.1, 0.1]}
                      />
                    ) : (
                      <View className="py-12 items-center">
                        <Text
                          className={`${textColor} text-lg font-medium mb-2`}
                        >
                          Not enough data
                        </Text>
                        <Text className={`${textMutedColor} text-center`}>
                          Add more habits to see your performance chart
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View className="w-full mb-10">
                  <View
                    className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}
                  >
                    <Text
                      className={`${textColor} text-2xl font-bold mb-2 text-center`}
                    >
                      Highest Streak
                    </Text>
                    <Text className={`${textMutedColor} text-center mb-6`}>
                      Your longest habit streak achievement
                    </Text>

                    <View className="items-center justify-center py-8">
                      <View className="items-center justify-center mb-8">
                        <View
                          className="w-24 h-20 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: isDark
                              ? "rgba(251, 146, 60, 0.1)"
                              : "rgba(251, 146, 60, 0.1)",
                            shadowColor: "#fb923c",
                            shadowOffset: { width: 0, height: 9 },
                            shadowOpacity: 0.3,
                            shadowRadius: 6,
                            elevation: 6,
                          }}
                        >
                          <FontAwesome5 name="fire" size={48} color="#fb923c" />
                        </View>
                      </View>
                      <View className="items-center">
                        <Text
                          className={`${textColor} text-6xl font-bold mb-2`}
                          style={{
                            textShadowColor: isDark
                              ? "rgba(251, 146, 60, 0.3)"
                              : "rgba(251, 146, 60, 0.2)",
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 4,
                          }}
                        >
                          {longest_streak_habbit}
                        </Text>
                        <Text
                          className={`${textMutedColor} text-lg font-medium`}
                        >
                          Days
                        </Text>
                        <Text
                          className={`${primaryTextColor} text-sm font-medium mt-1`}
                        >
                          Personal Best
                        </Text>
                      </View>

                      <View className="mt-6 px-4">
                        <Text
                          className={`${textMutedColor} text-center text-sm`}
                        >
                          {longest_streak_habbit > 0
                            ? `Amazing! You've maintained habits for ${longest_streak_habbit} consecutive days!`
                            : "Start your first habit to begin your streak journey!"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}
                >
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
                        <Text
                          className={`${textColor} text-lg font-semibold mb-3`}
                        >
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
                        <Text
                          className={`${textColor} text-lg font-semibold mb-3`}
                        >
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
                                        <View
                                          key={idx}
                                          className="items-center"
                                        >
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

                  <View
                    className={`${cardBgColor} rounded-2xl p-5 mb-2 mt-20 `}
                  >
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
                      extraData={{
                        checkins,
                        theme: currentTheme,
                        colorSchem,
                      }}
                      removeClippedSubviews={true}
                      maxToRenderPerBatch={5}
                      windowSize={10}
                      initialNumToRender={5}
                      contentContainerStyle={{ paddingVertical: 16 }}
                      ItemSeparatorComponent={() => <View className="h-4" />}
                      renderItem={({ item, index }) => {
                        const Checkins = checkins[index];
                        return (
                          <View
                            className={`${borderColor} border rounded-xl pb-3 pt-3  `}
                            style={{ width: screenWidth * 0.75 }}
                          >
                            <View className="mb-3 flex justify-center items-center">
                              <View
                                className={` rounded-full ${primaryColor} px-6 py-2 justify-center items-center`}
                                style={{ maxWidth: screenWidth * 0.7 }}
                              >
                                <Text
                                  className={`${textColor} text-xl font-semibold text-center`}
                                >
                                  {item.name}
                                </Text>
                              </View>
                            </View>

                            <LineChart
                              theme={currentTheme}
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
                      removeClippedSubviews={true}
                      maxToRenderPerBatch={5}
                      windowSize={10}
                      initialNumToRender={5}
                      extraData={{
                        percentages,
                        theme: currentTheme,
                        colorSchem,
                      }}
                      renderItem={({ item, index }) => {
                        const achieved = percentages[index] ?? 0;
                        return (
                          <View
                            className={`${borderColor} border rounded-xl p-11`}
                            style={{ width: screenWidth * 0.75 }}
                          >
                            <View className="mb-3">
                              <View
                                className={` rounded-full ${primaryColor}  py-2 justify-center items-center mx-20`}
                              >
                                <Text
                                  className={`${textColor} text-xl font-semibold text-center`}
                                >
                                  {item.name}
                                </Text>
                              </View>
                            </View>
                            <Text
                              className={`${textMutedColor} text-center text-sm`}
                            >
                              {achieved}% completed
                            </Text>
                            <PieChart
                              theme={currentTheme}
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
                <View
                  className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}
                >
                  <Text
                    className={`${textColor} text-2xl font-bold mb-2 text-center`}
                  >
                    Performance Overview
                  </Text>
                  <Text className={`${textMutedColor} text-center mb-6`}>
                    Track your routine completion rates
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
                            activeTab === "weekly"
                              ? "text-white"
                              : textMutedColor
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
                            activeTab === "alltime"
                              ? "text-white"
                              : textMutedColor
                          }`}
                        >
                          All Time
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="items-center mb-4">
                    {(activeTab === "weekly"
                      ? radarDataRoutines
                      : radarDataallRoutines
                    ).length > 2 ? (
                      <RadarChart
                        gradientColor={{
                          startColor: currentTheme.bg,
                          endColor: currentTheme.bg,
                          count: 5,
                        }}
                        maxValue={
                          activeTab === "weekly"
                            ? 7
                            : Math.max(
                                ...(activeTab === "weekly"
                                  ? radarDataRoutines
                                  : radarDataallRoutines
                                ).map((d) => d.value)
                              )
                        }
                        strokeWidth={[1, 1, 1, 1, 1]}
                        dataFillColor={currentTheme.primary.main}
                        dataStroke={currentTheme.primary.main}
                        labelColor={currentTheme.textMuted}
                        labelDistance={1.3}
                        data={
                          activeTab === "weekly"
                            ? radarDataRoutines
                            : radarDataallRoutines
                        }
                        scale={0.8}
                        divisionStroke={isDark ? "#4b5563" : "#d1d5db"}
                        strokeOpacity={[0.1, 0.1, 0.1, 0.1, 0.1]}
                      />
                    ) : (
                      <View className="py-12 items-center">
                        <Text
                          className={`${textColor} text-lg font-medium mb-2`}
                        >
                          Not enough data
                        </Text>
                        <Text className={`${textMutedColor} text-center`}>
                          Add more habits to see your performance chart
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View className="w-full mb-10">
                  <View
                    className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}
                  >
                    <Text
                      className={`${textColor} text-2xl font-bold mb-2 text-center`}
                    >
                      Highest Streak
                    </Text>
                    <Text className={`${textMutedColor} text-center mb-6`}>
                      Your longest routine streak achievement
                    </Text>

                    <View className="items-center justify-center py-8">
                      <View className="items-center justify-center mb-8">
                        <View
                          className="w-24 h-20 rounded-full items-center justify-center"
                          style={{
                            backgroundColor: isDark
                              ? "rgba(251, 146, 60, 0.1)"
                              : "rgba(251, 146, 60, 0.1)",
                            shadowColor: "#fb923c",
                            shadowOffset: { width: 0, height: 9 },
                            shadowOpacity: 0.3,
                            shadowRadius: 6,
                            elevation: 6,
                          }}
                        >
                          <FontAwesome5 name="fire" size={48} color="#fb923c" />
                        </View>
                      </View>
                      <View className="items-center">
                        <Text
                          className={`${textColor} text-6xl font-bold mb-2`}
                          style={{
                            textShadowColor: isDark
                              ? "rgba(251, 146, 60, 0.3)"
                              : "rgba(251, 146, 60, 0.2)",
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 4,
                          }}
                        >
                          {longest_streak_routine}
                        </Text>
                        <Text
                          className={`${textMutedColor} text-lg font-medium`}
                        >
                          Days
                        </Text>
                        <Text
                          className={`${primaryTextColor} text-sm font-medium mt-1`}
                        >
                          Personal Best
                        </Text>
                      </View>

                      <View className="mt-6 px-4">
                        <Text
                          className={`${textMutedColor} text-center text-sm`}
                        >
                          {longest_streak_routine > 0
                            ? `Amazing! You've maintained routines for ${longest_streak_routine} consecutive days!`
                            : "Start your first routine to begin your streak journey!"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    className={`${cardBgColor} rounded-2xl p-5 mb-6 shadow-md`}
                  >
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
                          <Text
                            className={`${textColor} text-lg font-semibold mb-3`}
                          >
                            Inactive Habits
                          </Text>
                          {problemHabitsRoutine.length > 0 ? (
                            <View className="flex-row flex-wrap gap-2">
                              {problemHabits.map((routine, index) => (
                                <View
                                  key={index}
                                  className="bg-red-500 rounded-full px-3 py-1.5"
                                >
                                  <Text className="text-white font-medium text-sm">
                                    {routine}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          ) : (
                            <View
                              className={`${borderColor} border rounded-xl p-4 items-center`}
                            >
                              <Text className={`${textMutedColor} font-medium`}>
                                All routines are active! 🎉
                              </Text>
                            </View>
                          )}
                        </View>

                        <View>
                          <Text
                            className={`${textColor} text-lg font-semibold mb-3`}
                          >
                            Weekly Performance Issues
                          </Text>
                          <ScrollView
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            className="max-h-96"
                          >
                            {Object.entries(problemWeekDaysRoutine).length >
                            0 ? (
                              <View className="gap-3">
                                {Object.entries(problemWeekDaysRoutine).map(
                                  ([routinename, problemDays]) => (
                                    <View
                                      key={routinename}
                                      className={`${borderColor} border rounded-xl p-4`}
                                    >
                                      <Text
                                        className={`${textColor} font-semibold mb-3`}
                                      >
                                        {routinename}
                                      </Text>
                                      <View className="flex-row justify-between">
                                        {weekdays.map((day, idx) => (
                                          <View
                                            key={idx}
                                            className="items-center"
                                          >
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
                                <Text
                                  className={`${textMutedColor} font-medium`}
                                >
                                  No performance issues detected! 🌟
                                </Text>
                              </View>
                            )}
                          </ScrollView>
                        </View>
                      </View>
                    )}

                    <View
                      className={`${cardBgColor} rounded-2xl p-5 mb-2 mt-20 `}
                    >
                      <Text
                        className={`${textColor} text-2xl font-bold mb-2 text-center`}
                      >
                        Last Weeks Report
                      </Text>
                      <Text className={`${textMutedColor} text-center mb-6`}>
                        All checkins in the Last Weeks
                      </Text>

                      <FlatList
                        data={routines}
                        horizontal
                        keyExtractor={(item, index) => index.toString()}
                        extraData={{
                          checkinsRoutines,
                          theme: currentTheme,
                          colorSchem,
                        }}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        windowSize={10}
                        initialNumToRender={5}
                        contentContainerStyle={{ paddingVertical: 16 }}
                        ItemSeparatorComponent={() => <View className="h-4" />}
                        renderItem={({ item, index }) => {
                          const Checkins = checkinsRoutines[index];
                          return (
                            <View
                              className={`${borderColor} border rounded-xl pb-3 pt-3  `}
                              style={{ width: screenWidth * 0.75 }}
                            >
                              <View className="mb-3 flex justify-center items-center">
                                <View
                                  className={` rounded-full ${primaryColor} px-6 py-2 justify-center items-center`}
                                  style={{ maxWidth: screenWidth * 0.7 }}
                                >
                                  <Text
                                    className={`${textColor} text-xl font-semibold text-center`}
                                  >
                                    {item.name}
                                  </Text>
                                </View>
                              </View>

                              <LineChart
                                theme={currentTheme}
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
                              No routines to display
                            </Text>
                          </View>
                        )}
                      />
                    </View>

                    <View
                      className={`${cardBgColor} rounded-2xl p-5 mb-2 mt-5`}
                    >
                      <Text
                        className={`${textColor} text-2xl font-bold mb-2 text-center`}
                      >
                        All Time Review
                      </Text>
                      <Text className={`${textMutedColor} text-center mb-6`}>
                        All completion rates for each habit
                      </Text>

                      <FlatList
                        data={routines}
                        horizontal
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingVertical: 16 }}
                        ItemSeparatorComponent={() => <View className="h-4" />}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        windowSize={10}
                        initialNumToRender={5}
                        extraData={{
                          percentagesRoutines,
                          theme: currentTheme,
                          colorSchem,
                        }}
                        renderItem={({ item, index }) => {
                          const achieved = percentagesRoutines[index] ?? 0;
                          return (
                            <View
                              className={`${borderColor} border rounded-xl p-11`}
                              style={{ width: screenWidth * 0.75 }}
                            >
                              <View className="mb-3">
                                <View
                                  className={` rounded-full ${primaryColor} px-6 py-2 justify-center items-center`}
                                  style={{ maxWidth: screenWidth * 0.7 }}
                                >
                                  <Text
                                    className={`${textColor} text-xl font-semibold text-center`}
                                  >
                                    {item.name}
                                  </Text>
                                </View>
                              </View>
                              <Text
                                className={`${textMutedColor} text-center text-sm`}
                              >
                                {achieved}% completed
                              </Text>
                              <PieChart
                                theme={currentTheme}
                                percentage={achieved}
                                isDarkMode={colorSchem === "dark"}
                              />
                            </View>
                          );
                        }}
                        ListEmptyComponent={() => (
                          <View
                            className={`${borderColor} flex border rounded-xl p-4 items-center justify-center`}
                          >
                            <Text
                              className={`${textMutedColor} font-medium text-center`}
                            >
                              No routines to display
                            </Text>
                          </View>
                        )}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
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
