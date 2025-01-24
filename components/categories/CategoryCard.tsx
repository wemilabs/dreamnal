import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";

interface CategoryCardProps {
  category: Category;
}

/**
 * Renders a single category card with image and description
 */
const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/category/${category.name.toLowerCase()}`} asChild>
      <Pressable className="bg-white rounded-2xl overflow-hidden shadow-sm m-2 flex-1">
        <Image
          source={{ uri: category.image }}
          className="w-full h-32"
          style={{ resizeMode: "cover" }}
        />
        <View className="p-4">
          <Text className="text-lg font-semibold mb-1">{category.name}</Text>
          <Text className="text-sm text-gray-600 line-clamp-2">
            {category.description}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default CategoryCard;
