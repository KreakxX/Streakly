import React from "react";
import { Dimensions, Text, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

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

interface LineChartProps {
  data: number[];
  isDarkMode: boolean;
  title?: string;
  theme: Theme;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  isDarkMode,
  title = "Weekly Check-ins",
  theme,
}) => {
  const chartWidth = Math.min(Math.max(screenWidth * 0.6, 200), 300);
  const chartHeight = Math.min(chartWidth * 0.6, 180);
  const padding = Math.max(15, chartWidth * 0.08);

  const currentTheme = theme;

  const maxValue = 7;
  const minValue = 0;

  if (!data || data.length === 0) {
    return (
      <View
        style={[
          {
            backgroundColor: currentTheme.bg,
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
        ]}
      >
        <Text
          style={[
            {
              color: currentTheme.text,
              fontSize: Math.min(18, chartWidth * 0.06),
              fontWeight: "bold",
              marginBottom: 20,
              textAlign: "center",
            },
          ]}
        >
          {title}
        </Text>
        <View
          style={[
            {
              alignItems: "center",
              justifyContent: "center",
              height: chartHeight,
              borderRadius: 8,
              borderWidth: 2,
              borderStyle: "dashed",
              borderColor: currentTheme.primary.main,
            },
          ]}
        >
          <Text
            style={[
              {
                color: currentTheme.text,
                fontSize: Math.min(18, chartWidth * 0.06),
                fontWeight: "bold",
                marginBottom: 8,
                textAlign: "center",
              },
            ]}
          >
            No Data Available
          </Text>
          <Text
            style={{
              color: currentTheme.textMuted,
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
          stroke={currentTheme.primary.main}
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
          stroke={currentTheme.primary.main}
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
            fill={currentTheme.primary.main}
            stroke={currentTheme.primary.main}
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
                backgroundColor: currentTheme.primary.main,
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
              color: isCurrentWeek ? "#ffffff" : currentTheme.textMuted,
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

  return (
    <View
      style={[
        {
          backgroundColor: currentTheme.bg,
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
      ]}
    >
      <Text
        style={[
          {
            fontSize: Math.min(18, chartWidth * 0.06),
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
            color: currentTheme.text,
          },
        ]}
      >
        {title}
      </Text>

      <View
        style={[
          {
            position: "relative",
            width: chartWidth,
            height: chartHeight + 40,
            alignSelf: "center",
            backgroundColor: currentTheme.bg,
          },
        ]}
      >
        <Svg
          width={chartWidth}
          height={chartHeight}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {generateGridLines()}
          <Path
            d={generateLinePath()}
            stroke={currentTheme.primary.main}
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
                  color: currentTheme.text,
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
              color: currentTheme.textMuted,
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
              color: currentTheme.textMuted,
              top: chartHeight - padding - 10,
            }}
          >
            0
          </Text>
        </View>
      </View>

      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 20,
            paddingTop: 15,
            borderTopWidth: 1,
            borderTopColor: currentTheme.primary.main,
          },
        ]}
      >
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[
              {
                fontSize: Math.min(20, chartWidth * 0.07),
                fontWeight: "bold",
                marginBottom: 4,
                color: currentTheme.text,
              },
            ]}
          >
            {Math.max(...data)}
          </Text>
          <Text
            style={[
              {
                fontSize: Math.min(12, chartWidth * 0.04),
                opacity: 0.7,
                color: currentTheme.textMuted,
              },
            ]}
          >
            Best Week
          </Text>
        </View>
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[
              {
                fontSize: Math.min(20, chartWidth * 0.07),
                fontWeight: "bold",
                marginBottom: 4,
                color: currentTheme.text,
              },
            ]}
          >
            {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}
          </Text>
          <Text
            style={[
              {
                fontSize: Math.min(12, chartWidth * 0.04),
                opacity: 0.7,
                color: currentTheme.textMuted,
              },
            ]}
          >
            Average
          </Text>
        </View>
        <View
          style={[
            {
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={[
              {
                fontSize: Math.min(20, chartWidth * 0.07),
                fontWeight: "bold",
                marginBottom: 4,
                color: currentTheme.text,
              },
            ]}
          >
            {data.reduce((a, b) => a + b, 0)}
          </Text>
          <Text
            style={[
              {
                fontSize: Math.min(12, chartWidth * 0.04),
                opacity: 0.7,
                color: currentTheme.textMuted,
              },
            ]}
          >
            Total
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LineChart;
