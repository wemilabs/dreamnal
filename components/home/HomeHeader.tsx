import { View, Text, Pressable, Animated, ImageBackground } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import SearchInput from "./SearchInput";

interface HomeHeaderProps {
  scrollY: Animated.Value;
  onSearch: (query: string) => void;
}

/**
 * Header component for the home screen with parallax and sticky effects
 * @param scrollY - Animated scroll value for parallax effects
 */
const HomeHeader = ({ scrollY, onSearch }: HomeHeaderProps) => {
  // Constants for animations
  const HEADER_MAX_HEIGHT = 150;
  const HEADER_MIN_HEIGHT = 60;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  // Calculate container transform
  const containerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  // Calculate profile icon opacity
  const profileOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE * 0.5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Calculate title position and scale
  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const titleTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 30],
    extrapolate: "clamp",
  });

  // Calculate image position for parallax effect
  const imageTranslateY = scrollY.interpolate({
    inputRange: [-HEADER_MAX_HEIGHT, 0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT / 2, 0, -HEADER_SCROLL_DISTANCE * 0.75],
    extrapolate: "clamp",
  });

  return (
    <View
      className="absolute top-0 left-0 right-0 z-10 border"
      style={{ height: HEADER_MAX_HEIGHT }}
    >
      <Animated.View
        className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden"
        style={{ transform: [{ translateY: imageTranslateY }] }}
      >
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80",
          }}
          className="flex-1"
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(76, 29, 149, 0.7)", "rgba(124, 58, 237, 0.7)"]}
            className="flex-1"
          />
        </ImageBackground>
      </Animated.View>

      <Animated.View
        className="flex-1"
        style={{ transform: [{ translateY: containerTranslateY }] }}
      >
        <View className="flex-1 justify-between">
          <View className="flex-row items-center justify-between px-4 pt-12 pb-2">
            <Animated.Text
              className="text-2xl font-bold text-white"
              style={{
                transform: [
                  { scale: titleScale },
                  { translateX: titleTranslateX },
                ],
              }}
            >
              Dreams
            </Animated.Text>
            <Animated.View style={{ opacity: profileOpacity }}>
              <Link href="/" asChild>
                <Pressable className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm items-center justify-center">
                  <Ionicons name="person-outline" size={20} color="white" />
                </Pressable>
              </Link>
            </Animated.View>
          </View>
          <View className="px-4 pb-3">
            <View className="bg-white/20 backdrop-blur-sm rounded-xl">
              <SearchInput onSearch={onSearch} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default HomeHeader;
