import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Insights = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-row justify-between items-center px-6 pt-16 pb-2">
        <Text className="text-4xl font-bold">Insights</Text>
        <Text className="text-4xl font-bold">🌙</Text>
      </View>
    </SafeAreaView>
  );
};

export default Insights;
