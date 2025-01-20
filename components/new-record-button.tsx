import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const NewRecordButton = () => {
  const router = useRouter();

  return (
    <View className="absolute bottom-8 self-center z-10">
      <TouchableOpacity
        onPress={() => router.push("/record-modal")}
        className="bg-secondary size-20 rounded-full items-center justify-center shadow-md"
      >
        <Feather name="plus" size={33} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default NewRecordButton;
