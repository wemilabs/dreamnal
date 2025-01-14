import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="(tabs)/index" />
        <Stack.Screen
          name="record-modal"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
