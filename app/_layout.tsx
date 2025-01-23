import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal-screens/record-modal"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="modal-screens/account-modal"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="dream/[id]" options={{ animation: "default" }} />
        <Stack.Screen name="category/[id]" options={{ animation: "default" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
