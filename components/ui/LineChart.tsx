import type React from "react";
import { StyleSheet, Text, View } from "react-native";

interface LineChartProps {
  data: number[];
  isDarkMode: boolean;
  title?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  isDarkMode,
  title = "Weekly Check-ins",
}) => {
  const colors = {
    background: isDarkMode ? "#111827" : "#f9fafb",
    gridLine: isDarkMode ? "#374151" : "#e5e7eb",
    line: "#7c3aed",
    point: "#7c3aed",
    pointActive: "#a855f7",
    text: isDarkMode ? "#ffffff" : "#000000",
    textSecondary: isDarkMode ? "#9ca3af" : "#6b7280",
    currentWeek: "#7c3aed", // Highlight-Farbe für aktuelle Woche
  };

  // Breite ein kleines bisschen reduziert (von 280 auf 260)
  const chartWidth = 260;
  const chartHeight = 160;
  const padding = 20;
  const maxValue = 7;
  const minValue = 0;

  // Calculate positions for data points
  const getPointPosition = (index: number, value: number) => {
    const x =
      padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
    const y =
      chartHeight -
      padding -
      ((value - minValue) / (maxValue - minValue)) *
        (chartHeight - 2 * padding);
    return { x, y };
  };

  const generatePath = () => {
    if (data.length === 1) return "";

    let path = "";
    data.forEach((value, index) => {
      const { x, y } = getPointPosition(index, value);
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  // Generate grid lines
  const generateGridLines = () => {
    const lines = [];
    const gridCount = 4;

    // Horizontal grid lines
    for (let i = 0; i <= gridCount; i++) {
      const y = padding + (i * (chartHeight - 2 * padding)) / gridCount;
      lines.push(
        <View
          key={`h-${i}`}
          style={[
            styles.gridLine,
            {
              backgroundColor: colors.gridLine,
              top: y,
              left: padding,
              width: chartWidth - 2 * padding,
            },
          ]}
        />
      );
    }

    // Vertical grid lines
    for (let i = 0; i <= data.length - 1; i++) {
      const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1);
      lines.push(
        <View
          key={`v-${i}`}
          style={[
            styles.gridLine,
            {
              backgroundColor: colors.gridLine,
              left: x,
              top: padding,
              height: chartHeight - 2 * padding,
              width: 1,
            },
          ]}
        />
      );
    }

    return lines;
  };

  // Generate data points
  const generateDataPoints = () => {
    return data.map((value, index) => {
      const { x, y } = getPointPosition(index, value);

      return (
        <View key={index}>
          {/* Spike line from bottom */}
          <View
            style={[
              styles.spikeLine,
              {
                backgroundColor: colors.line,
                left: x - 1,
                top: y,
                height: chartHeight - padding - y,
              },
            ]}
          />
          {/* Data point */}
          <View
            style={[
              styles.dataPoint,
              {
                backgroundColor: colors.point,
                left: x - 4,
                top: y - 4,
                borderColor: colors.background,
              },
            ]}
          />
          {/* Value label */}
          <Text
            style={[
              styles.valueLabel,
              {
                color: colors.text,
                left: x - 10,
                top: y - 25,
              },
            ]}
          >
            {value}
          </Text>
        </View>
      );
    });
  };

  // Generate week labels with current week highlighting
  const generateWeekLabels = () => {
    return data.map((_, index) => {
      const x =
        padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
      const weekNumber = data.length - index;
      const isCurrentWeek = weekNumber === 1; // W1 ist die aktuelle Woche

      return (
        <View key={index}>
          {/* Highlight-Hintergrund für aktuelle Woche */}
          {isCurrentWeek && (
            <View
              style={[
                styles.currentWeekHighlight,
                {
                  backgroundColor: colors.currentWeek,
                  left: x - 18,
                  top: chartHeight + 2,
                },
              ]}
            />
          )}
          {/* Week Label */}
          <Text
            style={[
              styles.weekLabel,
              isCurrentWeek && styles.currentWeekLabel,
              {
                color: isCurrentWeek ? "#ffffff" : colors.textSecondary,
                left: x - 15,
                top: chartHeight + 5,
                fontWeight: isCurrentWeek ? "bold" : "normal",
              },
            ]}
          >
            W{weekNumber}
          </Text>
        </View>
      );
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <View
        style={[styles.chartContainer, { backgroundColor: colors.background }]}
      >
        <View style={styles.gridContainer}>{generateGridLines()}</View>

        <View style={styles.chartContent}>{generateDataPoints()}</View>

        <View style={styles.labelsContainer}>{generateWeekLabels()}</View>

        <View style={styles.yAxisContainer}>
          <Text
            style={[
              styles.yAxisLabel,
              { color: colors.textSecondary, top: padding - 5 },
            ]}
          >
            {maxValue}
          </Text>
          <Text
            style={[
              styles.yAxisLabel,
              { color: colors.textSecondary, top: chartHeight - padding - 10 },
            ]}
          >
            0
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {Math.max(...data)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Best Week
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Average
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {data.reduce((a, b) => a + b, 0)}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Total
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  chartContainer: {
    position: "relative",
    width: 260,
    height: 200,
    alignSelf: "center",
  },
  gridContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  gridLine: {
    position: "absolute",
    height: 1,
  },
  chartContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  spikeLine: {
    position: "absolute",
    width: 2,
  },
  dataPoint: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  valueLabel: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "600",
    width: 20,
    textAlign: "center",
  },
  labelsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  weekLabel: {
    position: "absolute",
    fontSize: 12,
    width: 30,
    textAlign: "center",
  },
  currentWeekLabel: {
    zIndex: 2,
  },
  currentWeekHighlight: {
    position: "absolute",
    width: 36,
    height: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  yAxisContainer: {
    position: "absolute",
    left: -15,
    width: 15,
    height: "100%",
  },
  yAxisLabel: {
    position: "absolute",
    fontSize: 12,
    textAlign: "right",
    width: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  containerSmall: {
    padding: 0,
    borderRadius: 12,
    margin: 0,
    width: "90%",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  emptyStateSmall: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
});

export default LineChart;
