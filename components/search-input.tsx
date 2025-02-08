import { useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Platform,
  TextInputProps,
} from "react-native";
import { Feather } from "@expo/vector-icons";

/**
 * Props for the SearchInput component
 * @extends TextInputProps - Inherits all TextInput props
 */
interface SearchInputProps extends TextInputProps {
  /** Callback when search text changes */
  onSearch?: (text: string) => void;
  /** Callback when search is cleared */
  onClear?: () => void;
  /** Custom container style */
  containerStyle?: any;
}

/**
 * An iOS-friendly search input component with animation
 * Features:
 * - Animated clear button
 * - iOS-style blur effect
 * - Smooth keyboard handling
 * - Native-feeling interactions
 */
export default function SearchInput({
  onSearch,
  onClear,
  containerStyle,
  value,
  ...props
}: SearchInputProps) {
  // Animation value for clear button opacity
  const clearButtonOpacity = useRef(new Animated.Value(0)).current;
  const [isFocused, setIsFocused] = useState(false);

  // Handle text change
  const handleChangeText = (text: string) => {
    // Animate clear button
    Animated.timing(clearButtonOpacity, {
      toValue: text.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Call onSearch callback
    onSearch?.(text);
  };

  // Handle clear button press
  const handleClear = () => {
    onClear?.();
    onSearch?.("");
    Animated.timing(clearButtonOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      className={`flex-row items-center bg-gray-100 rounded-xl px-4 ${
        isFocused ? "bg-white border border-gray-200" : ""
      }`}
      style={[
        {
          height: 36,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isFocused ? 0.1 : 0,
              shadowRadius: 4,
            },
            android: {
              elevation: isFocused ? 2 : 0,
            },
          }),
        },
        containerStyle,
      ]}
    >
      <Feather
        name="search"
        size={18}
        color={isFocused ? "#000" : "#6B7280"}
        style={{ marginRight: 6 }}
      />
      <TextInput
        className="flex-1 text-xl leading-6 text-gray-900"
        placeholder="Search your dreams..."
        placeholderTextColor="#9CA3AF"
        returnKeyType="search"
        clearButtonMode="never"
        value={value}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {value && value.length > 0 && (
        <Animated.View
          style={{
            opacity: clearButtonOpacity,
          }}
        >
          <TouchableOpacity
            onPress={handleClear}
            className="p-1 rounded-full"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={18} color="#6B7280" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}
