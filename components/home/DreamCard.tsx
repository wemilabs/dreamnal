import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { format } from "date-fns";

interface DreamCardProps {
  dream: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    date: string;
  };
}

/**
 * Beautiful card component for displaying dream previews
 */
const DreamCard = ({ dream }: DreamCardProps) => {
  const formattedDate = format(new Date(dream.date), "MMM d, yyyy");

  return (
    <Link href={`/dream/${dream.id}`} asChild>
      <Pressable className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm mb-4 mx-2 border border-violet-100">
        {/* Header with date */}
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-semibold flex-1 mr-2 text-violet-900">
            {dream.title}
          </Text>
          <Text className="text-sm text-violet-600">{formattedDate}</Text>
        </View>

        {/* Content preview */}
        <Text 
          numberOfLines={2} 
          className="text-violet-700 mb-3 text-sm leading-5"
        >
          {dream.content}
        </Text>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-2">
          {dream.tags.map((tag) => (
            <View
              key={tag}
              className="bg-violet-50 px-2 py-1 rounded-full"
            >
              <Text className="text-xs text-violet-700">
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      </Pressable>
    </Link>
  );
};

export default DreamCard;
