import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Bookings = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-row justify-between items-center px-6 pt-14 pb-2">
        <Text className="text-[37px] leading-[41px] font-bold">Bookings</Text>
        <Text className="text-[37px] leading-[41px] font-bold">🌙</Text>
      </View>
    </SafeAreaView>
  );
};

export default Bookings;
