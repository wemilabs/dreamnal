import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";

import { getDreams } from "@/lib/storage";
import { tags } from "@/lib/data";
import { formatRelativeDate } from "@/lib/utils/formatDate";
import NewRecordButton from "@/components/new-record-button";
import WelcomeStart from "@/components/welcome-start";

// Interface for menu items
interface MenuItem {
  id: string;
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  rightIcon?: string;
  subtext?: string;
  onClick?: () => void;
  isDropdown?: boolean;
}

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState("Entry Date");
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const router = useRouter();
  const menuRef = useRef(null);

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

  // Sort dreams based on selection
  const sortedDreams = [...dreams].sort((a, b) => {
    if (sortBy === "Entry Date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Moment Date - assuming content date might be different from creation date
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  // Filter dreams based on selected tag
  const filteredDreams = useMemo(() => {
    if (selectedTag === "all") {
      return sortedDreams;
    }
    return sortedDreams.filter((dream) => dream.tags?.includes(selectedTag));
  }, [sortedDreams, selectedTag]);

  // Animation values
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const menuScaleY = useRef(new Animated.Value(0)).current;
  const chevronRotation = useRef(new Animated.Value(0)).current;
  const sortDropdownHeight = useRef(new Animated.Value(0)).current;

  // Animation configurations
  const animateMenu = (show: boolean) => {
    Animated.parallel([
      Animated.timing(menuAnimation, {
        toValue: show ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(menuScaleY, {
        toValue: show ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateChevronAndDropdown = (show: boolean) => {
    Animated.parallel([
      Animated.timing(chevronRotation, {
        toValue: show ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(sortDropdownHeight, {
        toValue: show ? 1 : 0,
        duration: 200,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Handle menu visibility
  useEffect(() => {
    animateMenu(showMenu);
  }, [showMenu]);

  // Handle sort dropdown visibility
  useEffect(() => {
    animateChevronAndDropdown(showSortDropdown);
  }, [showSortDropdown]);

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      id: "sort",
      label: "Sort By",
      subtext: sortBy,
      icon: "chevron-right",
      rightIcon: "↓↑",
      isDropdown: true,
      onClick: () => setShowSortDropdown(!showSortDropdown),
    },
    {
      id: "insights",
      label: "Insights",
      icon: "bar-chart-2",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: "bell",
    },
    {
      id: "health",
      label: "Health Access",
      icon: "heart",
    },
    {
      id: "lock",
      label: "Lock Journal",
      icon: "lock",
    },
  ];

  const menuStyle = {
    opacity: menuAnimation,
    transform: [
      {
        translateY: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        }),
      },
      {
        scale: menuAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        }),
      },
    ],
  };

  const chevronStyle = {
    transform: [
      {
        rotate: chevronRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "90deg"],
        }),
      },
    ],
  };

  const sortDropdownStyle = {
    opacity: sortDropdownHeight,
    transform: [
      {
        translateY: sortDropdownHeight.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        }),
      },
      {
        scaleY: sortDropdownHeight,
      },
    ],
  };

  const dreamItem = ({ item }: { item: Dream }) => {
    return (
      <Pressable
        className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
        onPress={() => {
          router.push(`/dream/${item.id}`);
        }}
      >
        <Text className="text-lg font-semibold mb-2">{item.title}</Text>
        <Text className="text-gray-600 mb-3" numberOfLines={2}>
          {item.content}
        </Text>

        <View className="flex-row items-center justify-between pt-2 pb-1">
          <View className="flex-row gap-2">
            {item.tags?.map((tag) => (
              <Text
                key={tag}
                className="bg-gray-200 rounded-full px-2 py-1 text-gray-600 text-xs"
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
    <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
      <SafeAreaView className="flex-1 bg-primary">
        <StatusBar style="dark" />

        <View className="flex-row justify-between items-center px-6 pt-14 pb-2">
          <Text className="text-4xl font-bold">Dreamnal</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity className="mr-2 bg-gray-100 p-1 rounded-full">
              <Feather name="search" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                setShowMenu((prevShowMenu) => !prevShowMenu);
                if (showSortDropdown) setShowSortDropdown(false);
              }}
              className="bg-gray-100 p-1 rounded-full"
            >
              <Feather name="more-horizontal" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu overlay */}
        {showMenu && (
          <View ref={menuRef} className="absolute right-4 top-36 z-10">
            {/* Main Menu */}
            <Animated.View
              style={[menuStyle]}
              className="bg-gray-50/95 backdrop-blur-sm rounded-3xl shadow-lg w-72 divide-y divide-gray-200 overflow-hidden"
            >
              {/* Sort By Section */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  setShowSortDropdown(!showSortDropdown);
                }}
                className="px-4 py-3.5 flex-row items-center justify-between active:bg-gray-100/80"
              >
                <View className="flex-row items-center gap-3">
                  <Animated.View style={chevronStyle}>
                    <Feather name="chevron-right" size={20} color="#000" />
                  </Animated.View>
                  <View>
                    <Text className="text-base font-medium">Sort By</Text>
                    <Text className="text-sm text-gray-500">{sortBy}</Text>
                  </View>
                </View>
                <Text className="text-base">↓↑</Text>
              </Pressable>

              {/* Sort dropdown overlay */}
              {showSortDropdown && (
                <Animated.View
                  style={[sortDropdownStyle]}
                  className="bg-gray-50/95 backdrop-blur-sm w-full"
                >
                  {["Entry Date", "Moment Date"].map((option) => (
                    <Pressable
                      key={option}
                      onPress={(e) => {
                        e.stopPropagation();
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      className="px-4 py-3.5 flex-row items-center justify-between active:bg-gray-100/80"
                    >
                      <Text className="text-base pl-8">{option}</Text>
                      {sortBy === option && (
                        <Feather name="check" size={20} color="#000" />
                      )}
                    </Pressable>
                  ))}
                </Animated.View>
              )}

              {/* Other menu items */}
              <View>
                {menuItems.slice(1).map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={(e) => {
                      e.stopPropagation();
                      item.onClick?.();
                      setShowMenu(false);
                    }}
                    className="px-4 py-3.5 flex-row items-center justify-between active:bg-gray-100/80"
                  >
                    <Text className="text-base font-medium">{item.label}</Text>
                    <Feather name={item.icon} size={20} color="#000" />
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </View>
        )}

        {/* Tags */}
        {dreams.length > 0 && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-6 py-6"
            >
              {tags.map((tag) => (
                <Pressable
                  key={tag.value}
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
              ))}
            </ScrollView>
          </View>
        )}

        {/* Dream List */}
        {dreams.length === 0 ? (
          <WelcomeStart />
        ) : (
          <FlatList
            data={filteredDreams}
            renderItem={dreamItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 24, paddingTop: 12 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center py-8">
                <Text className="text-gray-500">
                  No dreams found with this tag
                </Text>
              </View>
            )}
          />
        )}

        {/* New Record Button */}
        <NewRecordButton />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
