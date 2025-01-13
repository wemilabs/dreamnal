import { View, Text } from "react-native";

export function DreamCard({ dream }: { dream: Dream }) {
  return (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-lg font-medium">
        {new Date(dream.date).toLocaleDateString()}
      </Text>
      <Text className="text-gray-600 mt-1" numberOfLines={2}>
        {dream.content}
      </Text>
    </View>
  );
}
