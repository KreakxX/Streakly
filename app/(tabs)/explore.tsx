import routines from "@/components/Routines";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
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
  const [colorScheme, setColorScheme] = useState<string>("dark");
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

  // Memoized filtered routines - this is the key fix
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
          const colorScheme = await AsyncStorage.getItem("color");
          if (colorScheme) {
            setColorScheme(JSON.parse(colorScheme));
          }

          // Reset filters when screen is focused
          setSearchQuery("");
          setSelectedCategory("");

          const routinesString = await AsyncStorage.getItem("routines");
          const userRoutines = routinesString ? JSON.parse(routinesString) : [];

          // Store routine names instead of indices
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

  const renderCategoryItem = ({ item }: { item: (typeof categories)[0] }) => {
    const isSelected = selectedCategory === item.name;

    return (
      <TouchableOpacity
        className={`mr-3 px-4 py-2.5 rounded-full flex-row items-center ${
          isSelected
            ? isDarkMode
              ? "bg-slate-700"
              : "bg-blue-100"
            : isDarkMode
            ? "bg-gray-900"
            : "bg-white"
        } border ${
          isSelected
            ? isDarkMode
              ? "border-slate-600"
              : "border-blue-200"
            : isDarkMode
            ? "border-slate-700"
            : "border-gray-200"
        }`}
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
  };

  const openRoutineModal = (routine: Routine) => {
    setSelectedRoutine(routine);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRoutine(null);
  };

  return (
    <View className={isDarkMode ? "bg-slate-950 flex-1" : "bg-gray-50 flex-1"}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 mt-12 py-8 pb-6">
          <Text
            className={`font-bold text-4xl ${
              isDarkMode ? "text-white" : "text-gray-800"
            } mb-2`}
          >
            Explore
          </Text>
          <Text
            className={`font-medium text-base ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Discover habits that transform your daily life
          </Text>

          <View
            className={`flex-row items-center rounded-full mt-6 px-4 ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            } border ${isDarkMode ? "border-slate-700" : "border-gray-200"}`}
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
          <Text
            className={`px-6 font-bold text-lg mb-3 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
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
                  <View
                    className={`px-3 py-1 rounded-full ${
                      isDarkMode ? "bg-gray-900" : "bg-blue-50"
                    }`}
                  >
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
              const categoryInfo = categories.find(
                (c) => c.name === routine.category
              );
              const isExpanded = expandedRoutineIndex === index;

              return (
                <View
                  key={`${routine.name}-${index}`}
                  className={`mb-5 rounded-xl overflow-hidden shadow-sm ${
                    isDarkMode ? "bg-gray-900" : "bg-white"
                  } border ${
                    isDarkMode ? "border-gray-800" : "border-gray-100"
                  }`}
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
                    onPress={() => openRoutineModal(routine)}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`w-12 h-12 rounded-full justify-center items-center ${
                          isDarkMode ? "bg-gray-800" : "bg-blue-50"
                        }`}
                      >
                        <MaterialCommunityIcons
                          name={routine.iconname as any}
                          size={24}
                          color={routine.color}
                        />
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`font-bold ${
                            isDarkMode ? "text-white" : "text-gray-800"
                          } text-lg`}
                        >
                          {routine.name}
                        </Text>
                        <View className="flex-row items-center">
                          <Text
                            className={`${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            } text-sm`}
                          >
                            {routine.todos.length}{" "}
                            {routine.todos.length === 1 ? "task" : "tasks"} •
                            Daily routine
                          </Text>
                          {categoryInfo && (
                            <View
                              className="flex-row items-center ml-2 px-2 py-0.5 rounded-full bg-opacity-20"
                              style={{
                                backgroundColor: isDarkMode
                                  ? "#1e293b"
                                  : "#eff6ff",
                              }}
                            >
                              <MaterialCommunityIcons
                                name={categoryInfo.icon as any}
                                size={12}
                                color={isDarkMode ? "#60a5fa" : "#3b82f6"}
                              />
                              <Text
                                className={`ml-1 text-xs ${
                                  isDarkMode ? "text-blue-400" : "text-blue-600"
                                }`}
                              >
                                {categoryInfo.name}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View className="px-4">
                    {routine.todos.slice(0, 5).map((todo, todoIndex) => (
                      <View
                        key={todoIndex}
                        className={`flex-row items-center py-3.5 ${
                          todoIndex < Math.min(4, routine.todos.length - 1)
                            ? `border-b ${
                                isDarkMode
                                  ? "border-gray-800"
                                  : "border-gray-100"
                              }`
                            : ""
                        }`}
                      >
                        <View
                          className={`h-7 w-7 rounded-full items-center justify-center mr-3 ${
                            isDarkMode ? "bg-gray-800" : "bg-blue-50"
                          }`}
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
                        onPress={() => openRoutineModal(routine)}
                      >
                        <View className="flex-row items-center">
                          <Text
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
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
                      onPress={() => !isAdded && addPrebuildRoutine(routine)}
                      disabled={isAdded || isLoading}
                      className={`py-3 rounded-lg justify-center items-center ${getBackgroundColor(
                        isDarkMode,
                        isAdded
                      )}`}
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
                          <Text
                            className={`font-semibold text-base ${getTextColor(
                              isDarkMode,
                              isAdded
                            )}`}
                          >
                            {isAdded
                              ? "Added to My Routines"
                              : "Add to My Routines"}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
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
            className={`rounded-t-3xl ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
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

              <Text
                className={`font-bold text-xl ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Routine Details
              </Text>

              <View style={{ width: 40 }} />
            </View>

            {selectedRoutine && (
              <ScrollView className="p-5">
                <View className="flex-row items-center mb-6">
                  <View
                    className={`w-14 h-14 rounded-full justify-center items-center ${
                      isDarkMode ? "bg-gray-800" : "bg-blue-50"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name={selectedRoutine.iconname as any}
                      size={28}
                      color={selectedRoutine.color}
                    />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text
                      className={`font-bold text-2xl ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {selectedRoutine.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Text
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {selectedRoutine.todos.length}{" "}
                        {selectedRoutine.todos.length === 1 ? "task" : "tasks"}{" "}
                        • Daily routine
                      </Text>
                      {selectedRoutine.category && (
                        <View
                          className="flex-row items-center ml-2 px-2 py-0.5 rounded-full bg-opacity-20"
                          style={{
                            backgroundColor: isDarkMode ? "#1e293b" : "#eff6ff",
                          }}
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
                          <Text
                            className={`ml-1 text-xs ${
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                          >
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

                <Text
                  className={`font-bold text-lg mb-3 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  All Tasks
                </Text>

                <View
                  className={`rounded-xl overflow-hidden border ${
                    isDarkMode ? "border-gray-800" : "border-gray-200"
                  }`}
                >
                  {selectedRoutine.todos.map((todo, todoIndex) => (
                    <View
                      key={todoIndex}
                      className={`flex-row items-center p-4 ${
                        todoIndex !== selectedRoutine.todos.length - 1
                          ? `border-b ${
                              isDarkMode ? "border-gray-800" : "border-gray-100"
                            }`
                          : ""
                      }`}
                    >
                      <View
                        className={`h-8 w-8 rounded-full items-center justify-center mr-3 ${
                          isDarkMode ? "bg-gray-800" : "bg-blue-50"
                        }`}
                      >
                        <MaterialCommunityIcons
                          name="check"
                          color={selectedRoutine.color}
                          size={18}
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
                        ? isDarkMode
                          ? "bg-violet-800"
                          : "bg-violet-800"
                        : isDarkMode
                        ? "bg-violet-600"
                        : "bg-violet-600"
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
