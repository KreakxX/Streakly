import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

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
    tab: "#151422",
  },
  ocean: {
    primary: {
      main: "#2563eb",
      light: "#3b82f6",
      dark: "#1d4ed8",
      text: "#60a5fa",
      bg: "#0c0a09",
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
    border: "#1f1f1f",
    tab: "#262626",
  },
  white: {
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
      text: "#1d4ed8",
      bg: "#ffffff",
    },
    bg: "#ffffff",
    card: "#f9fafb",
    text: "#111827",
    textMuted: "#6b7280",
    border: "#e5e7eb",
    tab: "#f3f4f6",
  },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          backgroundColor: "transparent",
          borderColor: "transparent",
          borderTopColor: "transparent",
          shadowColor: "transparent",
        },
        tabBarActiveTintColor: "#7c3aed",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="compass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",

          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="cog" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
