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
interface Language {
  name: string;
  percent: number;
  color: string;
}

interface PieChartProps {
  languages: Language[]; // jetzt mehrere Sprachen mit Prozent und Farbe
  isDarkMode: boolean;
  theme: Theme;
  timeCodedToday: number;
}

const LanguagePiechart: React.FC<PieChartProps> = ({
  languages,
  isDarkMode,
  theme,
  timeCodedToday,
}) => {
  const chartSize = Math.min(Math.max(screenWidth * 0.45, 120), 200);
  const innerSize = chartSize * 0.6;
  const segmentWidth = Math.max(1.5, chartSize * 0.01);

  // Total Segmente: z.B. 100 (für 100%)
  const totalSegments = 100;

  const createSegments = () => {
    const segments: any = [];

    let startIndex = 0; // Start-Index für Segment-Gruppe pro Sprache

    languages.forEach(({ percent, color }, langIndex) => {
      const segmentsForLang = Math.round((percent / 100) * totalSegments);

      for (let i = 0; i < segmentsForLang; i++) {
        const segmentIndex = startIndex + i;
        const segmentAngle = (360 / totalSegments) * segmentIndex;

        segments.push(
          <View
            key={`lang-${langIndex}-seg-${i}`}
            style={{
              position: "absolute",
              width: segmentWidth,
              height: chartSize / 2,
              top: 0,
              left: chartSize / 2 - segmentWidth / 2,
              transformOrigin: `${segmentWidth / 2}px ${chartSize / 2}px`,
              backgroundColor: color,
              transform: [{ rotate: `${segmentAngle}deg` }],
            }}
          />
        );
      }

      startIndex += segmentsForLang;
    });

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
            backgroundColor: theme.bg,
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
              backgroundColor: theme.bg,
              elevation: 2,
            }}
          >
            <Text
              className="font-bold"
              style={{
                fontSize: Math.min(28, chartSize * 0.14),
                color: theme.text,
                marginBottom: 4,
              }}
            >
              {timeCodedToday}h
            </Text>
            <Text
              className="opacity-70"
              style={{
                fontSize: Math.min(14, chartSize * 0.07),
                color: theme.text,
              }}
            >
              Coded
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default LanguagePiechart;
