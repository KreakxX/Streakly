import PaywallModal from "@/components/ui/paywall";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { vars } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CryptoJS from "react-native-crypto-js";

export default function Tab() {
  const [githubUsername, setGithubUsername] = useState("");
  const [colorScheme, setColorScheme] = useState<string>("dark");
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [isEnabledArchive, setIsEnableArchive] = useState<boolean>(false);
  const [isEnabledArchive2, setisEnableArchive2] = useState<boolean>(false);
  const [gitc, setgitc] = useState<number>(-1);
  const [radarDataall, setRadarDataall] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [paywallvisible, setPaywallvisible] = useState<boolean>(false);
  const handleSelectionChange = async (index: number) => {
    setSelectedIndex(index);
    try {
      const categories = await AsyncStorage.getItem("categories");
      if (categories) {
        const categoriesArray = JSON.parse(categories);
        for (let i = 0; i < categoriesArray.length; i++) {
          categoriesArray[i].github = false;
        }
        if (categoriesArray[index]) {
          categoriesArray[index].github = true;
        }
        await AsyncStorage.setItem(
          "categories",
          JSON.stringify(categoriesArray)
        );
      }
    } catch {}
  };

  const sendEmail = () => {
    const to = "Henrik.standke@web.de";
    const subject = "Loop Feedback";
    const url = `mailto:${to}?subject=${encodeURIComponent(subject)}`;

    Linking.openURL(url).catch((err) => {
      console.error(err);
    });
  };

  useFocusEffect(
    useCallback(() => {
      const radarchart2 = async () => {
        try {
          const categories = await AsyncStorage.getItem("categories");
          if (categories) {
            const categoriesArray = JSON.parse(categories);
            const categoryNames: string[] = [];
            let githubIndex = -1;
            for (let i = 0; i < categoriesArray.length; i++) {
              const category = categoriesArray[i];
              categoryNames.push(category.name);
              if (category.github === true) {
                githubIndex = i;
              }
            }
            setRadarDataall(categoryNames);
            setSelectedIndex(githubIndex);
          } else {
            setRadarDataall([]);
            setSelectedIndex(-1);
          }
        } catch {}
      };
      radarchart2();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const checkAllHabitsArchived = async () => {
        try {
          const categories = await AsyncStorage.getItem("categories");
          if (categories) {
            const categoriesArray = JSON.parse(categories);
            if (categoriesArray.length === 0) {
              setIsEnableArchive(false);
              return;
            }
            const allArchived = categoriesArray.every(
              (cat: any) => cat.archivated === true
            );
            setIsEnableArchive(allArchived);
          } else {
            setIsEnableArchive(false);
          }
        } catch {}
      };
      checkAllHabitsArchived();

      const checkAllRoutinesArchived = async () => {
        try {
          const routines = await AsyncStorage.getItem("routines");
          if (routines) {
            const routinesArray = JSON.parse(routines);
            if (routinesArray.length === 0) {
              setisEnableArchive2(false);
              return;
            }
            const allArchived = routinesArray.every(
              (routine: any) => routine.archivated === true
            );
            setisEnableArchive2(allArchived);
          } else {
            setisEnableArchive2(false);
          }
        } catch {}
      };
      checkAllRoutinesArchived();

      const load = async () => {
        try {
          const loaded = await AsyncStorage.getItem("github");
          if (loaded !== null) {
            setGithubUsername(loaded);
          }
          const loaded1 = await AsyncStorage.getItem("notifications");
          if (loaded1 !== null) {
            setIsEnabled(JSON.parse(loaded1));
          }
        } catch {}
      };
      load();

      const get_git = async () => {
        try {
          const categories = await AsyncStorage.getItem("categories");
          if (categories) {
            const categoriesArray = JSON.parse(categories);
            for (let i = 0; i < categoriesArray.length; i++) {
              if (categoriesArray[i].github == false) {
                setgitc(i);
              }
            }
          }
        } catch {}
      };
      get_git();
    }, [])
  );

  const saveGithub = async (username: string) => {
    await AsyncStorage.setItem("github", username);
  };

  useFocusEffect(
    useCallback(() => {
      const getcolor = async () => {
        try {
          const colorScheme = await AsyncStorage.getItem("color");
          if (colorScheme) {
            setColorScheme(JSON.parse(colorScheme));
          }
        } catch {}
      };
      getcolor();
    }, [])
  );

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    await AsyncStorage.setItem("notifications", JSON.stringify(newValue));
  };

  const toggleSwitch2 = async () => {
    try {
      const newValue = !isEnabledArchive;
      setIsEnableArchive(newValue);
      const updatedCategories = await AsyncStorage.getItem("categories");
      if (updatedCategories) {
        const categories = JSON.parse(updatedCategories);
        categories.forEach((category: any) => {
          category.archivated = newValue;
        });
        await AsyncStorage.setItem("categories", JSON.stringify(categories));
      }
    } catch {}
  };

  const toggleSwitch3 = async () => {
    try {
      const newValue = !isEnabledArchive2;
      setisEnableArchive2(newValue);
      const updatedRoutines = await AsyncStorage.getItem("routines");
      if (updatedRoutines) {
        const routines = JSON.parse(updatedRoutines);
        routines.forEach((routine: any) => {
          routine.archivated = newValue;
        });
        await AsyncStorage.setItem("routines", JSON.stringify(routines));
      }
    } catch {}
  };
  const exportData = async () => {
    setPaywallvisible(true);
    const categories = await AsyncStorage.getItem("categories");
    const routines = await AsyncStorage.getItem("routines");
    const notifications = await AsyncStorage.getItem("notifications");
    const github = await AsyncStorage.getItem("github");

    const data = {
      categories: categories ? JSON.parse(categories) : [],
      routines: routines ? JSON.parse(routines) : [],
      notifications: notifications ? JSON.parse(notifications) : false,
      github: github || "",
    };

    const jsonData = JSON.stringify(data, null, 2);
    const SECRETKEY = "QUICKAUFDIE1";
    const today = new Date();
    const encrypted = CryptoJS.AES.encrypt(jsonData, SECRETKEY).toString();
    const todayString = today.toLocaleDateString("de-DE");
    const fileUri =
      FileSystem.documentDirectory + "loop-export_" + todayString + ".json";
    console.log(fileUri);
    await FileSystem.writeAsStringAsync(fileUri, encrypted, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri);
  };

  const importData = async (data: string) => {
    if (!data) {
      return;
    }
    const SECRETKEY = "QUICKAUFDIE1";
    const decrypted = CryptoJS.AES.decrypt(data, SECRETKEY).toString(
      CryptoJS.enc.Utf8
    );
    const parsedData = JSON.parse(decrypted);
    if (parsedData.categories) {
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(parsedData.categories)
      );
    }
    if (parsedData.routines) {
      await AsyncStorage.setItem(
        "routines",
        JSON.stringify(parsedData.routines)
      );
    }
    if (parsedData.notifications) {
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(parsedData.notifications)
      );
    }
    if (parsedData.github) {
      await AsyncStorage.setItem(
        "github",
        JSON.stringify(parsedData.github).replace(/"/g, "")
      );
    }
  };

  const pickJsonFile = async () => {
    setPaywallvisible(true);

    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });
      if (res.assets && res.assets.length > 0) {
        const data = await FileSystem.readAsStringAsync(res.assets[0].uri);
        importData(data);
      }
    } catch (e) {
      console.error("Fehler beim JSON-Pick:", e);
    }
  };

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
        bg: colorScheme === "dark" ? "#1f2937" : "#f5f3ff", // violet-950 : violet-50
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
  const isDark = colorScheme === "dark";
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
  const secondaryBgColor = "bg-[var(--primary-bg-color)]";

  const iconColor = "--text-color";
  const inputBgColor = "bg-[var(--primary-bg-color)]";

  return (
    <ScrollView className={`flex-1 ${bgColor}`} style={themeVars}>
      <View className={`flex-1 ${bgColor} py-8 px-5`}>
        <View className="mt-12 mb-6">
          <Text className={`${textColor} text-4xl font-bold mb-1`}>
            Settings
          </Text>
          <Text className={`${textMutedColor} text-base`}>
            Manage your app preferences
          </Text>
        </View>
        {paywallvisible ? (
          <PaywallModal
            visible={paywallvisible}
            onClose={() => setPaywallvisible(false)}
          />
        ) : null}
        <View className={`${cardBgColor} rounded-2xl p-5 shadow-md mb-6`}>
          <View className="mb-6">
            <Text
              className={`${textMutedColor} text-xs font-medium uppercase tracking-wider mb-4`}
            >
              Profile
            </Text>

            <View
              className={`flex-row items-center ${borderColor} border-b pb-4 mb-4`}
            >
              <View className="w-10 items-center">
                <FontAwesome5
                  name="github"
                  size={18}
                  color={currentTheme.text}
                />
              </View>
              <Text className={`${textColor} text-base font-medium w-24`}>
                Github
              </Text>
              <TextInput
                className={`flex-1 ${textColor} text-base ${inputBgColor} px-3 py-2.5 rounded-lg`}
                placeholder="Enter username"
                placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                value={githubUsername} // Füge diese Zeile hinzu
                onChangeText={(text) => {
                  setGithubUsername(text); // State aktualisieren
                  saveGithub(text); // In AsyncStorage speichern
                }}
              />
            </View>

            <View className={`${inputBgColor} rounded-lg px-2 py-1 mb-2 `}>
              <Picker
                className=""
                selectedValue={selectedIndex}
                onValueChange={handleSelectionChange}
                dropdownIconColor={iconColor}
                style={{ color: isDark ? "#fff" : "#000" }}
              >
                <Picker.Item label="Select GitHub Habit" value={-1} />
                {radarDataall.map((item, index) => (
                  <Picker.Item label={item} value={index} key={index} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-6">
            <Text
              className={`${textMutedColor} text-xs font-medium uppercase tracking-wider mb-4`}
            >
              Notifications
            </Text>

            <View
              className={`flex-row items-center justify-between ${borderColor} border-b pb-4 mb-4`}
            >
              <View className="flex-row items-center">
                <View className="w-10 items-center">
                  <FontAwesome5
                    name="bell"
                    size={18}
                    color={currentTheme.text}
                  />
                </View>
                <Text className={`${textColor} text-base font-medium`}>
                  Push Notifications
                </Text>
              </View>
              <Switch
                onValueChange={toggleSwitch}
                value={isEnabled}
                trackColor={{
                  false: isDark ? "#3f3f46" : "#e5e7eb",
                  true: "#8b5cf6",
                }}
                thumbColor={
                  isEnabled ? "#ede9fe" : isDark ? "#e4e4e7" : "#f3f4f6"
                }
              />
            </View>
          </View>

          <View className="mb-6">
            <Text
              className={`${textMutedColor} text-xs font-medium uppercase tracking-wider mb-4`}
            >
              Archive Management
            </Text>

            <View
              className={`flex-row items-center justify-between ${borderColor} border-b pb-4 mb-4`}
            >
              <View className="flex-row items-center">
                <View className="w-10 items-center">
                  <MaterialCommunityIcons
                    name="archive"
                    size={20}
                    color={currentTheme.text}
                  />
                </View>
                <Text className={`${textColor} text-base font-medium`}>
                  Archive All Habits
                </Text>
              </View>
              <Switch
                onValueChange={toggleSwitch2}
                value={isEnabledArchive}
                trackColor={{
                  false: isDark ? "#3f3f46" : "#e5e7eb",
                  true: "#8b5cf6",
                }}
                thumbColor={
                  isEnabledArchive ? "#ede9fe" : isDark ? "#e4e4e7" : "#f3f4f6"
                }
              />
            </View>

            <View
              className={`flex-row items-center justify-between ${borderColor} border-b pb-4 mb-4`}
            >
              <View className="flex-row items-center">
                <View className="w-10 items-center">
                  <MaterialCommunityIcons
                    name="archive-outline"
                    size={20}
                    color={currentTheme.text}
                  />
                </View>
                <Text className={`${textColor} text-base font-medium`}>
                  Archive All Routines
                </Text>
              </View>
              <Switch
                onValueChange={toggleSwitch3}
                value={isEnabledArchive2}
                trackColor={{
                  false: isDark ? "#3f3f46" : "#e5e7eb",
                  true: "#8b5cf6",
                }}
                thumbColor={
                  isEnabledArchive2 ? "#ede9fe" : isDark ? "#e4e4e7" : "#f3f4f6"
                }
              />
            </View>
            <View className="w-full">
              <TouchableOpacity
                className={`flex-row items-center justify-center gap-3 ${primaryBgColor} rounded-full  h-14`}
                onPress={sendEmail}
              >
                <MaterialCommunityIcons
                  name="gmail"
                  size={20}
                  color={currentTheme.text}
                ></MaterialCommunityIcons>
                <Text className=" text-gray-200 text-lg">Send feedback</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text
              className={`${textMutedColor} text-xs font-medium uppercase tracking-wider mb-4`}
            >
              Data Management
            </Text>

            <View className="flex-row gap-3  z-50">
              <TouchableOpacity
                onPress={() => {
                  exportData();
                }}
                className={`flex-1 ${primaryBgColor} rounded-lg py-3.5 flex-row items-center justify-center`}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="export"
                  size={18}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-white text-base font-medium">
                  Export Data
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  pickJsonFile();
                }}
                className={`flex-1 ${secondaryBgColor} rounded-lg py-3.5 flex-row items-center justify-center`}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="import"
                  size={18}
                  color={isDark ? "white" : "#4b5563"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  className={
                    isDark
                      ? "text-white text-base font-medium"
                      : "text-gray-700 text-base font-medium"
                  }
                >
                  Import Data
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
