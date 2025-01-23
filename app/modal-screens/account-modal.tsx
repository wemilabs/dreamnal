import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountModal() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="p-5">
        <Text className="text-xl font-semibold text-center">Account</Text>
        <Pressable
          onPress={() => router.back()}
          className="absolute top-5 right-[20px]"
        >
          <Text className="text-xl font-semibold text-secondary">Done</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
