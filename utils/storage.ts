import AsyncStorage from "@react-native-async-storage/async-storage";

const DREAMS_KEY = "dreams";

export async function loadDreams(): Promise<Dream[]> {
  const data = await AsyncStorage.getItem(DREAMS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function loadDream(id: string): Promise<Dream | null> {
  const dreams = await loadDreams();
  return dreams.find((dream) => dream.id === id) || null;
}

export async function saveDream(dream: Dream): Promise<void> {
  const dreams = await loadDreams();
  const newDream = {
    ...dream,
    id: dream.id || Date.now().toString(),
    lastModified: new Date().toISOString(),
  };

  const newDreams = dream.id
    ? dreams.map((d) => (d.id === dream.id ? newDream : d))
    : [newDream, ...dreams];

  await AsyncStorage.setItem(DREAMS_KEY, JSON.stringify(newDreams));
}
