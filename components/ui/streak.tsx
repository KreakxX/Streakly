"use client";

import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Day {
  status: boolean;
  date: Date;
}

interface StreakProps {
  checkedDays: Day[];
  color: string;
  bgcolor: string;
  grayColor: string;
  startDate1: Date;
  addDays: (days: number) => void;
  archivated: boolean;
  days: number;
  textColor: string;
}

const Streak = ({
  color,
  checkedDays,
  bgcolor,
  grayColor,
  addDays,
  startDate1,
  archivated,
  days,
  textColor,
}: StreakProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekdays = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];

  const [periodOffset, setPeriodOffset] = useState(0);
  const [i, setI] = useState<number>(50);

  const handlePrevPeriod = () => {
    if (periodOffset > 0) {
      setPeriodOffset(periodOffset - 1);
    }
  };

  const handleNextPeriod = () => {
    if (periodOffset > i) {
      return;
    }
    setPeriodOffset(periodOffset + 1);
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(startDate1);
    startDate.setHours(0, 0, 0, 0);

    const diffInMs = today.getTime() - startDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const calculatedOffset = Math.floor(diffInDays / days);

    if (calculatedOffset > 0) {
      setPeriodOffset(calculatedOffset);
    }
  }, []);

  const calculateDateRange = (offset: number) => {
    let periodStartDate: Date;
    if (offset === 0) {
      periodStartDate = new Date(startDate1);
    } else {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const jsDay = currentDate.getDay();
      const daysSinceMonday = (jsDay + 6) % 7;
      periodStartDate = new Date(currentDate);
      periodStartDate.setDate(
        currentDate.getDate() - daysSinceMonday + offset * days
      );
    }

    const periodEndDate = new Date(periodStartDate);
    periodEndDate.setDate(periodStartDate.getDate() + days - 1);

    return { startDate: periodStartDate, endDate: periodEndDate };
  };

  const { startDate, endDate } = calculateDateRange(periodOffset);
  const filteredDays = checkedDays.filter((day) => {
    const date = new Date(day.date);
    return date >= startDate && date <= endDate;
  });

  const totalDays = days;
  const weeks = Array.from({ length: Math.ceil(totalDays / 7) }, (_, weekIdx) =>
    filteredDays.slice(weekIdx * 7, (weekIdx + 1) * 7)
  );

  const formatDate = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  return (
    <View
      className={`p-4 bg-${bgcolor} rounded-lg w-[270px] self-start relative bottom-5 right-1`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity
          onPress={handlePrevPeriod}
          disabled={periodOffset === 0}
          className="h-8 w-8 rounded-full items-center justify-center ml-7"
          style={{
            backgroundColor: periodOffset === 0 ? `${grayColor}80` : grayColor,
            opacity: periodOffset === 0 ? 0.7 : 1,
          }}
        >
          <MaterialIcons name="chevron-left" size={16} color="white" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Feather
            name="calendar"
            size={14}
            color={color}
            style={{ marginRight: 4 }}
          />
          <Text
            style={{
              color: textColor,
            }}
            className=" font-bold text-center"
          >
            {formatDate(startDate)} - {formatDate(endDate)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            handleNextPeriod();
            addDays(105);
          }}
          disabled={periodOffset > 10}
          className="h-8 w-8 rounded-full items-center justify-center mr-7"
          style={{
            backgroundColor: periodOffset > 10 ? `${grayColor}80` : grayColor,
            opacity: periodOffset > 10 ? 0.7 : 1,
          }}
        >
          <MaterialIcons name="chevron-right" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-1">
        <View className="flex-col gap-1 mr-2">
          {weekdays.map((day, idx) => (
            <Text
              key={idx}
              style={{ color: color, fontSize: 10, fontWeight: "600" }}
            >
              {day}
            </Text>
          ))}
        </View>

        {weeks.map((week, weekIdx) => (
          <View key={weekIdx} className="flex-col gap-1 ">
            {week.map((dayObj, dayIdx) => (
              <View
                key={dayIdx}
                className="w-3 h-3 rounded-sm mb-1 "
                style={{
                  backgroundColor: dayObj?.status ? color : grayColor,
                  opacity: dayObj?.status ? 1 : 0.5,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default Streak;
