import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

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
    currentWeek: "#7c3aed",
  };

  const chartWidth = 260;
  const chartHeight = 160;
  const padding = 20;
  const maxValue = 7;
  const minValue = 0;

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <View style={[styles.emptyState, { borderColor: colors.gridLine }]}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No Data Available
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Start tracking your habits to see your progress
          </Text>
        </View>
      </View>
    );
  }

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

  // Generate path for connecting lines
  const generateLinePath = () => {
    if (data.length < 2) return "";

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

  const generateGridLines = () => {
    const lines = [];
    const gridCount = 4;

    // Horizontal grid lines
    for (let i = 0; i <= gridCount; i++) {
      const y = padding + (i * (chartHeight - 2 * padding)) / gridCount;
      lines.push(
        <Line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={chartWidth - padding}
          y2={y}
          stroke={colors.gridLine}
          strokeWidth="1"
          opacity="0.5"
        />
      );
    }

    // Vertical grid lines
    for (let i = 0; i <= data.length - 1; i++) {
      const x = padding + (i * (chartWidth - 2 * padding)) / (data.length - 1);
      lines.push(
        <Line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={chartHeight - padding}
          stroke={colors.gridLine}
          strokeWidth="1"
          opacity="0.3"
        />
      );
    }

    return lines;
  };

  const generateDataPoints = () => {
    return data.map((value, index) => {
      const { x, y } = getPointPosition(index, value);

      return (
        <React.Fragment key={index}>
          <Circle
            cx={x}
            cy={y}
            r="4"
            fill={colors.point}
            stroke={colors.background}
            strokeWidth="2"
          />
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
        </React.Fragment>
      );
    });
  };

  const generateWeekLabels = () => {
    return data.map((_, index) => {
      const x =
        padding + (index * (chartWidth - 2 * padding)) / (data.length - 1);
      const weekNumber = data.length - index;
      const isCurrentWeek = weekNumber === 1;

      return (
        <View key={index}>
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
        {/* SVG Chart */}
        <Svg width={chartWidth} height={chartHeight} style={styles.svgChart}>
          {/* Grid Lines */}
          {generateGridLines()}

          {/* Connecting Line */}
          <Path
            d={generateLinePath()}
            stroke={colors.line}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {generateDataPoints()}
        </Svg>

        {/* Value Labels */}
        <View style={styles.chartContent}>
          {data.map((value, index) => {
            const { x, y } = getPointPosition(index, value);
            return (
              <Text
                key={index}
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
            );
          })}
        </View>

        {/* Week Labels */}
        <View style={styles.labelsContainer}>{generateWeekLabels()}</View>

        {/* Y-Axis Labels */}
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
      <View
        style={[styles.statsContainer, { borderTopColor: colors.gridLine }]}
      >
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
    borderRadius: 12,
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
  svgChart: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  chartContent: {
    position: "absolute",
    width: "100%",
    height: "100%",
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
});

export default LineChart;
