import { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  FlatList,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";

import { getDreams } from "@/lib/storage";
import { tags } from "@/lib/data";
import { formatRelativeDate } from "@/lib/utils/formatDate";
import NewRecordButton from "@/components/new-record-button";
import WelcomeStart from "@/components/welcome-start";
import SearchInput from "@/components/search-input";
import AccountCTA from "@/components/shared/account-cta";

export default function Home() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  // Load dreams when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadDreams = async () => {
        const loadedDreams = await getDreams();
        setDreams(loadedDreams);
      };

      loadDreams();
    }, [])
  );

  // Filter dreams based on selected tag and search text
  const filteredDreams = useMemo(() => {
    let filtered = dreams;

    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter((dream) => dream.tags?.includes(selectedTag));
    }

    // Filter by search text
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (dream) =>
          dream.title.toLowerCase().includes(searchLower) ||
          dream.content.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [dreams, selectedTag, searchText]);

  // Animation scroll value
  const scrollY = useRef(new Animated.Value(0)).current;

  // Calculate sticky header animations
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [-20, 0],
    extrapolate: "clamp",
  });

  // Render dream item
  const dreamItem = ({ item }: { item: Dream }) => {
    return (
      <Pressable
        className="bg-white rounded-xl p-4 mb-4 shadow-sm"
        onPress={() => {
          router.push(`/dream/${item.id}`);
        }}
      >
        <Text className="text-xl font-semibold">{item.title}</Text>
        <Text className="text-lg text-gray-600 mb-3" numberOfLines={2}>
          {item.content}
        </Text>

        <View className="flex-row items-center justify-between pt-2 pb-1">
          <View className="flex-row gap-2">
            {item.tags?.slice(0, 3).map((tag) => (
              <Text
                key={tag}
                className="bg-gray-200 rounded-full px-2 py-1 text-gray-600 text-sm"
              >
                {tag}
              </Text>
            ))}
          </View>
          <Text className="text-gray-400 text-sm">
            {formatRelativeDate(item.createdAt)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <TouchableWithoutFeedback>
      <SafeAreaView className="flex-1 bg-primary">
        <StatusBar style="auto" />

        {/* Sticky Header */}
        <Animated.View
          className="absolute top-0 left-0 right-0 bg-gray-50 backdrop-blur-md z-20 border-b border-gray-200 py-2"
          style={{
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          }}
        >
          <View className="px-6 pt-14 pb-2 flex-row items-center justify-between">
            <Pressable className="size-8 rounded-full bg-gray-200 flex-row justify-center items-center">
              <Feather name="more-horizontal" size={18} />
            </Pressable>
            <Text className="text-xl font-bold ">Dreams</Text>
            <AccountCTA />
          </View>
        </Animated.View>

        {/* Scrollable Content */}
        <Animated.FlatList
          contentContainerStyle={{ paddingTop: 0 }}
          data={[
            { id: "header", type: "header" },
            { id: "tags", type: "tags" },
            { id: "dreams", type: "dreams" },
          ]}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          renderItem={({ item }) => {
            switch (item.type) {
              case "header":
                return (
                  <View className="px-6 py-[9px]">
                    <Pressable className="size-8 rounded-full bg-gray-200 flex-row justify-center items-center mb-4">
                      <Feather name="more-horizontal" size={18} />
                    </Pressable>
                    <View className="flex-row justify-between items-center mb-4">
                      <Text className="text-[37px] leading-[41px] font-bold">
                        Dreams
                      </Text>
                      <AccountCTA />
                    </View>

                    <SearchInput
                      value={searchText}
                      onSearch={setSearchText}
                      onClear={() => setSearchText("")}
                    />
                  </View>
                );
              case "tags":
                return dreams.length > 0 ? (
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ padding: 20, paddingTop: 12 }}
                    data={tags}
                    keyExtractor={(item) => item.value}
                    renderItem={({ item: tag }) => (
                      <Pressable
                        onPress={() => setSelectedTag(tag.value)}
                        className={`mr-2 px-4 py-2 rounded-full ${
                          selectedTag === tag.value
                            ? "bg-secondary-100 border border-secondary-100"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <Text
                          className={`font-semibold ${
                            selectedTag === tag.value
                              ? "text-secondary-200"
                              : "text-gray-600"
                          }`}
                        >
                          {tag.name}
                        </Text>
                      </Pressable>
                    )}
                  />
                ) : null;
              case "dreams":
                return dreams.length === 0 ? (
                  <WelcomeStart />
                ) : (
                  <FlatList
                    data={filteredDreams}
                    renderItem={dreamItem}
                    keyExtractor={(item) => item.id}
                    className="px-6 pt-3"
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                      <View className="flex-1 items-center justify-center py-8">
                        <Text className="text-gray-500 text-lg">
                          No dreams matching your request
                        </Text>
                        <Pressable
                          onPress={() => setSelectedTag("all")}
                          className="mt-6"
                        >
                          <Text className="text-secondary text-lg font-bold">
                            View All dreams
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  />
                );
              default:
                return null;
            }
          }}
        />

        {/* New Record Button */}
        <View className="absolute bottom-8 self-center">
          <NewRecordButton className="size-20 shadow-md" />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
