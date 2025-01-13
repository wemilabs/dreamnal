import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { saveDream, loadDream } from "../../../utils/storage";

export default function EditDream() {
  const { id, content: initialContent } = useLocalSearchParams();
  const [content, setContent] = useState(initialContent as string);

  useEffect(() => {
    if (id !== "new") {
      loadDream(id as string).then((dream) => {
        if (dream) setContent(dream.content);
      });
    }
  }, [id]);

  async function handleSave() {
    await saveDream({
      id: id === "new" ? undefined : (id as string),
      content,
      date: new Date().toISOString(),
    });
    router.push("/");
  }

  return (
    <View className="flex-1 bg-white p-4">
      <TextInput
        className="flex-1 text-base"
        multiline
        value={content}
        onChangeText={setContent}
        placeholder="Describe your dream..."
      />
      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg mt-4"
        onPress={handleSave}
      >
        <Text className="text-white text-center font-medium">Save Dream</Text>
      </TouchableOpacity>
    </View>
  );
}
