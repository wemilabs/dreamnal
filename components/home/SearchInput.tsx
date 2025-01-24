import { View, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface SearchInputProps {
  onSearch?: (query: string) => void;
}

/**
 * Search input component with clear button
 */
const SearchInput = ({ onSearch }: SearchInputProps) => {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  const handleChangeText = (text: string) => {
    setQuery(text);
    onSearch?.(text);
  };

  return (
    <View className="flex-row items-center px-4 h-12">
      <Ionicons name="search-outline" size={20} color="white" />
      <TextInput
        className="flex-1 ml-2 text-base placeholder:text-white/70"
        placeholder="Search your dreams..."
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        value={query}
        onChangeText={handleChangeText}
      />
      {query.length > 0 && (
        <Pressable onPress={handleClear}>
          <Ionicons name="close-circle" size={20} color="white" />
        </Pressable>
      )}
    </View>
  );
};

export default SearchInput;
