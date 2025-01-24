import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

const Category = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Category {id}</Text>
    </View>
  );
};

export default Category;
