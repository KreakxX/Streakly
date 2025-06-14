import React from "react";
import { Dimensions, Text, View } from "react-native";

// Screen dimensions
const { width: screenWidth } = Dimensions.get("window");
type Theme = {
  primary: {
    main: string;
    light: string;
    dark: string;
    text: string;
    bg: string;
  };
  bg: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  tab: string;
};

interface PieChartProps {
  percentage: number;
  isDarkMode: boolean;
  theme: Theme;
}

const PieChart: React.FC<PieChartProps> = ({
  percentage,
  isDarkMode,
  theme,
}) => {
  const chartSize = Math.min(Math.max(screenWidth * 0.35, 120), 200);
  const innerSize = chartSize * 0.6;
  const segmentWidth = Math.max(1.5, chartSize * 0.01);

  const currentTheme = theme;

  const createSegments = () => {
    const segments = [];
    const totalSegments = 100;

    for (let i = 0; i < totalSegments; i++) {
      const segmentAngle = (360 / totalSegments) * i;
      const isActive = i < (percentage / 100) * totalSegments;

      segments.push(
        <View
          key={i}
          style={[
            {
              position: "absolute",
              width: segmentWidth,
              height: chartSize / 2,
              top: 0,
              left: chartSize / 2 - segmentWidth / 2,
              transformOrigin: `${segmentWidth / 2}px ${chartSize / 2}px`,
              backgroundColor: isActive
                ? currentTheme.primary.main
                : currentTheme.border,
              transform: [{ rotate: `${segmentAngle}deg` }],
            },
          ]}
        />
      );
    }

    return segments;
  };

  return (
    <View className="items-center justify-center p-4">
      <View className="relative">
        <View
          className="rounded-full overflow-hidden"
          style={{
            width: chartSize,
            height: chartSize,
            backgroundColor: currentTheme.bg,
          }}
        >
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            {createSegments()}
          </View>

          <View
            className="items-center justify-center"
            style={{
              position: "absolute",
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              top: (chartSize - innerSize) / 2,
              left: (chartSize - innerSize) / 2,
              backgroundColor: currentTheme.bg,
              elevation: 2,
            }}
          >
            <Text
              className="font-bold"
              style={{
                fontSize: Math.min(28, chartSize * 0.14),
                color: currentTheme.text,
                marginBottom: 4,
              }}
            >
              {Math.round(percentage)}%
            </Text>
            <Text
              className="opacity-70"
              style={{
                fontSize: Math.min(14, chartSize * 0.07),
                color: currentTheme.text,
              }}
            >
              Checked
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PieChart;
