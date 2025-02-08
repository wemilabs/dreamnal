import { View } from "react-native";
import CategoryCard from "./category-card";

interface CategoryGridProps {
  categories: Category[];
}

/**
 * Renders a responsive grid of category cards
 */
const CategoryGrid = ({ categories }: CategoryGridProps) => {
  return (
    <View className="flex-row flex-wrap px-2">
      {categories.map((category) => (
        <View key={category.name} className="w-1/2">
          <CategoryCard category={category} />
        </View>
      ))}
    </View>
  );
};

export default CategoryGrid;
