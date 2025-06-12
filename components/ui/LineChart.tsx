import React from "react";
import { Dimensions, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

// Screen dimensions
const { width: screenWidth } = Dimensions.get("window");

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
  const chartWidth = Math.min(Math.max(screenWidth * 0.6, 200), 300);
  const chartHeight = Math.min(chartWidth * 0.6, 180);
  const padding = Math.max(15, chartWidth * 0.08);

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

  const maxValue = 7;
  const minValue = 0;

  if (!data || data.length === 0) {
    const responsiveEmptyStyles = {
      container: {
        backgroundColor: colors.background,
        padding: Math.min(20, screenWidth * 0.05),
        margin: 10,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        width: chartWidth + 40,
      },
      title: {
        color: colors.text,
        fontSize: Math.min(18, chartWidth * 0.06),
        fontWeight: "bold" as const,
        marginBottom: 20,
        textAlign: "center" as const,
      },
      emptyState: {
        alignItems: "center" as const,
        justifyContent: "center" as const,
        height: chartHeight,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: "dashed" as const,
        borderColor: colors.gridLine,
      },
    };

    return (
      <View style={responsiveEmptyStyles.container}>
        <Text style={responsiveEmptyStyles.title}>{title}</Text>
        <View style={responsiveEmptyStyles.emptyState}>
          <Text style={[responsiveEmptyStyles.title, { marginBottom: 8 }]}>
            No Data Available
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: Math.min(14, chartWidth * 0.045),
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
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
              style={{
                position: "absolute",
                backgroundColor: colors.currentWeek,
                left: x - 18,
                top: chartHeight + 2,
                width: 36,
                height: 20,
                borderRadius: 10,
                zIndex: 1,
              }}
            />
          )}
          <Text
            style={{
              position: "absolute",
              fontSize: Math.min(12, chartWidth * 0.04),
              color: isCurrentWeek ? "#ffffff" : colors.textSecondary,
              left: x - 15,
              top: chartHeight + 5,
              width: 30,
              textAlign: "center",
              fontWeight: isCurrentWeek ? "bold" : "normal",
              zIndex: isCurrentWeek ? 2 : 1,
            }}
          >
            W{weekNumber}
          </Text>
        </View>
      );
    });
  };

  const responsiveStyles = {
    container: {
      backgroundColor: colors.background,
      padding: Math.min(20, screenWidth * 0.05),
      margin: 10,
      borderRadius: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      width: chartWidth + 40,
    },
    title: {
      fontSize: Math.min(18, chartWidth * 0.06),
      fontWeight: "bold" as const,
      marginBottom: 20,
      textAlign: "center" as const,
      color: colors.text,
    },
    chartContainer: {
      position: "relative" as const,
      width: chartWidth,
      height: chartHeight + 40,
      alignSelf: "center" as const,
      backgroundColor: colors.background,
    },
    statsContainer: {
      flexDirection: "row" as const,
      justifyContent: "space-around" as const,
      marginTop: 20,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: colors.gridLine,
    },
    statItem: {
      alignItems: "center" as const,
    },
    statValue: {
      fontSize: Math.min(20, chartWidth * 0.07),
      fontWeight: "bold" as const,
      marginBottom: 4,
      color: colors.text,
    },
    statLabel: {
      fontSize: Math.min(12, chartWidth * 0.04),
      opacity: 0.7,
      color: colors.textSecondary,
    },
  };

  return (
    <View style={responsiveStyles.container}>
      <Text style={responsiveStyles.title}>{title}</Text>

      <View style={responsiveStyles.chartContainer}>
        <Svg
          width={chartWidth}
          height={chartHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {generateGridLines()}
          <Path
            d={generateLinePath()}
            stroke={colors.line}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {generateDataPoints()}
        </Svg>

        <View style={{ position: "absolute", width: "100%", height: "100%" }}>
          {data.map((value, index) => {
            const { x, y } = getPointPosition(index, value);
            return (
              <Text
                key={index}
                style={{
                  position: "absolute",
                  fontSize: Math.min(12, chartWidth * 0.045),
                  fontWeight: "600",
                  width: 20,
                  textAlign: "center",
                  color: colors.text,
                  left: x - 10,
                  top: y - 25,
                }}
              >
                {value}
              </Text>
            );
          })}
        </View>

        <View style={{ position: "absolute", width: "100%", height: "100%" }}>
          {generateWeekLabels()}
        </View>

        <View
          style={{ position: "absolute", left: -15, width: 15, height: "100%" }}
        >
          <Text
            style={{
              position: "absolute",
              fontSize: Math.min(12, chartWidth * 0.04),
              textAlign: "right",
              width: 15,
              color: colors.textSecondary,
              top: padding - 5,
            }}
          >
            {maxValue}
          </Text>
          <Text
            style={{
              position: "absolute",
              fontSize: Math.min(12, chartWidth * 0.04),
              textAlign: "right",
              width: 15,
              color: colors.textSecondary,
              top: chartHeight - padding - 10,
            }}
          >
            0
          </Text>
        </View>
      </View>

      <View style={responsiveStyles.statsContainer}>
        <View style={responsiveStyles.statItem}>
          <Text style={responsiveStyles.statValue}>{Math.max(...data)}</Text>
          <Text style={responsiveStyles.statLabel}>Best Week</Text>
        </View>
        <View style={responsiveStyles.statItem}>
          <Text style={responsiveStyles.statValue}>
            {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}
          </Text>
          <Text style={responsiveStyles.statLabel}>Average</Text>
        </View>
        <View style={responsiveStyles.statItem}>
          <Text style={responsiveStyles.statValue}>
            {data.reduce((a, b) => a + b, 0)}
          </Text>
          <Text style={responsiveStyles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
};

export default LineChart;
