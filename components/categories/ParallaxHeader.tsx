import { View, Text, StyleSheet, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";

import images from "@/lib/images";

interface ParallaxHeaderProps {
  scrollY: Animated.Value;
}

/**
 * A header component with parallax scrolling effect
 * @param scrollY - Animated value from scroll position
 */
const ParallaxHeader = ({ scrollY }: ParallaxHeaderProps) => {
  // Constants for header dimensions and animations
  const HEADER_HEIGHT = 300;
  const HEADER_SCROLL_DISTANCE = HEADER_HEIGHT - 100;

  // Calculate header transform based on scroll position
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });

  // Calculate image scale for parallax effect
  const imageScale = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_SCROLL_DISTANCE],
    outputRange: [2, 1, 0.75],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[styles.header, { transform: [{ translateY: headerTranslateY }] }]}
    >
      <StatusBar style="light" />
      <Animated.Image
        source={images.dummyLogo}
        style={[styles.headerImage, { transform: [{ scale: imageScale }] }]}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Categories</Text>
        <Text style={styles.subtitle}>Discover the dream realm</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    overflow: "hidden",
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.9,
  },
});

export default ParallaxHeader;
