import routines from "@/components/Routines";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { vars } from "nativewind";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
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

interface Todo {
  name: string;
  lastCheckedDate?: string;
  buttoncolor: string;
}

interface Day {
  status: boolean;
  date: Date;
}

interface Routine {
  name: string;
  streak: number;
  color: string;
  lastCheckedDate?: string;
  checkedDays: Day[];
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
  category?: string;
}

export default function ExploreScreen() {
  const RoutineCard = memo(
    ({
      routine,
      index,
      isAdded,
      isDarkMode,
      isLoading,
      onAddRoutine,
      onOpenModal,
    }: {
      routine: Routine;
      index: number;
      isAdded: boolean;
      isDarkMode: boolean;
      isLoading: boolean;
      onAddRoutine: (routine: Routine) => void;
      onOpenModal: (routine: Routine) => void;
    }) => {
      const categoryInfo = useMemo(
        () => categories.find((c) => c.name === routine.category),
        [routine.category]
      );

      const addPrebuildRoutine = useCallback(() => {
        if (!isAdded) {
          onAddRoutine(routine);
        }
      }, [isAdded, onAddRoutine, routine]);

      const handleOpenModal = useCallback(() => {
        onOpenModal(routine);
      }, [onOpenModal, routine]);

      const buttonStyle = useMemo(() => {
        return isAdded ? primaryBgColor : bgColor;
      }, [isAdded]);

      const textStyle = useMemo(() => {
        const getTextColor = (isDark: boolean, isAdded: boolean) => {
          if (isDark) {
            return isAdded ? "text-gray-600" : "text-white";
          }
          return isAdded ? "text-gray-200" : "text-white";
        };
        return getTextColor(isDarkMode, isAdded);
      }, [isDarkMode, isAdded]);

      const visibleTodos = useMemo(
        () => routine.todos.slice(0, 5),
        [routine.todos]
      );

      return (
        <View
          className={`mb-5 rounded-xl overflow-hidden shadow-sm ${cardBgColor}  ${borderColor}`}
          style={{
            shadowColor: isDarkMode ? "#000" : "#718096",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: isDarkMode ? 0.3 : 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <TouchableOpacity
            className="p-4 border-b border-opacity-10 border-gray-400"
            onPress={handleOpenModal}
          >
            <View className="flex-row items-center gap-3">
              <View
                className={`w-12 h-12 rounded-full justify-center items-center ${bgColor}`}
              >
                <MaterialCommunityIcons
                  name={routine.iconname as any}
                  size={24}
                  color={routine.color}
                />
              </View>
              <View className="flex-1">
                <Text className={`font-bold ${textColor} text-lg`}>
                  {routine.name}
                </Text>
                <View className="flex-row items-center">
                  <Text className={`${textMutedColor} text-sm`}>
                    {routine.todos.length}{" "}
                    {routine.todos.length === 1 ? "task" : "tasks"} • Daily
                    routine
                  </Text>
                  {categoryInfo && (
                    <View
                      className={`flex-row items-center ml-2 px-2 py-0.5 rounded-full bg-opacity-20 ${bgColor} `}
                    >
                      <MaterialCommunityIcons
                        name={categoryInfo.icon as any}
                        size={12}
                        color={isDarkMode ? "#60a5fa" : "#3b82f6"}
                      />
                      <Text className={`ml-1 text-xs ${textMutedColor}`}>
                        {categoryInfo.name}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <View className="px-4">
            {visibleTodos.map((todo, todoIndex) => (
              <View
                key={todoIndex}
                className={`flex-row items-center py-3.5 ${
                  todoIndex < Math.min(4, routine.todos.length - 1)
                    ? `border-b ${borderColor}`
                    : ""
                }`}
              >
                <View
                  className={`h-7 w-7 rounded-full items-center justify-center mr-3 ${bgColor}`}
                >
                  <MaterialCommunityIcons
                    name="check"
                    color={routine.color}
                    size={16}
                  />
                </View>
                <Text
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } text-base flex-1`}
                >
                  {todo.name}
                </Text>
              </View>
            ))}

            {routine.todos.length > 5 && (
              <TouchableOpacity
                className="py-3 items-center"
                onPress={handleOpenModal}
              >
                <View className="flex-row items-center">
                  <Text className={`text-sm font-medium ${textMutedColor}`}>
                    See all {routine.todos.length} tasks
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={18}
                    color={isDarkMode ? "#60a5fa" : "#3b82f6"}
                    style={{ marginLeft: 4 }}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View className="px-4 py-4">
            <TouchableOpacity
              onPress={addPrebuildRoutine}
              disabled={isAdded || isLoading}
              className={`py-3 rounded-lg justify-center items-center ${buttonStyle}`}
            >
              {isLoading ? (
                <ActivityIndicator color={routine.color} size="small" />
              ) : (
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name={isAdded ? "check" : "plus"}
                    color={routine.color}
                    size={18}
                    style={{ marginRight: 6 }}
                  />
                  <Text className={`font-semibold text-base ${textStyle}`}>
                    {isAdded ? "Added to My Routines" : "Add to My Routines"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.routine.name === nextProps.routine.name &&
        prevProps.isAdded === nextProps.isAdded &&
        prevProps.isDarkMode === nextProps.isDarkMode &&
        prevProps.isLoading === nextProps.isLoading
      );
    }
  );
  const [colorScheme, setcolorScheme] = useState<string>("dark");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addedRoutineNames, setAddedRoutineNames] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedRoutineIndex, setExpandedRoutineIndex] = useState<
    number | null
  >(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const isDarkMode = colorScheme === "dark";

  const filteredRoutines = useMemo(() => {
    return routines.filter((routine) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "" || routine.category === selectedCategory;

      // Search filter
      const matchesSearch =
        searchQuery.trim() === "" ||
        routine.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const colorSchemeee = await AsyncStorage.getItem("color");
          if (colorSchemeee) {
            setcolorScheme(JSON.parse(colorSchemeee));
          }

          setSearchQuery("");
          setSelectedCategory("");

          const routinesString = await AsyncStorage.getItem("routines");
          const userRoutines = routinesString ? JSON.parse(routinesString) : [];

          const addedNames = userRoutines.map((r: Routine) => r.name);
          setAddedRoutineNames(addedNames);
        } catch (e) {
          console.error("Failed to load data", e);
        }
      };
      loadData();
    }, [])
  );

  const addPrebuildRoutine = async (routine: Routine) => {
    try {
      setIsLoading(true);
      const routinesString = await AsyncStorage.getItem("routines");
      const userRoutines = routinesString ? JSON.parse(routinesString) : [];

      const exists = userRoutines.some((r: Routine) => r.name === routine.name);

      if (!exists) {
        userRoutines.push(routine);
        await AsyncStorage.setItem("routines", JSON.stringify(userRoutines));
        setAddedRoutineNames([...addedRoutineNames, routine.name]);
      }
    } catch (error) {
      console.log("Error adding routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryFilter = (categoryName: string) => {
    if (categoryName === selectedCategory) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(categoryName);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleOpenModal = useCallback((routine: Routine) => {
    setSelectedRoutine(routine);
    setModalVisible(true);
  }, []);
  const clearCategory = () => {
    setSelectedCategory("");
  };

  const getBackgroundColor = (isDark: boolean, isAdded: boolean) => {
    if (isDark) {
      return isAdded ? "bg-violet-800" : "bg-violet-600";
    }
    return isAdded ? "bg-violet-700" : "bg-violet-600";
  };

  const getTextColor = (isDark: boolean, isAdded: boolean) => {
    if (isDark) {
      return isAdded ? "text-gray-600" : "text-white";
    }
    return isAdded ? "text-gray-200" : "text-white";
  };

  const openRoutineModal = (routine: Routine) => {
    setSelectedRoutine(routine);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRoutine(null);
  };

  const renderCategoryItem = useCallback(
    ({ item }: { item: (typeof categories)[0] }) => {
      const isSelected = selectedCategory === item.name;

      return (
        <TouchableOpacity
          className={`
    mr-3 px-4 py-2.5 rounded-full flex-row items-center
    ${cardBgColor} ${borderColor}
  `}
          onPress={() => handleCategoryFilter(item.name)}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={18}
            color={
              isSelected
                ? isDarkMode
                  ? "#60a5fa"
                  : "#3b82f6"
                : isDarkMode
                ? "#94a3b8"
                : "#64748b"
            }
          />
          <Text
            className={`ml-2 font-medium ${
              isSelected
                ? isDarkMode
                  ? "text-blue-400"
                  : "text-blue-600"
                : isDarkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedCategory, isDarkMode, handleCategoryFilter]
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
        text: colorScheme === "dark" ? "#c4b5fd" : "#7c3aed", // violet-400 : violet-600
        bg: colorScheme === "dark" ? "1f2937" : "#f5f3ff", // violet-950 : violet-50
      },
      bg: colorScheme === "dark" ? "#030712" : "#f9fafb", // gray-950 : gray-50
      card: colorScheme === "dark" ? "#111827" : "#ffffff", // gray-900 : white
      text: colorScheme === "dark" ? "#ffffff" : "#1f2937", // white : gray-800
      textMuted: colorScheme === "dark" ? "#9ca3af" : "#6b7280", // gray-400 : gray-500
      border: colorScheme === "dark" ? "#1f2937" : "#e5e7eb", // gray-800 : gray-200
      tab: colorScheme === "dark" ? "#1f2937" : "#e5e7eb", // gray-800 : gray-200
    },
    ocean: {
      primary: {
        main: "#2563eb", // blue-600
        light: "#3b82f6", // blue-500
        dark: "#1d4ed8", // blue-700
        text: colorScheme === "dark" ? "#60a5fa" : "#2563eb", // blue-400 : blue-600
        bg: colorScheme === "dark" ? "#0c0a09" : "#eff6ff", // blue-950 : blue-50
      },
      bg: colorScheme === "dark" ? "#020617" : "#f8fafc", // slate-950 : slate-50
      card: colorScheme === "dark" ? "#0f172a" : "#ffffff", // slate-900 : white
      text: colorScheme === "dark" ? "#ffffff" : "#1e293b", // white : slate-800
      textMuted: colorScheme === "dark" ? "#94a3b8" : "#64748b", // slate-400 : slate-500
      border: colorScheme === "dark" ? "#1e293b" : "#e2e8f0", // slate-800 : slate-200
      tab: colorScheme === "dark" ? "#1e293b" : "#e2e8f0", // slate-800 : slate-200
    },
    forest: {
      primary: {
        main: "#059669", // emerald-600
        light: "#10b981", // emerald-500
        dark: "#047857", // emerald-700
        text: colorScheme === "dark" ? "#34d399" : "#059669", // emerald-400 : emerald-600
        bg: colorScheme === "dark" ? "#022c22" : "#ecfdf5", // emerald-950 : emerald-50
      },
      bg: colorScheme === "dark" ? "#022c22" : "#ecfdf5", // emerald-950 : emerald-50
      card: colorScheme === "dark" ? "#064e3b" : "#ffffff", // emerald-900 : white
      text: colorScheme === "dark" ? "#ffffff" : "#064e3b", // white : emerald-800
      textMuted: colorScheme === "dark" ? "#34d399" : "#059669", // emerald-400 : emerald-500
      border: colorScheme === "dark" ? "#064e3b" : "#a7f3d0", // emerald-800 : emerald-200
      tab: colorScheme === "dark" ? "#064e3b" : "#a7f3d0", // emerald-800 : emerald-200
    },
    sunset: {
      primary: {
        main: "#ea580c", // orange-600
        light: "#f97316", // orange-500
        dark: "#c2410c", // orange-700
        text: colorScheme === "dark" ? "#fb923c" : "#ea580c", // orange-400 : orange-600
        bg: colorScheme === "dark" ? "#431407" : "#fff7ed", // orange-950 : orange-50
      },
      bg: colorScheme === "dark" ? "#431407" : "#fff7ed", // orange-950 : orange-50
      card: colorScheme === "dark" ? "#7c2d12" : "#ffffff", // orange-900 : white
      text: colorScheme === "dark" ? "#ffffff" : "#9a3412", // white : orange-800
      textMuted: colorScheme === "dark" ? "#fb923c" : "#fb923c", // orange-400 : orange-500
      border: colorScheme === "dark" ? "#9a3412" : "#fed7aa", // orange-800 : orange-200
      tab: colorScheme === "dark" ? "#9a3412" : "#fed7aa", // orange-800 : orange-200
    },
    berry: {
      primary: {
        main: "#c026d3", // fuchsia-600
        light: "#d946ef", // fuchsia-500
        dark: "#a21caf", // fuchsia-700
        text: colorScheme === "dark" ? "#f0abfc" : "#c026d3", // fuchsia-400 : fuchsia-600
        bg: colorScheme === "dark" ? "#4a044e" : "#fdf4ff", // fuchsia-950 : fuchsia-50
      },
      bg: colorScheme === "dark" ? "#4a044e" : "#fdf4ff", // fuchsia-950 : fuchsia-50
      card: colorScheme === "dark" ? "#86198f" : "#ffffff", // fuchsia-900 : white
      text: colorScheme === "dark" ? "#ffffff" : "#701a75", // white : fuchsia-800
      textMuted: colorScheme === "dark" ? "#f0abfc" : "#f0abfc", // fuchsia-400 : fuchsia-500
      border: colorScheme === "dark" ? "#701a75" : "#fae8ff", // fuchsia-800 : fuchsia-200
      tab: colorScheme === "dark" ? "#701a75" : "#fae8ff", // fuchsia-800 : fuchsia-200
    },
    monochrome: {
      primary: {
        main: "#525252", // neutral-600
        light: "#737373", // neutral-500
        dark: "#404040", // neutral-700
        text: colorScheme === "dark" ? "#A3A3A3" : "#525252", // neutral-400 : neutral-600
        bg: colorScheme === "dark" ? "#0A0A0A" : "#FAFAFA", // neutral-950 : neutral-50
      },
      bg: colorScheme === "dark" ? "#0A0A0A" : "#FAFAFA", // neutral-950 : neutral-50
      card: colorScheme === "dark" ? "#171717" : "#FFFFFF", // neutral-900 : white
      text: colorScheme === "dark" ? "#FFFFFF" : "#262626", // white : neutral-800
      textMuted: colorScheme === "dark" ? "#A3A3A3" : "#737373", // neutral-400 : neutral-500
      border: colorScheme === "dark" ? "#262626" : "#E5E5E5", // neutral-800 : neutral-200
      tab: colorScheme === "dark" ? "#262626" : "#E5E5E5", // neutral-800 : neutral-200
    },
  };
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
  const primaryBgColor = "bg-[var(--primary-color)]";
  const secondaryBgColor = "bg-[var(--primary-color)]";

  const iconColor = "--text-color";
  const inputBgColor = "bg-[var(--tab-color)]";

  return (
    <View className={`flex-1 ${bgColor}`} style={themeVars}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 mt-12 py-8 pb-6">
          <Text className={`font-bold text-4xl ${textColor} mb-2`}>
            Explore
          </Text>
          <Text
            className={`font-medium text-base 
              ${textMutedColor}
            `}
          >
            Discover routines that transform your daily life
          </Text>

          <View
            className={`flex-row items-center rounded-full mt-6 px-4 ${cardBgColor}  ${borderColor}`}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color={isDarkMode ? "#94a3b8" : "#3b82f6"}
              className="mr-2"
            />
            <TextInput
              value={searchQuery}
              className={`flex-1 py-3.5 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
              onChangeText={handleSearch}
              placeholder="Search for routines"
              placeholderTextColor={isDarkMode ? "#94a3b8" : "#94a3b8"}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={clearSearch}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color={isDarkMode ? "#94a3b8" : "#3b82f6"}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View className="mb-6">
          <Text className={`px-6 font-bold text-lg mb-3 ${textColor}`}>
            Categories
          </Text>

          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 16 }}
          />
        </View>

        <View className="pb-10 px-5">
          {(selectedCategory || searchQuery) && (
            <View className="flex-row items-center mb-4 flex-wrap">
              <Text
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Showing:
              </Text>

              {selectedCategory && (
                <View className="flex-row items-center ml-2 mb-1">
                  <View className={`px-3 py-1 rounded-full ${cardBgColor}`}>
                    <Text
                      className={`${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {selectedCategory}
                    </Text>
                  </View>
                  <TouchableOpacity className="ml-2" onPress={clearCategory}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={18}
                      color={isDarkMode ? "#94a3b8" : "#3b82f6"}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {searchQuery && (
                <View className="flex-row items-center ml-2 mb-1">
                  <View
                    className={`px-3 py-1 rounded-full ${
                      isDarkMode ? "bg-gray-900" : "bg-green-50"
                    }`}
                  >
                    <Text
                      className={`${
                        isDarkMode ? "text-green-400" : "text-green-600"
                      }`}
                    >
                      "{searchQuery}"
                    </Text>
                  </View>
                  <TouchableOpacity className="ml-2" onPress={clearSearch}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={18}
                      color={isDarkMode ? "#94a3b8" : "#3b82f6"}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {filteredRoutines.length === 0 ? (
            <View className="items-center justify-center py-10">
              <MaterialCommunityIcons
                name="magnify-close"
                size={50}
                color={isDarkMode ? "#475569" : "#93c5fd"}
              />
              <Text
                className={`mt-4 text-center ${
                  isDarkMode ? "text-gray-600" : "text-gray-500"
                }`}
              >
                No routines found
                {searchQuery && selectedCategory
                  ? ` for "${searchQuery}" in ${selectedCategory}`
                  : searchQuery
                  ? ` for "${searchQuery}"`
                  : selectedCategory
                  ? ` in ${selectedCategory}`
                  : ""}
              </Text>
            </View>
          ) : (
            filteredRoutines.map((routine, index) => {
              const isAdded = addedRoutineNames.includes(routine.name);

              return (
                <RoutineCard
                  key={routine.name}
                  routine={routine}
                  index={index}
                  isAdded={isAdded}
                  isDarkMode={isDarkMode}
                  isLoading={isLoading}
                  onAddRoutine={addPrebuildRoutine}
                  onOpenModal={handleOpenModal}
                />
              );
            })
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end">
          <View
            className={`rounded-t-3xl ${bgColor}`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              maxHeight: "80%",
            }}
          >
            <View className="flex-row justify-between items-center p-5 border-b border-opacity-10 border-gray-400">
              <TouchableOpacity onPress={closeModal} className="p-2">
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={isDarkMode ? "#94a3b8" : "#64748b"}
                />
              </TouchableOpacity>

              <Text className={`font-bold text-xl ${textColor}`}>
                Routine Details
              </Text>

              <View style={{ width: 40 }} />
            </View>

            {selectedRoutine && (
              <ScrollView className="p-5">
                <View className="flex-row items-center mb-6">
                  <View
                    className={`w-14 h-14 rounded-full justify-center items-center ${cardBgColor}`}
                  >
                    <MaterialCommunityIcons
                      name={selectedRoutine.iconname as any}
                      size={28}
                      color={selectedRoutine.color}
                    />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className={`font-bold text-2xl ${textColor}`}>
                      {selectedRoutine.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className={`${textMutedColor}`}>
                        {selectedRoutine.todos.length}{" "}
                        {selectedRoutine.todos.length === 1 ? "task" : "tasks"}{" "}
                        • Daily routine
                      </Text>
                      {selectedRoutine.category && (
                        <View
                          className={`flex-row items-center ml-2 px-2 py-0.5 rounded-full bg-opacity-20 ${cardBgColor}`}
                        >
                          <MaterialCommunityIcons
                            name={
                              categories.find(
                                (c) => c.name === selectedRoutine.category
                              )?.icon as any
                            }
                            size={12}
                            color={isDarkMode ? "#60a5fa" : "#3b82f6"}
                          />
                          <Text className={`ml-1 text-xs ${textMutedColor}`}>
                            {
                              categories.find(
                                (c) => c.name === selectedRoutine.category
                              )?.name
                            }
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <Text className={`font-bold text-lg mb-3 ${textColor}`}>
                  All Tasks
                </Text>

                <View
                  className={`rounded-xl overflow-hidden border ${borderColor}`}
                >
                  {selectedRoutine.todos.map((todo, todoIndex) => (
                    <View
                      key={todoIndex}
                      className={`flex-row items-center p-4 ${
                        todoIndex !== selectedRoutine.todos.length - 1
                          ? `border-b ${borderColor}`
                          : ""
                      }`}
                    >
                      <View
                        className={`h-8 w-8 rounded-full items-center justify-center mr-3 ${cardBgColor}`}
                      >
                        <MaterialCommunityIcons
                          name="check"
                          color={selectedRoutine.color}
                          size={18}
                        />
                      </View>
                      <Text className={`${textColor} text-base flex-1`}>
                        {todo.name}
                      </Text>
                    </View>
                  ))}
                </View>

                <View className="mt-6 mb-10">
                  <TouchableOpacity
                    onPress={() => {
                      if (!addedRoutineNames.includes(selectedRoutine.name)) {
                        addPrebuildRoutine(selectedRoutine);
                      }
                      closeModal();
                    }}
                    disabled={
                      addedRoutineNames.includes(selectedRoutine.name) ||
                      isLoading
                    }
                    className={`py-3.5 rounded-lg justify-center items-center ${
                      addedRoutineNames.includes(selectedRoutine.name)
                        ? primaryBgColor
                        : cardBgColor
                    }`}
                  >
                    {isLoading ? (
                      <ActivityIndicator
                        color={selectedRoutine.color}
                        size="small"
                      />
                    ) : (
                      <View className="flex-row items-center">
                        <MaterialCommunityIcons
                          name={
                            addedRoutineNames.includes(selectedRoutine.name)
                              ? "check"
                              : "plus"
                          }
                          color={selectedRoutine.color}
                          size={18}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          className={`font-semibold text-base ${
                            addedRoutineNames.includes(selectedRoutine.name)
                              ? isDarkMode
                                ? "text-gray-600"
                                : "text-gray-200"
                              : isDarkMode
                              ? "text-white"
                              : "text-white"
                          }`}
                        >
                          {addedRoutineNames.includes(selectedRoutine.name)
                            ? "Added to My Routines"
                            : "Add to My Routines"}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
