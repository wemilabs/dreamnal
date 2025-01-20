import AsyncStorage from "@react-native-async-storage/async-storage";

const DREAMS_STORAGE_KEY = "@dreams";

export async function saveDream(
  dream: Omit<Dream, "id" | "createdAt" | "updatedAt">
): Promise<Dream> {
  const dreams = await getDreams();
  const newDream: Dream = {
    ...dream,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await AsyncStorage.setItem(
    DREAMS_STORAGE_KEY,
    JSON.stringify([newDream, ...dreams])
  );

  return newDream;
}

export async function getDreams(): Promise<Dream[]> {
  try {
    const dreamsJson = await AsyncStorage.getItem(DREAMS_STORAGE_KEY);
    return dreamsJson ? JSON.parse(dreamsJson) : [];
  } catch (error) {
    console.error("Error getting dreams:", error);
    return [];
  }
}

export async function updateDream(
  id: string,
  updates: Partial<Omit<Dream, "id" | "createdAt">>
): Promise<void> {
  const dreams = await getDreams();
  const updatedDreams = dreams.map((dream) =>
    dream.id === id
      ? {
          ...dream,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : dream
  );

  await AsyncStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(updatedDreams));
}

export async function deleteDream(id: string): Promise<void> {
  const dreams = await getDreams();
  const filteredDreams = dreams.filter((dream) => dream.id !== id);
  await AsyncStorage.setItem(
    DREAMS_STORAGE_KEY,
    JSON.stringify(filteredDreams)
  );
}
