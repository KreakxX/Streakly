"use client";

import type React from "react";

import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

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

interface BadgeAnimationProps {
  days: number;
  visible: boolean;
  isDarkMode?: boolean;
}

const BadgeAnimation: React.FC<BadgeAnimationProps> = ({
  days,
  visible,
  isDarkMode = true,
}) => {
  const badge = streakBadges.find((badge) => badge.days === days);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 4,
          tension: 80,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ])
        ),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      glowAnim.setValue(0);
    }
  }, [visible]);

  if (!badge) return null;

  const glow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  const cardBgColor = isDarkMode ? "#1f2937" : "#ffffff";
  const textColor = isDarkMode ? "#ffffff" : "#1f2937";
  const subtitleColor = isDarkMode ? "#d1d5db" : "#6b7280";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        className="flex-1 justify-center items-center px-8"
        style={{
          backgroundColor: "rgba(0,0,0,0.8)",
        }}
      >
        {visible && (
          <ConfettiCannon count={60} origin={{ x: 200, y: 0 }} fadeOut />
        )}
        <Animated.View
          style={{
            backgroundColor: cardBgColor,
            borderRadius: 20,
            padding: 32,
            alignItems: "center",
            shadowColor: badge.color,
            shadowOpacity: 0.3,
            shadowRadius: glow,
            shadowOffset: { width: 0, height: 4 },
            transform: [{ scale: scaleAnim }],
            elevation: 12,
            maxWidth: 320,
            width: "100%",
          }}
        >
          <Text
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: textColor }}
          >
            🎉 Achievement Unlocked! 🎉
          </Text>

          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{
              backgroundColor: `${badge.color}20`,
              borderWidth: 2,
              borderColor: badge.color,
            }}
          >
            <FontAwesome5
              name={badge.icon as any}
              size={40}
              color={badge.color}
            />
          </View>

          <Text
            className="text-xl font-bold mb-2 text-center"
            style={{ color: badge.color }}
          >
            {badge.days} Day Streak
          </Text>

          <Text
            className="text-base text-center leading-5"
            style={{ color: subtitleColor }}
          >
            You've earned a new badge for your dedication!
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default BadgeAnimation;
