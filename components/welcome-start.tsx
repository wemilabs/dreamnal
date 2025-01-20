import { View, Text, Image } from "react-native";

import images from "@/lib/images";

const WelcomeStart = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={images.dummyLogo}
        className="size-28 mb-4 rounded-2xl"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold mb-2">Start Journaling</Text>
      <Text className="text-gray-500 text-center px-12">
        Record your dreams through voice.{"\n"}
        Tap the plus button to get started.
      </Text>
    </View>
  );
};

export default WelcomeStart;
