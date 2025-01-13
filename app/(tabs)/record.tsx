import { useState } from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
// import { Audio } from "expo-audio";
import * as FileSystem from "expo-file-system";

// import { transcribeAudio } from "../../utils/openai";

export default function RecordDream() {
  // const [recording, setRecording] = useState<Audio.Recording | null>(null);
  // const [isRecording, setIsRecording] = useState(false);

  // async function startRecording() {
  //   try {
  //     await Audio.requestPermissionsAsync();
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });

  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RecordingOptionsPresets.HIGH_QUALITY
  //     );
  //     setRecording(recording);
  //     setIsRecording(true);
  //   } catch (err) {
  //     console.error("Failed to start recording", err);
  //   }
  // }

  // async function stopRecording() {
  //   if (!recording) return;

  //   setIsRecording(false);
  //   await recording.stopAndUnloadAsync();
  //   const uri = recording.getURI();

  //   const transcribedText = await transcribeAudio(uri);

  //   router.push({
  //     pathname: "/edit/new",
  //     params: {
  //       content: transcribedText,
  //       audioUri: uri,
  //     },
  //   });
  // }

  return (
    <View className="flex-1 bg-white items-center justify-center">
      {/* <TouchableOpacity
        className={`w-24 h-24 rounded-full items-center justify-center ${
          isRecording ? "bg-red-500" : "bg-blue-500"
        }`}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text className="text-white text-lg">
          {isRecording ? "Stop" : "Record"}
        </Text>
      </TouchableOpacity> */}
      <Text className="text-lg font-medium">Recording your dream...</Text>
    </View>
  );
}
