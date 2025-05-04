"use client";

import Streak from "@/components/ui/streak";
import { useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
interface Category {
  name: string;
  streak: number;
  color: string;
}

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([
    { name: "Coding", streak: 30, color: "from-blue-500 to-indigo-600" },
    { name: "Sport", streak: 30, color: "from-green-500 to-emerald-600" },
    { name: "Schule", streak: 30, color: "from-purple-500 to-violet-600" },
    { name: "Lesen", streak: 30, color: "from-amber-500 to-orange-600" },
    { name: "Youtube", streak: 30, color: "from-red-500 to-rose-600" },
    { name: "Musik", streak: 30, color: "from-pink-500 to-fuchsia-600" },
  ]);

  const [expand, setExpand] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const handleCheckIn = (index: number): void => {
    const updatedCategories = [...categories];
    updatedCategories[index].streak += 1;
    setCategories(updatedCategories);
  };

  const addNewHabit = (name: string) => {
    const newCategory: Category = {
      name: name,
      streak: 0,
      color: "from-blue-500 to-indigo-600",
    };
    setCategories((prev) => [...prev, newCategory]);
    setExpand(false);
  };

  const removeHabbit = (name: string) => {
    const updatedCategories = categories.filter(
      (category) => category.name !== name
    );
    setCategories(updatedCategories);
  };
  return (
    <View className="flex-1 bg-gray-950">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-8 pb-20"
      >
        <View className="items-center mb-8 mt-20">
          <View className="flex-row justify-between gap-3">
            <Text className="text-5xl font-bold text-white">Loop</Text>
            <Image
              className="w-[50px] h-[50px] relative bottom-1"
              source={require("../assets/images/AppLogo-removebg-preview.png")}
            ></Image>
          </View>
          <Text className="text-gray-400 mt-2 text-center">
            Track your daily habits and build streaks
          </Text>
        </View>

        <View className="space-y-4">
          {categories.map((category, index) => (
            <View
              key={index}
              className="overflow-hidden rounded-2xl bg-slate-900 backdrop-blur-lg border border-gray-800 mb-10"
            >
              <View
                className={`bg-gradient-to-r ${category.color} p-4 rounded-t-2xl`}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold text-2xl text-white">
                    {category.name}
                  </Text>
                  <View className="bg-white/20 px-3 py-1 rounded-full">
                    <Text className="font-bold text-xl text-white">
                      {category.streak} 🔥
                    </Text>
                  </View>
                </View>
              </View>

              <View className="p-3 flex-row justify-between items-center">
                <View className="flex-1 mr-3">
                  <Streak streak={category.streak} />
                </View>
                <TouchableOpacity
                  onPress={() => handleCheckIn(index)}
                  className="bg-slate-800 h-12 w-12 rounded-full items-center justify-center shadow-lg relative bottom-3 left-7"
                >
                  <Text className="text-white font-bold text-xl">✓</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeHabbit(category.name)}
                  className="bg-slate-800 h-7 w-7 rounded-full items-center justify-center shadow-lg relative top-12 mt-11"
                >
                  <Text className="text-white font-bold text-md text-red-400 ">
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setExpand(!expand)}
          className="mt-8 mx-auto bg-gray-800 rounded-full p-4 flex-row items-center"
        >
          <Text className="font-bold text-2xl mr-3 text-white">+</Text>
          <Text className="text-blue-400 font-medium">Add New Habit</Text>
        </TouchableOpacity>
        {expand ? (
          <View>
            <TextInput
              className="text-white font-xl  placeholder:text-white mt-5"
              placeholder="Enter name of Habit"
              onChangeText={setName}
            ></TextInput>
            <Button
              title="Add Habit"
              onPress={() => {
                addNewHabit(name);
              }}
            ></Button>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
