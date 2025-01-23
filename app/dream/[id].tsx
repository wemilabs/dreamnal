import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { getDreams, updateDream, deleteDream } from "@/lib/storage";
import { format } from "date-fns";
import { formatDetailedDate } from "@/lib/utils/formatDate";

export default function DreamDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [dream, setDream] = useState<Dream | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadDream();
  }, [id]);

  const loadDream = async () => {
    const dreams = await getDreams();
    const foundDream = dreams.find((d) => d.id === id);
    if (foundDream) {
      setDream(foundDream);
      setTitle(foundDream.title);
      setContent(foundDream.content);
    } else {
      Alert.alert("Error", "Dream not found");
      router.back();
    }
  };

  const handleSave = async (id: string) => {
    if (!dream) return;
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    try {
      const updatedDream: Dream = {
        ...dream,
        title: title.trim(),
        content: content.trim(),
        updatedAt: new Date().toISOString(),
      };

      await updateDream(id, updatedDream);
      setDream(updatedDream);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating dream:", error);
      Alert.alert("Error", "Failed to update dream");
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Dream",
      "Are you sure you want to delete this dream? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (!dream) return;
              await deleteDream(dream.id);
              router.back();
            } catch (error) {
              console.error("Error deleting dream:", error);
              Alert.alert("Error", "Failed to delete dream");
            }
          },
        },
      ]
    );
  };

  if (!dream) return null;

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="flex-row justify-between items-center px-6 pt-4 pb-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-row gap-4">
          {isEditing ? (
            <>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Text className="text-red-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSave(dream.id)}>
                <Text className="text-blue-500 font-semibold">Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Feather name="edit-2" size={20} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Feather name="trash-2" size={20} color="#ff4444" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        {isEditing ? (
          <>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Dream Title"
              className="text-2xl font-bold mb-2 py-2"
            />
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Dream Content"
              multiline
              className="text-base leading-6"
              style={{ minHeight: 200 }}
            />
          </>
        ) : (
          <>
            <Text className="text-2xl font-bold mb-2">{dream.title}</Text>
            <Text className="text-gray-500 mb-4">
              {formatDetailedDate(dream.createdAt)}
            </Text>
            <Text className="text-base leading-6">{dream.content}</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
