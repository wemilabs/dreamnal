import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dream } from "./types/dream";

const DREAMS_STORAGE_KEY = "@dreams";

export const storeDream = async (dream: Dream) => {
  try {
    const existingDreams = await getDreams();
    const updatedDreams = [dream, ...existingDreams];
    await AsyncStorage.setItem(
      DREAMS_STORAGE_KEY,
      JSON.stringify(updatedDreams)
    );
  } catch (error) {
    console.error("Error storing dream:", error);
    throw error;
  }
};

export const getDreams = async (): Promise<Dream[]> => {
  try {
    const dreams = await AsyncStorage.getItem(DREAMS_STORAGE_KEY);
    return dreams ? JSON.parse(dreams) : [];
  } catch (error) {
    console.error("Error getting dreams:", error);
    return [];
  }
};

export const updateDream = async (updatedDream: Dream) => {
  try {
    const dreams = await getDreams();
    const updatedDreams = dreams.map((dream) =>
      dream.id === updatedDream.id ? updatedDream : dream
    );
    await AsyncStorage.setItem(
      DREAMS_STORAGE_KEY,
      JSON.stringify(updatedDreams)
    );
  } catch (error) {
    console.error("Error updating dream:", error);
    throw error;
  }
};

export const deleteDream = async (id: string) => {
  try {
    const dreams = await getDreams();
    const updatedDreams = dreams.filter((dream) => dream.id !== id);
    await AsyncStorage.setItem(
      DREAMS_STORAGE_KEY,
      JSON.stringify(updatedDreams)
    );
  } catch (error) {
    console.error("Error deleting dream:", error);
    throw error;
  }
};
