import { View } from "react-native";
import DreamCard from "./DreamCard";
import { dummyDreams } from "@/lib/data";

/**
 * Grid component for displaying dream cards
 */
const DreamGrid = () => {
  return (
    <View className="px-2">
      {dummyDreams.map((dream) => (
        <DreamCard key={dream.id} dream={dream} />
      ))}
    </View>
  );
};

export default DreamGrid;
