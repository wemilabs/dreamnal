import { View, Text, ScrollView, Pressable } from "react-native";
import { useState } from "react";
import { tags } from "@/lib/data";

interface TagListProps {
  onSelectTag?: (tag: string) => void;
}

/**
 * Horizontal scrollable list of tags with selection state
 */
const TagList = ({ onSelectTag }: TagListProps) => {
  const [selectedTag, setSelectedTag] = useState("all");

  const handleTagPress = (value: string) => {
    setSelectedTag(value);
    onSelectTag?.(value);
  };

  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        className="flex-row gap-2"
      >
        {tags.map((tag) => {
          const isSelected = selectedTag === tag.value;
          return (
            <Pressable
              key={tag.value}
              onPress={() => handleTagPress(tag.value)}
              className={`px-4 py-2 rounded-full border ${
                isSelected
                  ? "bg-violet-700 border-violet-700"
                  : "bg-white/80 backdrop-blur-sm border-violet-200"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : "text-violet-900"
                }`}
              >
                {tag.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TagList;
