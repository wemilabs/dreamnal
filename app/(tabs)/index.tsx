import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import { DreamCard } from "../../components/dream-card";
import { loadDreams } from "../../utils/storage";

export default function Home() {
  const [dreams, setDreams] = useState<Dream[]>([]);

  useEffect(() => {
    loadDreams().then(setDreams);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={dreams}
        renderItem={({ item }) => (
          <Link href={`/edit/${item.id}`} asChild>
            <TouchableOpacity>
              <DreamCard dream={item} />
            </TouchableOpacity>
          </Link>
        )}
      />
      <Link href="/record" asChild>
        <TouchableOpacity className="absolute bottom-8 right-8 w-16 h-16 bg-blue-500 rounded-full items-center justify-center">
          <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
