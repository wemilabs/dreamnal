import { useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableWithoutFeedback,
  FlatList,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { getDreams } from "@/lib/storage";
import { tags } from "@/lib/data";
import { formatRelativeDate } from "@/lib/utils/formatDate";
import NewRecordButton from "@/components/new-record-button";
import WelcomeStart from "@/components/welcome-start";
import SearchInput from "@/components/search-input";
import images from "@/lib/images";

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

  // Animation values for sticky header
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 140; // Reduced header height

  // Calculate header opacity for background
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
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
        <StatusBar style="dark" />

        {/* Fixed Header Background */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: headerHeight,
            backgroundColor: "#fff",
            opacity: headerBackgroundOpacity,
            zIndex: 1,
            ...Platform.select({
              ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
              },
              android: {
                elevation: 2,
              },
            }),
          }}
        />

        {/* Header Content */}
        <View className="z-10">
          <View className="px-6 py-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-4xl font-bold">Dreams</Text>
              <Pressable
                onPress={() => router.push("/modal-screens/account-modal")}
                className="p-2 rounded-full"
              >
                <Image
                  source={images.profile}
                  className="size-8 rounded-full"
                />
              </Pressable>
            </View>
            <SearchInput
              value={searchText}
              onSearch={setSearchText}
              onClear={() => setSearchText("")}
            />
          </View>
        </View>

        {/* Scrollable Content */}
        <Animated.FlatList
          contentContainerStyle={{ paddingTop: 0 }}
          data={[
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
                        <Text className="text-gray-500">
                          No dreams matching your request
                        </Text>
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
