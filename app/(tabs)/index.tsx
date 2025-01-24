import { View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRef } from "react";

import HomeHeader from "@/components/home/HomeHeader";
import SearchInput from "@/components/home/SearchInput";
import TagList from "@/components/home/TagList";
import DreamGrid from "@/components/home/DreamGrid";

/**
 * Home screen component with animated header and dream list
 */
const Home = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log("Searching for:", query);
  };

  const handleTagSelect = (tag: string) => {
    // TODO: Implement tag filtering
    console.log("Selected tag:", tag);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <HomeHeader scrollY={scrollY} onSearch={handleSearch} />
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 150 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <TagList onSelectTag={handleTagSelect} />
        <DreamGrid />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Home;
