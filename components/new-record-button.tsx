import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

const NewRecordButton = ({ className }: { className?: string }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/modal-screens/record-modal")}
      className={`bg-secondary rounded-full items-center justify-center ${className}`}
    >
      <Feather
        name="plus"
        size={className?.includes("size-20") ? 30 : 18}
        color="#fff"
      />
    </Pressable>
  );
};

export default NewRecordButton;
