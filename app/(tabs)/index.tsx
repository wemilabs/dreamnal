import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

const colors = ["#D946EF", "#8B5CF6"];

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View className="flex-1 bg-app_theme">
      <StatusBar style="dark" />
      <View className="flex-row justify-between items-center px-6 pt-28 pb-2">
        <Text className="text-4xl font-bold">Dreamnal</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity className="mr-2 bg-gray-200/60 p-2 rounded-full">
            <Feather name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowMenu(!showMenu)}
            className="bg-gray-200/60 p-2 rounded-full"
          >
            <Feather name="more-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {showMenu ? (
        <View className="absolute right-4 top-40 bg-white rounded-xl shadow-lg z-10 w-72">
          <Pressable className="flex-row justify-between items-center p-4 border-b border-gray-100">
            <Text className="text-base">Sort By</Text>
            <Feather name="chevron-right" size={20} color="#000" />
          </Pressable>
          <Pressable className="p-4 border-b border-gray-100">
            <Text className="text-base">Insights</Text>
          </Pressable>
          <Pressable className="p-4 border-b border-gray-100">
            <Text className="text-base">Lock Journal</Text>
          </Pressable>
        </View>
      ) : null}

      <View className="flex-1 items-center justify-center -mt-16">
        <Text className="text-2xl font-bold mb-2">Start Journaling</Text>
        <Text className="text-gray-500 text-center px-12">
          Record your dreams through voice.{"\n"}
          Tap the plus button to get started.
        </Text>
      </View>

      <Link href="/record" asChild>
        <TouchableOpacity className="absolute bottom-8 self-center size-20 rounded-full bg-white shadow-xl items-center justify-center">
          <Feather name="plus" size={32} color="#8B5CF6" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
