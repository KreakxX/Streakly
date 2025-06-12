import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

// Screen dimensions
const { width: screenWidth } = Dimensions.get("window");

interface PieChartProps {
  percentage: number;
  isDarkMode: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ percentage, isDarkMode }) => {
  // Responsive sizing - zwischen 120 und 200 basierend auf Bildschirmbreite
  const chartSize = Math.min(Math.max(screenWidth * 0.35, 120), 200);
  const innerSize = chartSize * 0.6;
  const segmentWidth = Math.max(1.5, chartSize * 0.01);

  const colors = {
    background: isDarkMode ? "#111827" : "#9ca3af",
    fill: "#7c3aed",
    text: isDarkMode ? "#ffffff" : "#000000",
  };

  const angle = (percentage / 100) * 360;

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
              backgroundColor: isActive ? colors.fill : colors.background,
              transform: [{ rotate: `${segmentAngle}deg` }],
            },
          ]}
        />
      );
    }

    return segments;
  };

  const responsiveStyles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      padding: Math.min(20, screenWidth * 0.05),
    },
    chartContainer: {
      position: "relative",
    },
    outerCircle: {
      width: chartSize,
      height: chartSize,
      borderRadius: chartSize / 2,
      position: "relative",
      overflow: "hidden",
    },
    segmentsContainer: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    innerCircle: {
      position: "absolute",
      width: innerSize,
      height: innerSize,
      borderRadius: innerSize / 2,
      top: (chartSize - innerSize) / 2,
      left: (chartSize - innerSize) / 2,
      alignItems: "center",
      justifyContent: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    },
    percentageText: {
      fontSize: Math.min(28, chartSize * 0.14),
      fontWeight: "bold",
      marginBottom: 4,
    },
    labelText: {
      fontSize: Math.min(14, chartSize * 0.07),
      opacity: 0.7,
    },
  });

  return (
    <View style={responsiveStyles.container}>
      <View style={responsiveStyles.chartContainer}>
        <View
          style={[
            responsiveStyles.outerCircle,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={responsiveStyles.segmentsContainer}>
            {createSegments()}
          </View>

          <View
            style={[
              responsiveStyles.innerCircle,
              { backgroundColor: isDarkMode ? "#020617" : "#f9fafb" },
            ]}
          >
            <Text
              style={[responsiveStyles.percentageText, { color: colors.text }]}
            >
              {Math.round(percentage)}%
            </Text>
            <Text style={[responsiveStyles.labelText, { color: colors.text }]}>
              Checked
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PieChart;
