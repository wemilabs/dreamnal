import { View, Animated } from "react-native";
import { useRef } from "react";

import ParallaxHeader from "@/components/categories/parallax-header";
import CategoryGrid from "@/components/categories/category-grid";
import { categories } from "@/lib/data";

/**
 * Categories screen component with parallax header and grid of category cards
 */
const Categories = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <View className="flex-1 bg-primary">
      <ParallaxHeader scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        className="flex-1"
      >
        <View style={{ height: 400 }} />
        <CategoryGrid categories={categories} />
      </Animated.ScrollView>
    </View>
  );
};

export default Categories;
