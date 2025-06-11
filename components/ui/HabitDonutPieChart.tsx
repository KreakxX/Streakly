import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PieChartProps {
  percentage: number;
  isDarkMode: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ percentage, isDarkMode }) => {
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
            styles.segment,
            {
              backgroundColor: isActive ? colors.fill : colors.background,
              transform: [{ rotate: `${segmentAngle}deg` }],
            },
          ]}
        />
      );
    }

    return segments;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View
          style={[styles.outerCircle, { backgroundColor: colors.background }]}
        >
          <View style={styles.segmentsContainer}>{createSegments()}</View>

          <View
            style={[
              styles.innerCircle,
              { backgroundColor: isDarkMode ? "#020617" : "#f9fafb" },
            ]}
          >
            <Text style={[styles.percentageText, { color: colors.text }]}>
              {Math.round(percentage)}%
            </Text>
            <Text style={[styles.labelText, { color: colors.text }]}>
              Checked
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  chartContainer: {
    position: "relative",
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: "relative",
    overflow: "hidden",
  },
  segmentsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  segment: {
    position: "absolute",
    width: 2,
    height: 100,
    top: 0,
    left: 99,
    transformOrigin: "1px 100px",
  },
  innerCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    top: 40,
    left: 40,
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  labelText: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default PieChart;
