"use client";

import availableColors from "@/components/ui/availableColors";
import BadgeAnimation from "@/components/ui/BadgeAnimation";
import FlameAnimation from "@/components/ui/FlameAnimation";
import items from "@/components/ui/items";
import Streak from "@/components/ui/streak";
import StreakV2 from "@/components/ui/StreakV2";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "expo-router";
import * as StoreReview from "expo-store-review";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Alert,
  AppState,
  Button,
  Image,
  Modal,
  NativeModules,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { FlatList } from "react-native-gesture-handler";
import ImageViewing from "react-native-image-viewing";
interface Category {
  name: string;
  streak: number;
  color: string;
  lastCheckDate?: string;
  checkedDays: day[];
  days: number;
  startDate: Date;
  buttonColor: string;
  iconname: string;
  archivated: boolean;
  changeIcon: boolean;
  github: boolean;
  amount: number;
  checkedToday: number;
  selectedDays: string[];
  modelOpen: boolean;
  camerashow: boolean;
  imagePaths: string[];
  galleryVisible: boolean;
  category?: string;
  longestStreak: number;
}

interface Routine {
  name: string;
  streak: number;
  color: string;
  lastCheckedDate?: string;
  checkedDays: day[];
  days: number;
  startDate: Date;
  buttonColor: string;
  iconname: string;
  archivated: boolean;
  changeIcon: boolean;
  github: boolean;
  amount: number;
  checkedToday: number;
  todos: Todo[];
  todoschecked: number;
  selectedDays: string[];
  modelOpen: boolean;
  category?: string;
  longestStreak: number;
}
interface Todo {
  name: string;
  lastCheckedDate?: string;
  buttoncolor: string;
  edited: boolean;
}
interface day {
  status: boolean;
  date: Date;
}

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isReady, setIsReady] = useState(false);
  const firstLoadRef = useRef(true);
  const currentDate = new Date().toLocaleDateString();
  const [test, setTest] = useState<string>("");
  const [colorScheme, setColorScheme] = useState<string>("dark");
  const [selectedIcon, setSelectedIcon] = useState<string>("star");
  const [motivationalQuote, setMotivationalQuote] = useState<string>("");
  const [expandRoutine, setExpandRoutine] = useState<boolean>(false);
  const [routineItem, setRoutItem] = useState<Todo[]>([]);
  const [habits, setHabtis] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("habits");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [newTodoName, setTodoName] = useState<string>("");
  const [quickView, setQuickView] = useState<boolean>(false);
  const [badgeAnimationVisible, setBadgeAnimationVisible] = useState(false);
  const [questview, setQuestView] = useState<boolean>(false);
  const [dailyQuest, setdailyQuest] = useState<string>("");
  const [badgeAnimationDays, setBadgeAnimationDays] = useState<number | null>(
    null
  );
  const [QuestsDone, setQuestsDone] = useState<number>(0);
  const [animationshown, setAnimationShoww] = useState<boolean>(false);
  const [QuestDateDone, setQuestDateDone] = useState<string>("");
  const [startScreen, setStartScreen] = useState<boolean>(false);
  const { CategoryDatamodule } = NativeModules;
  const clearedRef = useRef(false);
  const startRef = useRef(false);

  const weekdays = [
    { label: "MO", value: "Montag" },
    { label: "DI", value: "Dienstag" },
    { label: "MI", value: "Mittwoch" },
    { label: "DO", value: "Donnerstag" },
    { label: "FR", value: "Freitag" },
    { label: "SA", value: "Samstag" },
    { label: "SO", value: "Sonntag" },
  ];

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

  const themes = {
    default: {
      primary: {
        main: "#7c3aed",
        light: "#8b5cf6",
        dark: "#6d28d9",
        text: "#c4b5fd",
        bg: "#1f2937",
      },
      bg: "#030712",
      card: "#111827",
      text: "#ffffff",
      textMuted: "#9ca3af",
      border: "#1f2937",
      tab: "#131620",
    },
    ocean: {
      primary: {
        main: "#2563eb",
        light: "#3b82f6",
        dark: "#1d4ed8",
        text: "#60a5fa",
        bg: "#075985",
      },
      bg: "#020617",
      card: "#0f172a",
      text: "#ffffff",
      textMuted: "#94a3b8",
      border: "#1e293b",
      tab: "#1e293b",
    },
    forest: {
      primary: {
        main: "#059669",
        light: "#10b981",
        dark: "#047857",
        text: "#34d399",
        bg: "#022c22",
      },
      bg: "#022c22",
      card: "#064e3b",
      text: "#ffffff",
      textMuted: "#34d399",
      border: "#022c22",
      tab: "#065f46",
    },
    sunset: {
      primary: {
        main: "#ea580c",
        light: "#f97316",
        dark: "#c2410c",
        text: "#fb923c",
        bg: "#431407",
      },
      bg: "#431407",
      card: "#7c2d12",
      text: "#ffffff",
      textMuted: "#fb923c",
      border: "#ea580c",
      tab: "#9a3412",
    },
    berry: {
      primary: {
        main: "#c026d3",
        light: "#d946ef",
        dark: "#a21caf",
        text: "#f0abfc",
        bg: "#4a044e",
      },
      bg: "#4a044e",
      card: "#86198f",
      text: "#ffffff",
      textMuted: "#f0abfc",
      border: "#4a044e",
      tab: "#701a75",
    },
    monochrome: {
      primary: {
        main: "#525252",
        light: "#737373",
        dark: "#404040",
        text: "#A3A3A3",
        bg: "#0A0A0A",
      },
      bg: "#0A0A0A",
      card: "#171717",
      text: "#FFFFFF",
      textMuted: "#A3A3A3",
      border: "#2c2c2c",
      tab: "#1f1f1f",
    },
    white: {
      primary: {
        main: "#52525b",
        light: "#71717a",
        dark: "#3f3f46",
        text: "#3f3f46",
        bg: "#e4e4e7",
      },
      bg: "#e4e4e7",
      card: "#71717a",
      text: "#27272a",
      textMuted: "#52525b",
      border: "#3f3f46",
      tab: "#3f3f46",
    },
  };
  const [activeTheme, setActiveTheme] = useState<string>("ocean");
  const currentTheme =
    themes[activeTheme as keyof typeof themes] || themes.default;
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  type StreakBadge = {
    days: number;
    icon: string;
    color: string;
    date?: string;
  };
  const isDarkMode = colorScheme === "dark";
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategoryCategories, setSelectedCategoryCategories] =
    useState<string>("");
  const [selectedCategoryRoutines, setSelectedCategoryRoutines] =
    useState<string>("");
  const [originalCategories, setOriginalCategories] = useState<Category[]>([]);
  const [originalRoutines, setOriginalRoutines] = useState<Routine[]>([]);
  const [themeModal, setThemeModal] = useState<boolean>(false);
  const { ThemeModule } = NativeModules;

  const GroupCategories = [
    { id: "health", name: "Health & Fitness", icon: "heart-pulse" },
    { id: "productivity", name: "Productivity", icon: "lightning-bolt" },
    { id: "mindfulness", name: "Mindfulness", icon: "meditation" },
    { id: "learning", name: "Learning", icon: "book-open-variant" },
    { id: "creativity", name: "Creativity", icon: "palette" },
    { id: "social", name: "Social", icon: "account-group" },
    { id: "finance", name: "Finance", icon: "finance" },
    { id: "nutrition", name: "Nutrition", icon: "nutrition" },
    { id: "sleep", name: "Sleep", icon: "sleep" },
    { id: "family", name: "Family", icon: "family-tree" },
  ];
  const renderCategoryItem = ({
    item,
  }: {
    item: (typeof GroupCategories)[0];
  }) => {
    const isSelected = selectedCategory === item.name;

    return (
      <TouchableOpacity
        className={`mr-3 px-4 py-2.5 rounded-full flex-row items-center `}
        style={{
          backgroundColor: isSelected
            ? currentTheme.primary.main
            : currentTheme.border,
        }}
        onPress={() => setSelectedCategory(item.name)}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={18}
          color={
            isSelected
              ? isDarkMode
                ? "white"
                : "white"
              : isDarkMode
              ? "#94a3b8"
              : "#64748b"
          }
        />
        <Text
          className={`ml-2 font-medium ${
            isSelected
              ? isDarkMode
                ? "text-white"
                : "text-white"
              : isDarkMode
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const sortByCategory = (category: string) => {
    if (selectedCategoryCategories === category) {
      setSelectedCategoryCategories("");
      setCategories(originalCategories);
      return;
    }

    setSelectedCategoryCategories(category);
    const filtered = originalCategories.filter(
      (cat) => cat.category === category
    );

    setCategories(filtered);
  };

  const sortByRoutines = (category: string) => {
    if (selectedCategoryRoutines === category) {
      setSelectedCategoryRoutines("");
      setRoutines(originalRoutines);
      return;
    }

    setSelectedCategoryRoutines(category);
    const filtered = originalRoutines.filter(
      (rout) => rout.category === category
    );

    setRoutines(filtered);
  };

  const renderCategoryItem2 = ({
    item,
  }: {
    item: (typeof GroupCategories)[0];
  }) => {
    const isSelected = selectedCategoryCategories === item.name;

    return (
      <TouchableOpacity
        className={`mr-3 px-4 py-2.5 rounded-full flex-row items-center `}
        style={{
          backgroundColor: isSelected
            ? currentTheme.primary.main
            : currentTheme.card,
        }}
        onPress={() => {
          sortByCategory(item.name);
        }}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={18}
          color={
            isSelected
              ? isDarkMode
                ? "white"
                : "white"
              : isDarkMode
              ? "#94a3b8"
              : "#64748b"
          }
        />
        <Text
          className={`ml-2 font-medium ${
            isSelected
              ? isDarkMode
                ? "text-white"
                : "text-white"
              : isDarkMode
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem3 = ({
    item,
  }: {
    item: (typeof GroupCategories)[0];
  }) => {
    const isSelected = selectedCategoryRoutines === item.name;

    return (
      <TouchableOpacity
        className={`mr-3 px-4 py-2.5 rounded-full flex-row items-center `}
        style={{
          backgroundColor: isSelected
            ? currentTheme.primary.main
            : currentTheme.card,
        }}
        onPress={() => {
          sortByRoutines(item.name);
        }}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={18}
          color={
            isSelected
              ? isDarkMode
                ? "white"
                : "white"
              : isDarkMode
              ? "#94a3b8"
              : "#64748b"
          }
        />
        <Text
          className={`ml-2 font-medium ${
            isSelected
              ? isDarkMode
                ? "text-white"
                : "text-white"
              : isDarkMode
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  const getLocalDateString = (date = new Date()) => {
    // Always get local date string in YYYY-MM-DD format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseToLocalDate = (dateString: string) => {
    // Parse date string to local date without timezone issues
    if (dateString.includes("T")) {
      dateString = dateString.split("T")[0];
    }
    const [year, month, day] = dateString.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  useEffect(() => {
    const checkAndClearWidgetCache = async () => {
      const alreadyCleared = await AsyncStorage.getItem("widget_cache_cleared");
      if (alreadyCleared === "true") {
        clearedRef.current = true;
        return;
      }

      try {
        console.log("🔄 Clearing widget cache for all widgets...");

        const widgetIds = await CategoryDatamodule.getAllWidgetIds();

        for (const widgetId of widgetIds) {
          console.log(`Clearing widget cache for ID: ${widgetId}`);

          await CategoryDatamodule.saveToPrefs(
            `widget_habit_name_${widgetId}`,
            ""
          );
          await CategoryDatamodule.saveToPrefs(
            `widget_habit_checkedDays_${widgetId}`,
            "[]"
          );
          await CategoryDatamodule.saveToPrefs(
            `widget_habit_startDate_${widgetId}`,
            ""
          );
          await CategoryDatamodule.saveToPrefs(
            `widget_habit_streak_${widgetId}`,
            "0"
          );

          await CategoryDatamodule.updateWidgetForId(widgetId);
        }

        await CategoryDatamodule.saveToPrefs("widget_habit_name", "");
        await CategoryDatamodule.saveToPrefs("widget_habit_checkedDays", "[]");
        await CategoryDatamodule.saveToPrefs("widget_habit_startDate", "");
        await CategoryDatamodule.saveToPrefs("widget_habit_streak", "0");
        await CategoryDatamodule.saveToPrefs("widget_ids", "[]");

        await CategoryDatamodule.updateWidget();

        setCategories([]);
        setOriginalCategories([]);

        await AsyncStorage.setItem("widget_cache_cleared", "true");

        console.log("✅ Widget cache cleared for all widgets");
      } catch (e) {
        console.error("❌ Failed to clear widget cache:", e);
      } finally {
        clearedRef.current = true;
      }
    };

    checkAndClearWidgetCache();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await CategoryDatamodule.saveToPrefs(
          "habits",
          JSON.stringify(categories)
        );
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    saveData();
  }, [categories, originalCategories]);

  const connectWithGithub = async () => {
    const updatedCategories = [...categories];
    const username = await AsyncStorage.getItem("github");
    let github = false;
    let CategoryIndex = 0;
    const todayFormatted = new Date().toISOString().split("T")[0];
    updatedCategories.forEach((category, index) => {
      if (category.github == true) {
        github = true;
        CategoryIndex = index;
      }
    });
    if (github) {
      try {
        const response = await axios.get(
          `https://api.github.com/search/commits?q=author:${username}+committer-date:>=${todayFormatted}&sort=committer-date&order=desc`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const count = response.data["total_count"];
        console.log(count);
        if (count) {
          handleCheckIn(CategoryIndex, true);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
  };

  const updateWidgetWithCategory = async (category: Category) => {
    try {
      const widgetIds = await CategoryDatamodule.getAllWidgetIds();

      for (const widgetId of widgetIds) {
        try {
          const widgetData = await CategoryDatamodule.loadWidgetDataForId(
            widgetId
          );

          if (widgetData && widgetData.habitName === category.name) {
            await updateSingleWidget(category, widgetId);
          }
        } catch (error) {
          console.error(
            `Failed to check widget ${widgetId} configuration:`,
            error
          );
        }
      }

      await CategoryDatamodule.updateWidget();
    } catch (e) {
      console.error("❌ Widget update failed:", e);
    }
  };

  const updateSingleWidget = async (category: Category, widgetId: number) => {
    try {
      await CategoryDatamodule.saveToPrefs(
        `widget_${widgetId}_habit_name`,
        category.name
      );

      // Use consistent date formatting
      const localCheckedDays = category.checkedDays
        .filter((cd) => cd && cd.date)
        .map((cd) => {
          const dateObj =
            cd.date instanceof Date ? cd.date : parseToLocalDate(cd.date);
          return {
            date: getLocalDateString(dateObj), // Always YYYY-MM-DD format
            status: cd.status,
          };
        });

      await CategoryDatamodule.saveToPrefs(
        `widget_${widgetId}_habit_checkedDays`,
        JSON.stringify(localCheckedDays)
      );

      const startDate =
        category.startDate instanceof Date
          ? category.startDate
          : parseToLocalDate(category.startDate);

      if (isNaN(startDate.getTime())) {
        console.error("Invalid startDate:", category.startDate);
        return;
      }

      const localStartDate = getLocalDateString(startDate);
      await CategoryDatamodule.saveToPrefs(
        `widget_${widgetId}_habit_startDate`,
        localStartDate
      );

      await CategoryDatamodule.saveToPrefs(
        `widget_${widgetId}_habit_color`,
        category.color
      );
      await CategoryDatamodule.saveToPrefs(
        `widget_${widgetId}_habit_streak`,
        category.streak.toString()
      );
    } catch (e) {
      console.error(`❌ Failed to update widget ${widgetId}:`, e);
    }
  };

  const loadWidgetData = async () => {
    try {
      const widgetIds = await CategoryDatamodule.getAllWidgetIds();

      if (widgetIds.length === 0) {
        return;
      }

      let hasChanges = false;
      const todayString = getLocalDateString();

      for (const widgetId of widgetIds) {
        try {
          const data = await CategoryDatamodule.loadWidgetDataForId(widgetId);
          if (!data || !data.checkedDays) {
            continue;
          }

          let newCheckedDays = [];
          try {
            newCheckedDays =
              typeof data.checkedDays === "string"
                ? JSON.parse(data.checkedDays)
                : [];
          } catch (e) {
            continue;
          }

          // Find today's status in widget data
          const widgetTodayEntry = newCheckedDays.find((day: any) => {
            const dayDateString = day.date.includes("T")
              ? day.date.split("T")[0]
              : day.date;
            return dayDateString === todayString;
          });

          const widgetDayStatus = widgetTodayEntry?.status;
          const habitName = data.habitName || "Habit";

          const categoryIndex = categories.findIndex(
            (cat) => cat.name === habitName
          );

          if (categoryIndex === -1) {
            continue;
          }

          const currentCategory = categories[categoryIndex];

          // Find today's entry in category
          const todayInCategory = currentCategory.checkedDays.find((day) => {
            if (!day || !day.date) return false;

            const dayDate =
              day.date instanceof Date ? day.date : parseToLocalDate(day.date);
            if (isNaN(dayDate.getTime())) {
              return false;
            }

            const dayDateString = getLocalDateString(dayDate);
            return dayDateString === todayString;
          });

          const appDayStatus = todayInCategory?.status || false;

          // Normalize statuses
          const normalizedWidgetStatus = widgetDayStatus === true;
          const normalizedAppStatus = appDayStatus === true;

          // Check if widget status differs from app status
          if (
            todayInCategory &&
            widgetDayStatus !== undefined &&
            normalizedWidgetStatus !== normalizedAppStatus
          ) {
            hasChanges = true;

            // Update categories
            setCategories((prev) => {
              return prev.map((cat, index) => {
                if (index !== categoryIndex) return cat;

                let newStreak = cat.streak;
                let newDays = cat.days;

                if (normalizedWidgetStatus && !normalizedAppStatus) {
                  // Widget is checked, app is unchecked -> increase
                  newStreak = cat.streak + 1;
                  newDays = cat.days + 1;
                } else if (!normalizedWidgetStatus && normalizedAppStatus) {
                  // Widget is unchecked, app is checked -> decrease
                  newStreak = Math.max(0, cat.streak - 1);
                  newDays = Math.max(0, cat.days - 1);
                }

                const today = new Date();

                return {
                  ...cat,
                  streak: newStreak,
                  longestStreak:
                    normalizedWidgetStatus && newStreak > cat.longestStreak
                      ? newStreak
                      : cat.longestStreak,
                  checkedToday: normalizedWidgetStatus ? cat.amount : 0,
                  buttonColor: normalizedWidgetStatus
                    ? cat.color
                    : currentTheme.border,
                  lastCheckDate: normalizedWidgetStatus
                    ? today.toLocaleDateString("de-DE")
                    : "",
                  days: newDays,
                  checkedDays: cat.checkedDays.map((day) => {
                    if (!day || !day.date) return day;

                    const dayDate =
                      day.date instanceof Date
                        ? day.date
                        : parseToLocalDate(day.date);
                    if (isNaN(dayDate.getTime())) {
                      console.error("Invalid date in checkedDays:", day.date);
                      return day;
                    }

                    const dayDateString = getLocalDateString(dayDate);
                    if (dayDateString === todayString) {
                      return { ...day, status: normalizedWidgetStatus };
                    }
                    return day;
                  }),
                };
              });
            });

            // Update originalCategories with same logic
            setOriginalCategories((prev) => {
              return prev.map((cat, index) => {
                if (index !== categoryIndex) return cat;

                let newStreak = cat.streak;
                let newDays = cat.days;

                if (normalizedWidgetStatus && !normalizedAppStatus) {
                  newStreak = cat.streak + 1;
                  newDays = cat.days + 1;
                } else if (!normalizedWidgetStatus && normalizedAppStatus) {
                  newStreak = Math.max(0, cat.streak - 1);
                  newDays = Math.max(0, cat.days - 1);
                }

                const today = new Date();

                return {
                  ...cat,
                  streak: newStreak,
                  longestStreak:
                    normalizedWidgetStatus && newStreak > cat.longestStreak
                      ? newStreak
                      : cat.longestStreak,
                  checkedToday: normalizedWidgetStatus ? cat.amount : 0,
                  buttonColor: normalizedWidgetStatus
                    ? cat.color
                    : currentTheme.border,
                  lastCheckDate: normalizedWidgetStatus
                    ? today.toLocaleDateString("de-DE")
                    : "",
                  days: newDays,
                  checkedDays: cat.checkedDays.map((day) => {
                    if (!day || !day.date) return day;

                    const dayDate =
                      day.date instanceof Date
                        ? day.date
                        : parseToLocalDate(day.date);
                    if (isNaN(dayDate.getTime())) {
                      return day;
                    }

                    const dayDateString = getLocalDateString(dayDate);
                    if (dayDateString === todayString) {
                      return { ...day, status: normalizedWidgetStatus };
                    }
                    return day;
                  }),
                };
              });
            });
          }
        } catch (e) {
          console.error(`Error loading widget data for ${widgetId}:`, e);
        }
      }

      if (hasChanges) {
        console.log("✅ Widget data synchronized with app");
      }
    } catch (e) {
      console.error("Error loading widget data:", e);
    } finally {
      await connectWithGithub();
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        loadWidgetData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadWidgetData]);
  useEffect(() => {
    const loadBadgesAndAnimation = async () => {
      try {
        const stored = await AsyncStorage.getItem("badges");
        let achievedBadges: StreakBadge[] = stored ? JSON.parse(stored) : [];
        let streak = 0;

        const highestStreak = await AsyncStorage.getItem("Streak");
        if (highestStreak) {
          streak = JSON.parse(highestStreak);
        }
        const badge: StreakBadge | undefined = streakBadges.find(
          (badge) =>
            badge.days <= streak &&
            !achievedBadges.some((b) => b.days === badge.days)
        );
        if (badge) {
          if (achievedBadges.includes(badge)) {
            return;
          } else {
            if (animationshown == false) {
              setBadgeAnimationDays(badge.days);
              setBadgeAnimationVisible(true);
              setTimeout(() => setBadgeAnimationVisible(false), 3000);
              setAnimationShoww(true);
            }
          }
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    loadBadgesAndAnimation();
  }, [categories]);

  useEffect(() => {
    if (!isReady || firstLoadRef.current) {
      firstLoadRef.current = false;
      return;
    }

    const save = async () => {
      try {
        if (!isReady) return;
        if (categories.length === 0) {
          await AsyncStorage.setItem("categories", JSON.stringify([]));
        } else {
          await AsyncStorage.setItem(
            "categories",
            JSON.stringify(originalCategories)
          );
        }
      } catch (e) {
        console.error("Speichern fehlgeschlagen", e);
      }
    };

    const saveRoutines = async () => {
      try {
        if (routines.length === 0) {
          await AsyncStorage.setItem("routines", JSON.stringify([]));
        } else {
          await AsyncStorage.setItem(
            "routines",
            JSON.stringify(originalRoutines)
          );
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    save();
    saveRoutines();
  }, [categories, isReady, routines]);

  const loadCategories = async (theme = currentTheme) => {
    try {
      const qd = await AsyncStorage.getItem("QuestDate");
      if (qd) {
        const p = JSON.parse(qd);
        setQuestDateDone(p);
      }
    } catch (e) {
      console.error("Laden fehlgeschlagen", e);
    }
    try {
      const qds = await AsyncStorage.getItem("QuestsDone");
      if (qds) {
        const ps = JSON.parse(qds);
        setQuestsDone(ps);
      }
    } catch (e) {
      console.error("Laden fehlgeschlagen", e);
    }

    try {
      const stored = await AsyncStorage.getItem("categories");
      if (stored) {
        const parsed = JSON.parse(stored);
        const today = new Date();
        const todayFormatted = today.toLocaleDateString("de-DE");
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayFormatted = yesterday.toLocaleDateString("de-DE");
        const days = [
          "Sonntag",
          "Montag",
          "Dienstag",
          "Mittwoch",
          "Donnerstag",
          "Freitag",
          "Samstag",
        ];
        const dayOfWeek = today.getDay();
        const dayName = days[dayOfWeek];

        const NewupdatedCategories = parsed.map((category: any) => {
          const processedCategory = {
            ...category,
            startDate: new Date(category.startDate),
            checkedDays: category.checkedDays.map((day: any) => ({
              ...day,
              date: new Date(day.date),
            })),
          };
          // error is laying down here
          if (
            processedCategory.lastCheckDate != yesterdayFormatted &&
            processedCategory.lastCheckDate != todayFormatted &&
            //processedCategory.lastCheckDate != "" &&
            processedCategory.streak > 1 &&
            !processedCategory.selectedDays.includes(dayName) // maybe wrong idk yet, viewing tomorrow
          ) {
            if (!processedCategory.archivated) {
              return { ...processedCategory, streak: 0 };
            }
          }
          return processedCategory;
        });

        const updatedCategories = NewupdatedCategories.filter(
          (category: any): category is Category => category !== undefined
        ).map((category: any) => {
          const lastCheck = category.lastCheckDate
            ? new Date(category.lastCheckDate)
            : null;
          if (!lastCheck || category.lastCheckDate !== todayFormatted) {
            return {
              ...category,
              checkedToday: 0,
            };
          }
          return category;
        });
        setOriginalCategories(updatedCategories);
        const finalCategories =
          selectedCategoryCategories && selectedCategoryCategories.trim() !== ""
            ? updatedCategories.filter(
                (cat: any) => cat.category === selectedCategoryCategories
              )
            : updatedCategories;
        setCategories(finalCategories);
      }
    } catch (e) {
      console.error("Laden fehlgeschlagen", e);
    } finally {
      setIsReady(true);
      loadWidgetData();
    }
  };

  const loadRoutines = async () => {
    try {
      const stored = await AsyncStorage.getItem("routines");
      if (!stored) {
        return;
      }
      if (stored) {
        const parsed = JSON.parse(stored);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayFormatted = yesterday.toLocaleDateString("de-DE");
        const today = new Date();
        const todayFormatted = today.toLocaleDateString("de-DE");
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Saturday",
          "Sunday",
        ];
        const dayOfWeek = today.getDay();
        const dayName = days[dayOfWeek];
        const NewUpdatedroutines = parsed.map((routine: any) => {
          if (
            routine.lastCheckDate != yesterdayFormatted &&
            routine.lastCheckDate != "" &&
            routine.lastCheckDate != todayFormatted &&
            !routine.selectedDays.includes(dayName) &&
            routine.streak > 1
          ) {
            if (!routine.archivated) {
              return { ...routine, streak: 0 };
            }
          }
          return routine;
        });
        setOriginalRoutines(NewUpdatedroutines);

        const finalRoutines =
          selectedCategoryRoutines && selectedCategoryRoutines.trim() !== ""
            ? NewUpdatedroutines.filter(
                (rout: any) => rout.category === selectedCategoryRoutines
              )
            : NewUpdatedroutines;

        setRoutines(finalRoutines);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    const loadEverything = async () => {
      try {
        const themeName = await AsyncStorage.getItem("theme");
        const parsedTheme = themeName
          ? (JSON.parse(themeName) as keyof typeof themes)
          : "default";
        console.log(parsedTheme);
        setActiveTheme(parsedTheme);
        await loadCategories(themes.default);

        if (parsedTheme !== "default") {
          await loadCategories(themes[parsedTheme]);
        }
      } finally {
        setIsCategoriesLoaded(true);
      }
    };

    loadEverything();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      loadRoutines();
    }, [])
  );

  const [expand, setExpand] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("3");

  const handleCheckIn = async (
    index: number,
    github: boolean
  ): Promise<void> => {
    const todayDate = new Date();
    const today = todayDate.toLocaleDateString("de-DE");

    const updatedCategories = [...categories];
    const category = updatedCategories[index];

    const isSameDay = (date1: Date, date2: Date) => {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
      return d1.getTime() === d2.getTime();
    };

    if (github) {
      if (category.lastCheckDate !== today) {
        const dayIndex = category.checkedDays.findIndex((day) => {
          const dayDate =
            day.date instanceof Date ? day.date : new Date(day.date);
          return isSameDay(dayDate, todayDate);
        });

        if (dayIndex !== -1) {
          category.checkedDays[dayIndex].status = true;
        }

        category.buttonColor = category.color;
        category.streak += 1;
        category.lastCheckDate = today;
        category.days += 1;

        if (category.amount > category.checkedToday) {
          category.checkedToday++;
        }

        if (category.streak > category.longestStreak) {
          category.longestStreak = category.streak;
        }
      }

      setCategories(updatedCategories);

      await updateWidgetWithCategory({
        ...updatedCategories[index],
        streak: Math.max(0, category.streak),
      });

      return;
    }

    if (category.lastCheckDate === today) {
      const index = category.checkedDays.findIndex((day) => {
        const dayDate =
          day.date instanceof Date ? day.date : new Date(day.date);
        return isSameDay(dayDate, todayDate);
      });

      if (index !== -1) {
        category.checkedDays[index].status = false;
      }

      category.buttonColor = currentTheme.border;
      category.streak -= 1;
      category.lastCheckDate = "";
      category.days -= 1;
      category.checkedToday = 0;
      category.longestStreak -= 1;
    } else {
      const index = category.checkedDays.findIndex((day) => {
        const dayDate =
          day.date instanceof Date ? day.date : new Date(day.date);
        return isSameDay(dayDate, todayDate);
      });

      if (category.amount === 1) {
        category.checkedToday = 1;
        if (index !== -1) {
          category.checkedDays[index].status = true;
        }
        category.buttonColor = category.color;
        category.streak += 1;
        category.lastCheckDate = today;
        category.days += 1;
        if (category.streak > category.longestStreak) {
          category.longestStreak = category.streak;
        }
      } else {
        if (category.amount > category.checkedToday) {
          category.checkedToday++;
        }

        if (category.amount === category.checkedToday) {
          if (index !== -1) {
            category.checkedDays[index].status = true;
          }
          category.buttonColor = category.color;
          category.streak += 1;
          category.lastCheckDate = today;
          category.days += 1;
          if (category.streak > category.longestStreak) {
            category.longestStreak = category.streak;
          }
        }
      }
    }

    setCategories(updatedCategories);

    await updateWidgetWithCategory({
      ...category,
      streak: Math.max(0, category.streak),
    });
  };

  useEffect(() => {
    const askForReview = async () => {
      const available = await StoreReview.isAvailableAsync();
      if (available) {
        StoreReview.requestReview();
      }
    };
    askForReview();
  }, []);

  useEffect(() => {
    if (categories.length === 0) return;

    const getHighestStreak = async () => {
      const updatedCategories = [...categories];
      let highestStreak = 0;
      updatedCategories.forEach((category, index) => {
        if (category.streak > highestStreak) {
          highestStreak = category.streak;
        }
      });
      try {
        AsyncStorage.setItem("Streak", JSON.stringify(highestStreak));
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    getHighestStreak();
  }, [categories]);

  const archivateHabit = (indexReal: number) => {
    const Categories = [...categories];
    Categories.forEach((category, index) => {
      if (indexReal == index) {
        category.archivated = !category.archivated;
      }
    });
    setCategories(Categories);
  };

  const archivateroutine = (indexReal: number) => {
    const Routines = [...routines];
    Routines.forEach((routine, index) => {
      if (index == indexReal) {
        routine.archivated = !routine.archivated;
      }
    });
    setRoutines(Routines);
  };
  const getRandomColor = () => {
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  };
  const addNewHabit = (
    name: string,
    iconName: string,
    amount: number,
    selectedDays: string[]
  ) => {
    if (name === "") {
      Alert.alert("Error", "Please enter a name for your habit");
      setExpand(false);
      setSelectedIcon("star");
      setSelectedDays([]);
      setSelectedCategory("");
      return;
    }

    if (name.length > 15) {
      Alert.alert("Error", "Name should not be longer than 15 characters");
      setExpand(false);
      setSelectedIcon("star");
      setSelectedDays([]);
      setSelectedCategory("");

      return;
    }

    const totalDays = 315;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const jsDay = today.getDay();
    const daysSinceMonday = (jsDay + 6) % 7;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysSinceMonday);
    startDate.setHours(0, 0, 0, 0);

    const checkedDays = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return {
        status: false,
        date: date,
      };
    });
    const newCategory: Category = {
      name: name,
      streak: 0,
      color: getRandomColor(),
      checkedDays: checkedDays,
      lastCheckDate: "",
      days: 0,
      startDate: startDate,
      buttonColor: currentTheme.border,
      iconname: iconName,
      archivated: false,
      changeIcon: false,
      github: false,
      amount: amount,
      checkedToday: 0,
      selectedDays: selectedDays,
      modelOpen: false,
      camerashow: false,
      imagePaths: [],
      galleryVisible: false,
      category: selectedCategory,
      longestStreak: 0,
    };
    const updatedCategories = [...originalCategories, newCategory];
    setOriginalCategories(updatedCategories);

    if (selectedCategoryCategories) {
      const filtered = updatedCategories.filter(
        (cat) => cat.category === selectedCategoryCategories
      );
      setCategories(filtered);
    } else {
      setCategories(updatedCategories);
    }
    setSelectedCategoryCategories("");

    setSelectedIcon("");
    setExpand(false);
    setName("");
    setSelectedDays([]);
    const index = categories.length;
  };

  const handleCheckInRoutine = (index: number, routineindex: number) => {
    const todayDate = new Date();
    const today = todayDate.toLocaleDateString("de-DE");

    const Routines = [...routines];
    const Routine = Routines[routineindex];
    const RoutineTodo = Routine.todos[index];

    const isSameDay = (date1: Date, date2: Date) => {
      date1.setHours(0, 0, 0, 0);
      date2.setHours(0, 0, 0, 0);

      return date1.getTime() === date2.getTime();
    };

    const RoutineIndex = Routine.checkedDays.findIndex((day) =>
      isSameDay(new Date(day.date), todayDate)
    );
    const wasCompleteBefore =
      Routine.checkedDays[RoutineIndex]?.status === true;

    if (RoutineTodo.lastCheckedDate === today) {
      RoutineTodo.lastCheckedDate = "";
    } else {
      RoutineTodo.lastCheckedDate = today;
    }
    const checkedCount = Routine.todos.filter(
      (todo) => todo.lastCheckedDate === today
    ).length;

    if (checkedCount === Routine.todos.length) {
      Routine.checkedDays[RoutineIndex].status = true;
      if (!wasCompleteBefore) {
        Routine.streak += 1;
        Routine.days += 1;
      }
      if (Routine.longestStreak < Routine.streak) {
        Routine.longestStreak = Routine.streak;
      }
      Routine.lastCheckedDate = today;
    } else {
      Routine.checkedDays[RoutineIndex].status = false;
      if (wasCompleteBefore) {
        Routine.streak -= 1;
        Routine.days -= 1;
        Routine.longestStreak -= 1;
      }
      Routine.lastCheckedDate = "";
    }

    setRoutines(Routines);
  };

  const addNewRoutine = (
    name: string,
    iconName: string,
    amount: number,
    selectedDays: string[]
  ) => {
    if (name === "") {
      Alert.alert("Error", "Please enter a name for your Routine");
      setExpandRoutine(false);
      setSelectedDays([]);
      setSelectedCategory("");
      setSelectedIcon("star");
      return;
    }

    if (name.length > 15) {
      Alert.alert("Error", "Name should not be longer than 15 characters");
      setExpandRoutine(false);
      setSelectedDays([]);
      setSelectedCategory("");
      setSelectedIcon("star");
      return;
    }
    const totalDays = 315;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const jsDay = today.getDay();
    const daysSinceMonday = (jsDay + 6) % 7;

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysSinceMonday);
    startDate.setHours(0, 0, 0, 0);

    const checkedDays = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return {
        status: false,
        date: date,
      };
    });

    const newRoutine: Routine = {
      name: name,
      lastCheckedDate: " ",
      streak: 0,
      amount: amount,
      checkedDays: checkedDays,
      startDate: startDate,
      archivated: false,
      checkedToday: 0,
      changeIcon: false,
      days: 0,
      github: false,
      todoschecked: 0,
      color: getRandomColor(),
      buttonColor: currentTheme.border,
      iconname: iconName,
      todos: routineItem,
      selectedDays: selectedDays,
      modelOpen: false,
      category: selectedCategory,
      longestStreak: 0,
    };

    const updatedRoutines = [...originalRoutines, newRoutine];
    setOriginalRoutines(updatedRoutines);

    if (selectedCategoryRoutines) {
      const filtered = updatedRoutines.filter(
        (rout) => rout.category === selectedCategoryRoutines
      );
      setRoutines(filtered);
    } else {
      setRoutines(updatedRoutines);
    }
    setSelectedCategoryRoutines("");
    setExpandRoutine(false);
    setName("");
    const index = categories.length;
    setSelectedDays([]);
  };

  const editRoutine = (
    RoutineIndex: number,
    todoindex: number,
    newTodo: string
  ) => {
    const UpdatedRoutines = routines.map((routine, index) => {
      if (index === RoutineIndex) {
        const updatedTodos = routine.todos.map((todo, todoIndex) => {
          if (todoIndex === todoindex) {
            return {
              ...todo,
              name: newTodo,
              edited: false,
            };
          }
          return todo;
        });
        return { ...routine, todos: updatedTodos };
      }
      return routine;
    });
    setRoutines(UpdatedRoutines);
  };

  const removeHabbit = async (reindex: number) => {
    const categoryToRemove = categories[reindex];

    try {
      console.log(`🗑️ Removing widget data for: ${categoryToRemove.name}`);

      const widgetIds = await CategoryDatamodule.getAllWidgetIds();

      for (const widgetId of widgetIds) {
        try {
          const widgetData = await CategoryDatamodule.loadWidgetDataForId(
            widgetId
          );

          if (widgetData && widgetData.habitName === categoryToRemove.name) {
            console.log(
              `Found matching widget ID: ${widgetId} for ${categoryToRemove.name}`
            );

            await CategoryDatamodule.saveToPrefs(
              `widget_${widgetId}_habit_name`,
              "Habit wurde gelöscht"
            );
            await CategoryDatamodule.saveToPrefs(
              `widget_${widgetId}_habit_checkedDays`,
              "[]"
            );
            await CategoryDatamodule.saveToPrefs(
              `widget_${widgetId}_habit_startDate`,
              ""
            );
            await CategoryDatamodule.saveToPrefs(
              `widget_${widgetId}_habit_color`,
              "#999999"
            );
            await CategoryDatamodule.saveToPrefs(
              `widget_${widgetId}_habit_streak`,
              "0"
            );

            console.log(`✅ Widget data cleared for ID: ${widgetId}`);
          }
        } catch (error) {
          console.error(
            `Failed to check widget ${widgetId} configuration:`,
            error
          );
        }
      }

      await CategoryDatamodule.updateWidget();
    } catch (error) {
      console.error("❌ Failed to clear widget data:", error);
    }

    const updatedCategories = categories.filter(
      (category, index) => index !== reindex
    );
    setCategories(updatedCategories);
    setOriginalCategories(updatedCategories);
  };
  const removeRoutine = (reindex: number) => {
    Alert.alert(
      "Delete Routine",
      "Are you sure you want to delete this Routine?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            removeRoutinereal(reindex);
            Alert.alert("Deleted", "Routine successfully deleted.");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const removeRoutinereal = (reindex: number) => {
    const updatedRoutines = routines.filter(
      (routine, index) => index !== reindex
    );
    setRoutines(updatedRoutines);
    setOriginalRoutines(updatedRoutines);
  };

  const handleDeletePress = (reindex: number) => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            removeHabbit(reindex);
            Alert.alert("Deleted", "Habit successfully deleted.");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const GetRandomUncheckedHabbit = () => {
    const uncheckedCategories = categories.filter(
      (category) =>
        !category.archivated &&
        category.streak !== 0 &&
        category.lastCheckDate !== new Date().toLocaleDateString("de-DE")
    );
    if (uncheckedCategories.length === 0) {
      return;
    }
    const randomIndex = Math.floor(Math.random() * uncheckedCategories.length);
    return uncheckedCategories[randomIndex].name;
  };

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      return false;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Notifications are disabled!");
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return true;
  }

  useEffect(() => {
    (async () => {
      const permissionGranted = await registerForPushNotificationsAsync();
      const settingspermissionGranted = await AsyncStorage.getItem(
        "notifications"
      );
      const send = settingspermissionGranted
        ? JSON.parse(settingspermissionGranted)
        : false;

      if (permissionGranted) {
        await Notifications.cancelAllScheduledNotificationsAsync();

        const uncheckedHabbit = await GetRandomUncheckedHabbit();

        if (send && uncheckedHabbit !== null && uncheckedHabbit !== undefined) {
          const m = [
            `You haven’t done your ${uncheckedHabbit} yet. Time to get it done.`,
            `${uncheckedHabbit} is still unchecked. Handle it.`,
            `Still missing: ${uncheckedHabbit}. No excuses.`,
            `Clock’s ticking – ${uncheckedHabbit} isn’t done yet. Move.`,
          ];

          const rm = m[Math.floor(Math.random() * m.length)];

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "🎯 Daily Habit Check!",
              body: rm,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DAILY,
              hour: 19,
              minute: 0,
            },
          });
        }

        const m2 = [
          "Don't forget to check your habits 🔥",
          "Once is nothing. Twice is a start.",
          "Your routine is waiting. Get to it.",
          "No motivation? Do it anyway.",
          "5 minutes is better than 0.",
          "You wanted change. Act like it.",
          "Small step, big impact.",
          "Discipline beats motivation.",
          "Today matters. Tomorrow is an excuse.",
          "Good habits don’t build themselves.",
        ];

        const rm2 = m2[Math.floor(Math.random() * m2.length)];

        const alldone = await GetRandomUncheckedHabbit();
        if (send && alldone !== null) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "🎯 Daily Habit Check!",
              body: rm2,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
              seconds: 4 * 60 * 60,
              repeats: true,
            },
          });
        }
      }
    })();
  }, []);

  useEffect(() => {
    const loadColorScheme = async () => {
      try {
        const colorScheme = await AsyncStorage.getItem("color");
        if (colorScheme) {
          setColorScheme(JSON.parse(colorScheme));
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadColorScheme();
  }, []);

  const addDays = async (days: number, index: number) => {
    const updatedCategories = [...categories];
    const category = updatedCategories[index];
    const lastDay =
      category.checkedDays.length > 0
        ? category.checkedDays[category.checkedDays.length - 1].date
        : category.startDate;

    const existingDates = new Set(
      category.checkedDays.map((d) => new Date(d.date).toDateString())
    );
    const newDays: day[] = [];
    for (let i = 1; i <= days; i++) {
      const nextDate = new Date(lastDay);
      nextDate.setDate(nextDate.getDate() + i);

      if (!existingDates.has(nextDate.toDateString())) {
        newDays.push({
          status: false,
          date: nextDate,
        });
        existingDates.add(nextDate.toDateString());
      }
    }
    category.checkedDays = [...category.checkedDays, ...newDays];
    setCategories(updatedCategories);
  };

  const addDaysRoutine = async (days: number, index: number) => {
    const updatedRoutines = [...routines];
    const routine = updatedRoutines[index];
    const lastDay =
      routine.checkedDays.length > 0
        ? routine.checkedDays[routine.checkedDays.length - 1].date
        : routine.startDate;

    const existingDates = new Set(
      routine.checkedDays.map((d) => new Date(d.date).toDateString())
    );
    const newDays: day[] = [];
    for (let i = 1; i <= days; i++) {
      const nextDate = new Date(lastDay);
      nextDate.setDate(nextDate.getDate() + i);

      if (!existingDates.has(nextDate.toDateString())) {
        newDays.push({
          status: false,
          date: nextDate,
        });
        existingDates.add(nextDate.toDateString());
      }
    }
    routine.checkedDays = [...routine.checkedDays, ...newDays];
    setRoutines(updatedRoutines);
  };

  const swapHabits = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= categories.length ||
      toIndex >= categories.length
    ) {
      return;
    }
    const newCategories = [...categories];
    const temp = newCategories[fromIndex];
    newCategories[fromIndex] = newCategories[toIndex];
    newCategories[toIndex] = temp;
    setCategories(newCategories);
  };

  const swapRoutines = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= routines.length ||
      toIndex >= routines.length
    ) {
      return;
    }

    const newRoutines = [...routines];
    const temp = newRoutines[fromIndex];
    newRoutines[fromIndex] = newRoutines[toIndex];
    newRoutines[toIndex] = temp;
    setRoutines(newRoutines);
  };

  const deleteTodo = (index: number, todoIndex: number) => {
    const updatedRoutines = [...routines];
    updatedRoutines.forEach((routine, Routineindex) => {
      if (Routineindex == index) {
        const updatedTodos = routine.todos.filter((_, i) => i !== todoIndex);
        routine.todos = updatedTodos;
      }
    });
    setRoutines(updatedRoutines);
  };
  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const [introPage, setIntroPage] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(false);

  useEffect(() => {
    const loadStartScreen = async () => {
      const loading = await AsyncStorage.getItem("start");
      if (loading === null) {
        AsyncStorage.setItem("start", "true");
        setStartScreen(true);
      } else {
        setStartScreen(false);
      }
    };
    loadStartScreen();
  }, []);

  const isSameDay = (date1: Date, date2: Date) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
  };

  useEffect(() => {
    const saveTheme = async () => {
      await AsyncStorage.setItem("theme", JSON.stringify(activeTheme));
      const today = new Date();

      const updatedCategories = categories.map((category) => {
        const hasCheckedToday = category.checkedDays.some((day) => {
          const dayDate =
            day.date instanceof Date ? day.date : new Date(day.date);
          return isSameDay(dayDate, today) && day.status;
        });

        return {
          ...category,
          buttonColor: hasCheckedToday ? category.color : currentTheme.border,
        };
      });

      setCategories(updatedCategories);
    };

    saveTheme();
  }, [activeTheme]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    if (colorScheme === "dark") {
      return (
        <View className="flex-1 items-center justify-center bg-slate-950">
          <Text className="font-bold text-white text-2xl mb-10 text-center">
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    } else {
      return (
        <View className="flex-1 items-center justify-center bg-white">
          <Text>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  const saveImages = (index: number) => {
    if (!photoUri) {
      return;
    }
    if (photoUri) {
      const upddatedCategories = [...categories];
      upddatedCategories.forEach((category, categoryIndex) => {
        if (index === categoryIndex) {
          category.imagePaths.push(photoUri);
          category.camerashow = false;
        }
      });
      setCategories(upddatedCategories);
    }
  };

  if (startScreen) {
    return (
      <ScrollView
        className="flex-1 bg-slate-950"
        contentContainerClassName="flex-1 justify-center items-center px-6"
        keyboardShouldPersistTaps="handled"
      >
        {introPage === 0 && (
          <>
            <Image
              source={require("../../assets/images/GoodHabitsRealV3.png")}
              className="  mb-10 mt-10"
              style={{ width: "100%", height: "50%" }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-white text-center mb-8">
              Welcome to Streakly !
            </Text>
          </>
        )}

        {introPage === 1 && (
          <>
            <Image
              source={require("../../assets/images/AppLogo-removebg-preview.png")}
              className="  mb-10 mt-10"
              style={{ width: "100%", height: "35%" }}
              resizeMode="contain"
            />
            <View
              className={`rounded-t-3xl  px-6  `}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                maxHeight: "40%",
              }}
            >
              <View className="items-center justify-center">
                <Text className="font-bold text-white text-2xl">
                  Choose your Theme
                </Text>
              </View>
              <View className="flex-row flex-wrap mb-10 mt-10 gap-5 items-center justify-center">
                {Object.entries(themes).map(([key, theme]) => {
                  const isActive = key === activeTheme;

                  return (
                    <TouchableOpacity
                      key={key}
                      className="p-4 rounded-full h-12 w-12"
                      style={{
                        backgroundColor: theme.primary.bg,
                        borderWidth: isActive ? 3 : 0,
                        borderColor: isActive ? "#71717a" : "transparent",
                      }}
                      onPress={() => setActiveTheme(key)}
                    />
                  );
                })}
              </View>
            </View>
          </>
        )}

        {introPage === 2 && (
          <>
            <Image
              source={require("../../assets/images/StreakImage_transparent.png")}
              style={{ width: "100%", height: "57%" }}
              className="mb-8"
              resizeMode="contain"
            />
            <Text className="text-xl font-bold text-white text-center mb-4">
              Start now, and achieve your goals.
            </Text>
          </>
        )}

        <View className="flex-row justify-center items-center mb-4">
          {[0, 1, 2].map((idx) => (
            <View
              key={idx}
              className={`w-3 h-3 mx-1 rounded-full ${
                idx === introPage ? "bg-blue-500" : "bg-slate-700"
              }`}
            />
          ))}
        </View>

        <View className="mb-20 flex-row gap-3">
          <TouchableOpacity
            className={`bg-gray-900 px-8 py-4 rounded-full ${
              introPage === 0 ? "opacity-50" : ""
            }`}
            onPress={() => {
              if (introPage > 0) {
                setIntroPage(introPage - 1);
              }
            }}
            disabled={introPage === 0}
          >
            <Text className="text-white font-bold text-lg">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-900 px-8 py-4 rounded-full"
            onPress={() => {
              if (introPage < 2) {
                setIntroPage(introPage + 1);
              } else {
                setStartScreen(false);
              }
            }}
          >
            <Text className="text-white font-bold text-lg">
              {introPage < 2 ? "Next" : "Let's Go !"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View className={`flex-1 `} style={{ backgroundColor: currentTheme.bg }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-8 pb-20"
      >
        <View className="flex-col justify-between w-full"></View>

        <View className="items-center mb-8 mt-20">
          <View className="flex-row justify-between gap-3">
            <Text
              style={{ color: currentTheme.text }}
              className="text-5xl font-bold "
            >
              Streakly
            </Text>
            <Image
              className="w-[50px] h-[50px] relative bottom-1"
              source={require("../../assets/images/AppLogo-removebg-preview.png")}
            ></Image>
          </View>
          <Text
            style={{ color: currentTheme.textMuted }}
            className="mt-2 text-center font-bold"
          >
            Track your daily habits and build streaks
          </Text>
        </View>

        <View
          style={{
            backgroundColor: currentTheme.card,
          }}
          className="flex-row mb-10  rounded-lg p-1"
        >
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-md $`}
            style={{
              backgroundColor:
                activeTab === "habits"
                  ? currentTheme.primary.main
                  : currentTheme.card,
            }}
            onPress={() => {
              setActiveTab("habits");
              setExpandRoutine(false);
            }}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "habits" ? "text-white" : "text-gray-400"
              }`}
            >
              Habits
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 px-4 rounded-md 
             
            `}
            style={{
              backgroundColor:
                activeTab === "routines"
                  ? currentTheme.primary.main
                  : currentTheme.card,
            }}
            onPress={() => {
              setActiveTab("routines");
              setExpand(false);
            }}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "routines" ? "text-white" : "text-gray-400"
              }`}
            >
              Routines
            </Text>
          </TouchableOpacity>
          {badgeAnimationVisible && badgeAnimationDays !== null && (
            <BadgeAnimation
              days={badgeAnimationDays}
              visible={badgeAnimationVisible}
            />
          )}

          <Modal animationType="slide" visible={themeModal} transparent={true}>
            <View className="flex-1 justify-end ">
              <View
                className={`rounded-t-3xl  px-6 `}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  maxHeight: "40%",
                  backgroundColor: currentTheme.card,
                }}
              >
                <TouchableOpacity
                  className="mt-5 rounded-full h-10 w-10 items-center justify-center "
                  style={{ backgroundColor: currentTheme.card }}
                  onPress={() => {
                    setThemeModal(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    color={"white"}
                    size={20}
                  ></MaterialCommunityIcons>
                </TouchableOpacity>
                <View className="items-center justify-center">
                  <Text className="font-bold text-white text-2xl">
                    Choose your Theme
                  </Text>
                </View>
                <View className="flex-row flex-wrap mb-10 mt-10 gap-5 items-center justify-center">
                  {Object.entries(themes).map(([key, theme]) => {
                    const isActive = key === activeTheme;

                    return (
                      <TouchableOpacity
                        key={key}
                        className="p-4 rounded-full h-12 w-12"
                        style={{
                          backgroundColor: theme.primary.bg,
                          borderWidth: isActive ? 3 : 0,
                          borderColor: isActive ? "#71717a" : "transparent",
                        }}
                        onPress={() => setActiveTheme(key)}
                      />
                    );
                  })}
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {activeTab === "habits" ? (
          <View
            className="flex-1 "
            style={{ backgroundColor: currentTheme.bg }}
          >
            <View className="bg-gradient-to-b from-gray-900 to-gray-950 pb-6 pt-4">
              <FlatList
                data={GroupCategories}
                renderItem={renderCategoryItem2}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingVertical: 8,
                }}
                className="flex-grow-0"
              />
            </View>
            {categories.map((category, index) => (
              <View
                key={index}
                className="overflow-hidden rounded-2xl  backdrop-blur-lg border  mb-10"
                style={{
                  backgroundColor: currentTheme.card,
                  borderColor: currentTheme.border,
                }}
              >
                {category.archivated && (
                  <View className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 opacity-50 z-10" />
                )}

                <View
                  className=" p-4 rounded-t-2xl"
                  style={{ backgroundColor: currentTheme.tab }}
                >
                  <View className="flex-row justify-between items-center mb-3  ">
                    <View className="flex-row justify-between gap-3 ">
                      <TouchableOpacity
                        onPress={() => {
                          const newCategories = [...categories];
                          newCategories[index] = {
                            ...newCategories[index],
                            changeIcon: !category.changeIcon,
                          };
                          setCategories(newCategories);
                        }}
                        className="h-8 w-8  rounded-full items-center justify-center"
                        style={{ backgroundColor: currentTheme.border }}
                      >
                        <MaterialCommunityIcons
                          name={category.iconname as any}
                          size={18}
                          color={category.color}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="font-bold text-2xl text-white"
                        onPress={() => {
                          const newCategories = [...categories];
                          newCategories[index] = {
                            ...newCategories[index],
                            modelOpen: !category.modelOpen,
                          };
                          setCategories(newCategories);
                        }}
                      >
                        <Text className="font-bold text-2xl text-white max-w-[100px]">
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row  ">
                      <TouchableOpacity
                        onPress={() => {
                          const newCategories = [...categories];
                          newCategories[index] = {
                            ...newCategories[index],
                            camerashow: !category.camerashow,
                          };
                          setCategories(newCategories);
                        }}
                        className=" h-9 w-9 mr-3 rounded-full items-center justify-center"
                        style={{ backgroundColor: currentTheme.border }}
                      >
                        <MaterialCommunityIcons
                          name="camera"
                          size={18}
                          color={category.color}
                        />
                      </TouchableOpacity>
                      <View className="mr-3">
                        <TouchableOpacity
                          onPress={() => {
                            archivateHabit(index);
                          }}
                          className=" h-9 w-9 rounded-full items-center justify-center z-20"
                          style={{ backgroundColor: currentTheme.border }}
                        >
                          <MaterialCommunityIcons
                            name="archive"
                            size={18}
                            color={category.color}
                          />
                        </TouchableOpacity>
                      </View>

                      <View className="bg-white/20 px-3 py-1 rounded-full ">
                        <FlameAnimation
                          flames={category.streak}
                          color="white"
                        ></FlameAnimation>
                      </View>
                    </View>
                  </View>
                </View>

                <View className="p-3 flex-row justify-between  items-center ">
                  <View className="flex-1 mr-3">
                    <Streak
                      archivated={category.archivated}
                      addDays={(days: number) => addDays(days, index)}
                      startDate1={category.startDate}
                      checkedDays={category.checkedDays}
                      color={category.color}
                      bgcolor={currentTheme.tab}
                      grayColor={currentTheme.border}
                      days={105}
                      textColor="white"
                    />
                  </View>

                  <View className="left-8 flex justify-center items-center relative">
                    <AnimatedCircularProgress
                      size={55}
                      width={3}
                      fill={
                        (Math.min(category.checkedToday, category.amount) /
                          category.amount) *
                        100
                      }
                      tintColor={category.buttonColor}
                      backgroundColor="#64748b"
                      arcSweepAngle={360}
                      rotation={0}
                      lineCap="round"
                    />

                    <TouchableOpacity
                      onPress={() => handleCheckIn(index, false)}
                      className="h-12 w-12 absolute rounded-full bg"
                      style={{
                        backgroundColor: category.buttonColor,
                        alignItems: "center",
                        justifyContent: "center",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}
                    >
                      <Text className="text-white font-bold text-xl">✓</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDeletePress(index)}
                    className=" h-7 w-7 rounded-full items-center justify-center shadow-lg relative top-12 mt-20 z-20"
                    style={{ backgroundColor: currentTheme.border }}
                  >
                    <Text className="text-gray-400  text-md text-white ">
                      ✕
                    </Text>
                  </TouchableOpacity>
                  <Modal
                    animationType="slide"
                    visible={category.camerashow}
                    transparent={true}
                  >
                    <View className="flex-1 justify-end">
                      <View
                        className={`rounded-t-3xl `}
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: -2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          maxHeight: "90%",
                          backgroundColor: currentTheme.bg,
                        }}
                      >
                        <CameraView
                          ref={cameraRef}
                          facing={facing}
                          className=""
                        >
                          <TouchableOpacity
                            className=" ml-3 mb-3 rounded-full flex h-11 w-11 items-center justify-center"
                            style={{ backgroundColor: currentTheme.card }}
                          >
                            <MaterialCommunityIcons
                              name="close"
                              size={20}
                              color={"white"}
                              onPress={() => {
                                const newCategories = [...categories];
                                newCategories[index] = {
                                  ...newCategories[index],
                                  camerashow: false,
                                };
                                setCategories(newCategories);
                              }}
                            ></MaterialCommunityIcons>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={takePhoto}
                            className="ml-3 mb-3 rounded-full flex  h-11 w-11 items-center justify-center"
                            style={{ backgroundColor: currentTheme.card }}
                          >
                            <MaterialCommunityIcons
                              name="camera"
                              size={20}
                              color={"white"}
                            ></MaterialCommunityIcons>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              toggleCameraFacing();
                            }}
                            className="ml-3 mb-3 rounded-full flex  h-11 w-11 items-center justify-center"
                            style={{ backgroundColor: currentTheme.card }}
                          >
                            <MaterialCommunityIcons
                              name="camera-switch"
                              size={20}
                              color={"white"}
                            ></MaterialCommunityIcons>
                          </TouchableOpacity>
                        </CameraView>
                        {photoUri ? (
                          <View>
                            <View className="flex justify-center items-center w-full mt-10 rounded-xl">
                              <Image
                                className="flex justify-center items-center rounded-xl"
                                source={{ uri: photoUri }}
                                style={{ width: 300, height: 300 }}
                              />
                            </View>
                            <View className="mt-10 mb-10 w-full flex items-center">
                              <TouchableOpacity
                                onPress={() => saveImages(index)}
                                className="px-10 py-4 items-center justify-center rounded-xl"
                                style={{ backgroundColor: currentTheme.card }}
                              >
                                <Text className="text-white font-bold text-xl">
                                  Save
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View
                            className="flex-1 items-center justify-center "
                            style={{ backgroundColor: currentTheme.bg }}
                          >
                            <Text className="text-white font-bold text-2xl">
                              No Picture yet
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </Modal>

                  <Modal
                    animationType="slide"
                    visible={category.modelOpen}
                    transparent={true}
                  >
                    <View className="flex-1 justify-end">
                      <ScrollView
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        style={{ maxHeight: "90%" }}
                      >
                        <View
                          className={`rounded-t-3xl `}
                          style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: -2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            backgroundColor: currentTheme.card,
                          }}
                        >
                          <View className="flex-row mb-10">
                            <TouchableOpacity
                              onPress={() => {
                                const newCategories = [...categories];
                                newCategories[index] = {
                                  ...newCategories[index],
                                  modelOpen: false,
                                };
                                setCategories(newCategories);
                              }}
                              className="p-2 h-11 w-11 rounded-full items-center justify-center mt-3 ml-3 "
                              style={{ backgroundColor: currentTheme.border }}
                            >
                              <MaterialCommunityIcons
                                name="close"
                                size={24}
                                color={"#94a3b8"}
                              />
                            </TouchableOpacity>
                          </View>
                          <View className="flex-col items-center justify-center  mb-10">
                            <View className="flex-row gap-5 ">
                              <Text className="mb-5 font-bold text-3xl text-white">
                                {category.name}
                              </Text>

                              <View className="bg-white/20 px-3 py-1 rounded-full h-9  ">
                                <FlameAnimation
                                  flames={category.streak}
                                  color="white"
                                ></FlameAnimation>
                              </View>
                            </View>
                            <Text className="mb-5 text-gray-400 font-bold text-md">
                              Longest Streak: {category.longestStreak} 🔥
                            </Text>

                            <Text className="mb-5 text-gray-400 font-bold text-md ">
                              Started on:
                              {category.startDate &&
                              !isNaN(Date.parse(category.startDate.toString()))
                                ? "  " +
                                  new Date(
                                    category.startDate
                                  ).toLocaleDateString("de-DE")
                                : "Date not set"}
                            </Text>
                            <Text className="mb-5 text-gray-400 font-bold text-md ">
                              Last Checked:
                              {" " + category.lastCheckDate}
                            </Text>
                            <View className=" flex justify-center items-center">
                              <StreakV2
                                archivated={category.archivated}
                                addDays={(days: number) => addDays(days, index)}
                                startDate1={category.startDate}
                                checkedDays={category.checkedDays}
                                color={category.color}
                                bgcolor={currentTheme.tab}
                                grayColor={currentTheme.border}
                                textColor="white"
                              ></StreakV2>
                            </View>
                            <Text className="mb-3 text-white font-bold text-lg">
                              Selected Days
                            </Text>
                            <View className="flex-row flex-wrap justitfy-center items-center mb-20 gap-4">
                              {category.selectedDays.map((day, index) => (
                                <View key={index}>
                                  <TouchableOpacity
                                    className="h-12 w-12 rounded-full items-center justify-center"
                                    style={{
                                      backgroundColor: category.color,
                                    }}
                                  >
                                    <Text className="font-bold text-white text-lg">
                                      {day.substring(0, 2).toUpperCase()}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              ))}
                            </View>
                            <Text className="font-bold text-white text-2xl">
                              Images
                            </Text>
                            <View className="flex-row flex-wrap mt-5 gap-4 items-center justify-center">
                              {(category.imagePaths ?? []).length > 0 ? (
                                (category.imagePaths ?? []).map((path, idx) => (
                                  <View
                                    className="flex-col gap-2 items-center justify-center"
                                    key={idx}
                                  >
                                    <TouchableOpacity
                                      onPress={() => {
                                        setImageIndex(idx);
                                        const newCategories = [...categories];
                                        newCategories[index] = {
                                          ...newCategories[index],
                                          galleryVisible: true,
                                        };
                                        setCategories(newCategories);
                                      }}
                                    >
                                      <Image
                                        source={{ uri: path }}
                                        style={{
                                          width: 100,
                                          height: 100,
                                          borderRadius: 8,
                                        }}
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      className="h-10 w-10 rounded-full items-center justify-center"
                                      style={{
                                        backgroundColor: currentTheme.border,
                                      }}
                                      onPress={() => {
                                        const newCategories = [...categories];
                                        const newImagePaths = [
                                          ...(newCategories[index].imagePaths ??
                                            []),
                                        ];
                                        newImagePaths.splice(idx, 1);

                                        newCategories[index] = {
                                          ...newCategories[index],
                                          imagePaths: newImagePaths,
                                        };

                                        setCategories(newCategories);
                                      }}
                                    >
                                      <MaterialCommunityIcons
                                        name="trash-can"
                                        size={20}
                                        color={currentTheme.card}
                                      ></MaterialCommunityIcons>
                                    </TouchableOpacity>
                                  </View>
                                ))
                              ) : (
                                <Text className="flex justify-center items-center font-bold text-lg text-white">
                                  No Images Found
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                      </ScrollView>
                    </View>
                  </Modal>
                </View>
                <View>
                  <ImageViewing
                    images={(category.imagePaths ?? []).map((uri) => ({
                      uri,
                    }))}
                    imageIndex={imageIndex}
                    visible={category.galleryVisible}
                    onRequestClose={() => {
                      const newCategories = [...categories];
                      newCategories[index] = {
                        ...newCategories[index],
                        galleryVisible: false,
                      };
                      setCategories(newCategories);
                    }}
                  />
                </View>
                {category.changeIcon ? (
                  <View className="flex-col">
                    <ScrollView
                      className="h-72 mb-4 mt-8"
                      scrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                    >
                      <View className="flex-row flex-wrap justify-between mr-5 ml-5">
                        {items.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            className="w-[30%] items-center p-3 rounded-lg mb-2  "
                            style={{
                              backgroundColor:
                                selectedIcon === item.value
                                  ? currentTheme.primary.main
                                  : currentTheme.border,
                            }}
                            onPress={() => setSelectedIcon(item.value)}
                          >
                            <MaterialCommunityIcons
                              name={item.value as any}
                              size={24}
                              color={
                                selectedIcon === item.value
                                  ? "#FFFFFF"
                                  : "#4B5563"
                              }
                            />
                            <Text
                              className={`text-xs mt-1 text-center ${
                                selectedIcon === item.value
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                              numberOfLines={1}
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                    <TouchableOpacity
                      onPress={() => {
                        const newCategories = [...categories];
                        newCategories[index] = {
                          ...newCategories[index],
                          changeIcon: false,
                          iconname: selectedIcon,
                        };
                        setCategories(newCategories);
                      }}
                      className="rounded-lg py-3 items-center ml-5 mr-5 mb-5"
                      style={{
                        backgroundColor:
                          !name || !selectedIcon
                            ? currentTheme.border
                            : currentTheme.primary.main,
                      }}
                    >
                      <Text className="text-white font-bold">Speichern</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <View className="space-y-4 ">
            <View
              className=" pb-6 pt-4"
              style={{ backgroundColor: currentTheme.bg }}
            >
              <FlatList
                data={GroupCategories}
                renderItem={renderCategoryItem3}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingVertical: 8,
                }}
                className="flex-grow-0"
              />
            </View>
            {routines.map((routine, index) => (
              <View
                key={index}
                className="overflow-hidden rounded-2xl backdrop-blur-lg border  mb-10"
                style={{
                  backgroundColor: currentTheme.card,
                  borderColor: currentTheme.border,
                }}
              >
                {routine.archivated && (
                  <View className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 opacity-50 z-10" />
                )}
                <View
                  className={` p-4`}
                  style={{ backgroundColor: currentTheme.tab }}
                >
                  <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row justify-between gap-3">
                      <TouchableOpacity
                        onPress={() => {
                          const newRoutines = [...routines];
                          newRoutines[index] = {
                            ...newRoutines[index],
                            changeIcon: !routine.changeIcon,
                          };
                          setRoutines(newRoutines);
                        }}
                        className="h-8 w-8  rounded-full items-center justify-center"
                        style={{ backgroundColor: currentTheme.border }}
                      >
                        <MaterialCommunityIcons
                          name={routine.iconname as any}
                          size={18}
                          color={routine.color}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          const newRoutines = [...routines];
                          newRoutines[index] = {
                            ...newRoutines[index],
                            modelOpen: !routine.modelOpen,
                          };
                          setRoutines(newRoutines);
                        }}
                        className="font-bold text-2xl text-white"
                      >
                        <Text className="font-bold text-2xl text-white max-w-[160px] ">
                          {routine.name}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row ">
                      <View className="mr-3">
                        <TouchableOpacity
                          onPress={() => {
                            archivateroutine(index);
                          }}
                          className=" h-9 w-9 rounded-full items-center justify-center  z-20"
                          style={{ backgroundColor: currentTheme.border }}
                        >
                          <MaterialCommunityIcons
                            name="archive"
                            size={18}
                            color={routine.color}
                          />
                        </TouchableOpacity>
                      </View>
                      <View className="bg-white/20 px-3 py-1 rounded-full ">
                        <FlameAnimation flames={routine.streak} color="white" />
                      </View>
                    </View>
                  </View>
                </View>
                <View className="px-4 mb-4 mt-2">
                  <Text className="text-white font-semibold text-base mb-3">
                    Todos:
                  </Text>
                  {routine.todos && routine.todos.length > 0 ? (
                    routine.todos.map((todoItem, todoIndex) => {
                      const today = new Date().toLocaleDateString("de-DE");
                      const isCheckedToday = todoItem.lastCheckedDate === today;

                      return (
                        <View key={todoIndex} className="mb-3">
                          <View
                            className="flex-row items-center justify-between p-3 rounded-xl"
                            style={{ backgroundColor: currentTheme.border }}
                          >
                            <Text className="text-white flex-1 mr-3">
                              {todoItem.name}
                            </Text>
                            <View className="flex-row items-center gap-2">
                              <TouchableOpacity
                                onPress={() => {
                                  deleteTodo(index, todoIndex);
                                }}
                                className="h-8 w-8 rounded-full items-center justify-center"
                                style={{
                                  backgroundColor: currentTheme.card,
                                }}
                              >
                                <Text className="text-white font-bold text-sm">
                                  ✕
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setRoutines((prevRoutines) => {
                                    const updatedRoutines = [...prevRoutines];
                                    const updatedTodos = [
                                      ...updatedRoutines[index].todos,
                                    ];
                                    updatedTodos[todoIndex].edited =
                                      !updatedTodos[todoIndex].edited;
                                    updatedRoutines[index] = {
                                      ...updatedRoutines[index],
                                      todos: updatedTodos,
                                    };
                                    return updatedRoutines;
                                  });
                                }}
                                className="h-8 w-8 rounded-full items-center justify-center "
                                style={{
                                  backgroundColor: currentTheme.card,
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="pencil"
                                  size={16}
                                  color="white"
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  handleCheckInRoutine(todoIndex, index);
                                }}
                                className="h-8 w-8 rounded-full items-center justify-center"
                                style={{
                                  backgroundColor: isCheckedToday
                                    ? routine.color
                                    : currentTheme.card,
                                }}
                              >
                                <Text className="text-white font-bold">✓</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          {todoItem.edited && (
                            <View
                              className="mt-2 flex-row items-center gap-2 p-3 rounded-xl "
                              style={{
                                backgroundColor: currentTheme.border,
                              }}
                            >
                              <TextInput
                                onChangeText={(text) => {
                                  setTodoName(text);
                                }}
                                className="flex-1  text-white placeholder:text-gray-400 rounded-lg px-3 py-2"
                                style={{
                                  backgroundColor: currentTheme.card,
                                }}
                                placeholder="Edit Todo"
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  editRoutine(index, todoIndex, newTodoName);
                                }}
                                className="h-8 w-8 rounded-full items-center justify-center "
                                style={{
                                  backgroundColor: currentTheme.tab,
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="check-circle"
                                  color="white"
                                  size={16}
                                />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <Text className="text-gray-500 italic">
                      No todos for this routine
                    </Text>
                  )}
                </View>
                <View className="px-4 pb-4 flex-row justify-between items-center">
                  <View className="flex-1">
                    <Streak
                      archivated={routine.archivated}
                      addDays={(days) => addDaysRoutine(days, index)}
                      startDate1={routine.startDate}
                      checkedDays={routine.checkedDays}
                      color={routine.color}
                      bgcolor={currentTheme.card}
                      grayColor={currentTheme.border}
                      days={105}
                      textColor="white"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      removeRoutine(index);
                    }}
                    className=" h-8 w-8 rounded-full items-center justify-center shadow-lg ml-4"
                    style={{
                      backgroundColor: currentTheme.border,
                    }}
                  >
                    <Text className="text-white text-sm">✕</Text>
                  </TouchableOpacity>
                </View>

                <Modal
                  animationType="slide"
                  visible={routine.modelOpen}
                  transparent={true}
                >
                  <View className="flex-1 justify-end">
                    <ScrollView
                      scrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                      style={{ maxHeight: "90%" }}
                    >
                      <View
                        className="rounded-t-3xl "
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: -2 },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          backgroundColor: currentTheme.card,
                        }}
                      >
                        <View className="flex-row gap-1 mb-10">
                          <TouchableOpacity
                            onPress={() => {
                              const newRoutines = [...routines];
                              newRoutines[index] = {
                                ...newRoutines[index],
                                modelOpen: false,
                              };
                              setRoutines(newRoutines);
                            }}
                            className="p-2 h-11 w-11 rounded-full items-center justify-center mt-3 ml-3"
                            style={{
                              backgroundColor: currentTheme.border,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="close"
                              size={24}
                              color="#94a3b8"
                            />
                          </TouchableOpacity>
                        </View>

                        <View className="flex-col items-center justify-center mb-10">
                          <View className="flex-row gap-5">
                            <Text className="mb-5 font-bold text-3xl text-white">
                              {routine.name}
                            </Text>

                            <View className="bg-white/20 px-3 py-1 rounded-full h-10">
                              <FlameAnimation
                                flames={routine.streak}
                                color="white"
                              />
                            </View>
                          </View>
                          <Text className="mb-5 text-gray-400 font-bold text-md">
                            Longest Streak:
                            {" " + routine.longestStreak}
                          </Text>
                          <Text className="mb-5 text-gray-400 font-bold text-md">
                            Started on:
                            {routine.startDate &&
                            !isNaN(Date.parse(routine.startDate.toString()))
                              ? "  " +
                                new Date(routine.startDate).toLocaleDateString(
                                  "de-DE"
                                )
                              : "Date not set"}
                          </Text>
                          <Text className="mb-5 text-gray-400 font-bold text-md">
                            Last Checked:
                            {" " + routine.lastCheckedDate}
                          </Text>
                          <View className="flex justify-center items-center">
                            <StreakV2
                              archivated={routine.archivated}
                              addDays={(days) => addDaysRoutine(days, index)}
                              startDate1={routine.startDate}
                              checkedDays={routine.checkedDays}
                              color={routine.color}
                              bgcolor={currentTheme.tab}
                              grayColor={currentTheme.border}
                              textColor="white"
                            />
                          </View>
                          <Text className="mb-5 text-white font-bold text-lg">
                            Selected Days
                          </Text>
                          <View className="flex-row flex-wrap justify-center items-center mb-20 gap-4">
                            {routine.selectedDays.map((day, dayIndex) => (
                              <View key={dayIndex}>
                                <TouchableOpacity
                                  className="h-12 w-12 rounded-full items-center justify-center"
                                  style={{ backgroundColor: routine.color }}
                                >
                                  <Text className="font-bold text-white text-lg">
                                    {day.substring(0, 2).toUpperCase()}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                </Modal>

                {routine.changeIcon && (
                  <View className="flex-col">
                    <ScrollView
                      className="h-72 mb-4 mt-8"
                      scrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                      nestedScrollEnabled={true}
                    >
                      <View className="flex-row flex-wrap justify-between mr-5 ml-5">
                        {items.map((item, itemIndex) => (
                          <TouchableOpacity
                            key={itemIndex}
                            className={`w-[30%] items-center p-3 rounded-lg mb-2 `}
                            style={{
                              backgroundColor:
                                selectedIcon === item.value
                                  ? currentTheme.primary.main
                                  : currentTheme.border,
                            }}
                            onPress={() => setSelectedIcon(item.value)}
                          >
                            <MaterialCommunityIcons
                              name={item.value as any}
                              size={24}
                              color={
                                selectedIcon === item.value
                                  ? "#FFFFFF"
                                  : "#4B5563"
                              }
                            />
                            <Text
                              className={`text-xs mt-1 text-center ${
                                selectedIcon === item.value
                                  ? "text-white"
                                  : "text-gray-600"
                              }`}
                              numberOfLines={1}
                            >
                              {item.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                    <TouchableOpacity
                      onPress={() => {
                        const newRoutines = [...routines];
                        newRoutines[index] = {
                          ...newRoutines[index],
                          changeIcon: false,
                          iconname: selectedIcon,
                        };
                        setRoutines(newRoutines);
                      }}
                      className={`rounded-lg py-3 items-center ${
                        !name || !selectedIcon
                          ? "bg-violet-800"
                          : "bg-violet-600"
                      }`}
                      style={{
                        backgroundColor:
                          !name || !selectedIcon
                            ? currentTheme.border
                            : currentTheme.primary.main,
                      }}
                    >
                      <Text className="text-white font-bold">Speichern</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        <Modal visible={expandRoutine}>
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: currentTheme.card }}
          >
            <ScrollView
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              style={{ maxHeight: "100%" }}
              className="mx-6  "
            >
              <TouchableOpacity
                onPress={() => {
                  setExpandRoutine(false);
                }}
                className="rounded-full items-center justify-center h-12 w-12 mb-10 mt-5"
                style={{ backgroundColor: currentTheme.border }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color={"white"}
                ></MaterialCommunityIcons>
              </TouchableOpacity>

              <Text className="text-3xl font-bold text-white mb-4 text-center">
                Create new Routine
              </Text>
              <TextInput
                className="  border-none rounded-lg px-4 py-3 text-white text-base mb-4"
                style={{ backgroundColor: currentTheme.border }}
                placeholder="Enter name of Routine"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                className=" border-none rounded-lg px-4 py-3 text-white text-base mb-10"
                style={{ backgroundColor: currentTheme.border }}
                placeholder="Enter amount"
                placeholderTextColor="#9CA3AF"
                value={amount}
                onChangeText={setAmount}
              />

              <ScrollView>
                {routineItem.map((item, index) => (
                  <TextInput
                    key={index}
                    className="border-none rounded-lg px-4 py-3 text-white text-base mb-4"
                    style={{ backgroundColor: currentTheme.border }}
                    placeholder="Enter Routine Part"
                    placeholderTextColor="#9CA3AF"
                    value={item.name}
                    onChangeText={(text) =>
                      setRoutItem((prev) =>
                        prev.map((el, i) =>
                          i === index ? { ...el, name: text } : el
                        )
                      )
                    }
                  />
                ))}
                <TouchableOpacity
                  className="h-10 w-10 rounded-full  mx-auto flex justify-center items-center"
                  style={{ backgroundColor: currentTheme.border }}
                  onPress={() =>
                    setRoutItem((prev) => [
                      ...prev,
                      {
                        name: "",
                        lastCheckedDate: "",
                        buttoncolor: "#71717a",
                        edited: false,
                      },
                    ])
                  }
                >
                  <Text className="font-bold text-white text-center text-2xl ">
                    +
                  </Text>
                </TouchableOpacity>
              </ScrollView>
              <View className="mb-6 mt-6">
                <Text
                  className={` font-bold text-lg mb-3 
                             text-white
                          }`}
                >
                  Select a Category
                </Text>

                <FlatList
                  data={GroupCategories}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{}}
                />
              </View>
              <Text className="text-white font-medium mb-5">
                Select Weekdays
              </Text>
              <View className="flex-row flex-wrap gap-4 mb-5">
                {weekdays.map((weekday, index) => {
                  const isSelected = selectedDays.includes(weekday.value);

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setSelectedDays((prev) => {
                          if (prev.includes(weekday.value)) {
                            return prev.filter((day) => day !== weekday.value);
                          } else {
                            return [...prev, weekday.value];
                          }
                        });
                      }}
                      className={`rounded-full h-12 w-12 items-center justify-center ${
                        isSelected ? "bg-violet-600" : "bg-slate-800"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? currentTheme.primary.main
                          : currentTheme.border,
                      }}
                    >
                      <Text className="text-gray-400 font-bold">
                        {weekday.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <ScrollView
                className="h-72 mb-4 mt-8"
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View className="flex-row flex-wrap justify-between">
                  {items.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`w-[31%] items-center p-3 rounded-lg mb-2 `}
                      style={{
                        backgroundColor:
                          selectedIcon === item.value
                            ? currentTheme.primary.main
                            : currentTheme.border,
                      }}
                      onPress={() => setSelectedIcon(item.value)}
                    >
                      <MaterialCommunityIcons
                        name={item.value as any}
                        size={24}
                        color={
                          selectedIcon === item.value ? "#FFFFFF" : "#4B5563"
                        }
                      />
                      <Text
                        className={`text-xs mt-1 text-center ${
                          selectedIcon === item.value
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                className={`rounded-lg py-3 items-center mb-3 ${
                  !name || !selectedIcon ? "bg-violet-800" : "bg-violet-600"
                }`}
                style={{
                  backgroundColor:
                    !name || !selectedIcon
                      ? currentTheme.border
                      : currentTheme.primary.main,
                }}
                disabled={!name || !selectedIcon}
                onPress={() => {
                  addNewRoutine(
                    name,
                    selectedIcon,
                    Number.parseInt(amount),
                    selectedDays
                  );
                  setName("");
                  setSelectedIcon("");
                  setRoutItem([]);
                }}
              >
                <Text className="text-white font-bold text-base ">
                  Add Routine
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
        <Modal visible={expand}>
          <View
            className="flex-1 justify-end"
            style={{ backgroundColor: currentTheme.card }}
          >
            <ScrollView
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              style={{ maxHeight: "100%" }}
              className="mx-6  "
            >
              <TouchableOpacity
                onPress={() => {
                  setExpand(false);
                }}
                className="rounded-full items-center justify-center h-12 w-12 mb-10 mt-5"
                style={{ backgroundColor: currentTheme.border }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={23}
                  color={"white"}
                ></MaterialCommunityIcons>
              </TouchableOpacity>
              <Text className="text-3xl font-bold text-white mb-5 text-center ">
                Create New Habit
              </Text>

              <TextInput
                className=" border-none rounded-lg px-4 py-3 text-white text-base mb-4"
                style={{ backgroundColor: currentTheme.border }}
                placeholder="Enter name of Habit"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                className="  border-none rounded-lg px-4 py-3 text-white text-base mb-4"
                style={{ backgroundColor: currentTheme.border }}
                placeholder="Enter amount of Habit"
                placeholderTextColor="#9CA3AF"
                value={amount}
                onChangeText={setAmount}
              />
              <View className="mb-6 mt-6">
                <Text
                  className={` font-bold text-lg mb-3 
                             text-white
                          }`}
                >
                  Select a Category
                </Text>

                <FlatList
                  data={GroupCategories}
                  renderItem={renderCategoryItem}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{}}
                />
              </View>

              <Text className="text-white font-medium mb-3">
                Choose an icon
              </Text>

              {selectedIcon && (
                <View
                  className="flex-row items-center  p-3 rounded-lg mb-4"
                  style={{ backgroundColor: currentTheme.border }}
                >
                  <MaterialCommunityIcons
                    name={selectedIcon as any}
                    size={28}
                    color="#374151"
                  />
                  <Text className="ml-3 text-white font-medium">
                    {items.find((item) => item.value === selectedIcon)?.label}
                  </Text>
                </View>
              )}
              <Text className="text-white font-medium mb-5">
                Select Weekdays
              </Text>
              <View className="flex-row flex-wrap  gap-4 mb-5">
                {weekdays.map((weekday, index) => {
                  const isSelected = selectedDays.includes(weekday.value);

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setSelectedDays((prev) => {
                          if (prev.includes(weekday.value)) {
                            return prev.filter((day) => day !== weekday.value);
                          } else {
                            return [...prev, weekday.value];
                          }
                        });
                      }}
                      className={`rounded-full h-12 w-12 items-center justify-center ${
                        isSelected ? "bg-violet-600" : "bg-slate-800"
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? currentTheme.primary.main
                          : currentTheme.border,
                      }}
                    >
                      <Text className="text-gray-400 font-bold">
                        {weekday.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <ScrollView
                className="h-72 mb-4 mt-8"
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                <View className="flex-row flex-wrap justify-between">
                  {items.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`w-[31%] items-center p-3 rounded-lg mb-2 `}
                      style={{
                        backgroundColor:
                          selectedIcon === item.value
                            ? currentTheme.primary.main
                            : currentTheme.border,
                      }}
                      onPress={() => setSelectedIcon(item.value)}
                    >
                      <MaterialCommunityIcons
                        name={item.value as any}
                        size={24}
                        color={
                          selectedIcon === item.value ? "#FFFFFF" : "#4B5563"
                        }
                      />
                      <Text
                        className={`text-xs mt-1 text-center ${
                          selectedIcon === item.value
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <TouchableOpacity
                className={`rounded-lg py-3 mb-5 items-center ${
                  !name || !selectedIcon ? "bg-violet-800" : "bg-violet-600"
                }`}
                style={{
                  backgroundColor:
                    !name || !selectedIcon
                      ? currentTheme.border
                      : currentTheme.primary.main,
                }}
                disabled={!name || !selectedIcon}
                onPress={() => {
                  addNewHabit(
                    name,
                    selectedIcon,
                    Number.parseInt(amount),
                    selectedDays
                  );
                  setAmount("1");
                  setName("");
                  setSelectedIcon("");
                }}
              >
                <Text className="text-white font-bold text-base">
                  Add Habit
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 100, // Abstand vom unteren Rand
          right: 24, // Abstand vom rechten Rand
          zIndex: 100,
        }}
      >
        {activeTab == "habits" ? (
          <TouchableOpacity
            onPress={() => {
              setExpand(true);
              setName("");
              setSelectedCategory("");
              setAmount("");
              setSelectedDays([]);
            }}
            className="rounded-full w-16 h-16 items-center justify-center shadow-lg"
            style={{ backgroundColor: currentTheme.primary.main }}
          >
            <Text className="font-bold text-3xl text-white">+</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setExpandRoutine(!expandRoutine);
              setName("");
              setSelectedCategory("");
              setAmount("");
              setSelectedDays([]);
            }}
            className="rounded-full w-16 h-16 items-center justify-center shadow-lg"
            style={{ backgroundColor: currentTheme.primary.main }}
          >
            <Text className="font-bold text-3xl text-white">+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
