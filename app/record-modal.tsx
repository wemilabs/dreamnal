import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import OpenAI from "openai";
import * as FileSystem from "expo-file-system";
import { storeDream } from "@/lib/storage";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "",
  dangerouslyAllowBrowser: true, // Required for React Native
});

// Component for a single wave bar in the visualizer
const WaveBar = ({ amplitude }: { amplitude: number }) => {
  const heightAnim = useRef(new Animated.Value(2)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: Math.max(2, Math.min(40, amplitude * 40)),
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [amplitude]);

  return (
    <Animated.View
      style={[
        styles.waveBar,
        {
          height: heightAnim,
        },
      ]}
    />
  );
};

// Wave Visualizer component
const WaveVisualizer = ({
  metering,
  isRecording,
}: {
  metering: number[];
  isRecording: boolean;
}) => {
  if (!isRecording) return null;

  return (
    <View style={styles.waveContainer}>
      {metering.map((amplitude, i) => (
        <WaveBar key={i} amplitude={amplitude} />
      ))}
    </View>
  );
};

export default function RecordModal() {
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(Array(30).fill(0));
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Update metering data
  useEffect(() => {
    if (isRecording && recording) {
      const interval = setInterval(async () => {
        try {
          const status = await recording.getStatusAsync();
          if (status.isRecording) {
            const { metering = -160 } = status;
            // Normalize metering value to 0-1 range
            const normalizedValue = (metering + 160) / 160;
            setAudioData((prev) => [...prev.slice(1), normalizedValue]);
          }
        } catch (error) {
          console.log("Error getting recording status:", error);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRecording, recording]);

  useEffect(() => {
    // Request permissions when component mounts
    const getPermissions = async () => {
      try {
        const { granted } = await Audio.requestPermissionsAsync();
        if (!granted) {
          alert(
            "Please allow Dreamal to access your microphone to record your dreams"
          );
        }
      } catch (err) {
        console.error("Error requesting permissions:", err);
      }
    };

    getPermissions();
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        undefined,
        100 // Update metering every 100ms
      );

      setRecording(recording);
      setIsRecording(true);
      setAudioData(Array(30).fill(0)); // Reset audio data
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("Failed to start recording");
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      setIsTranscribing(true);

      // Create form data
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/m4a",
        name: "recording.m4a",
      } as any);
      formData.append("model", "whisper-1");
      formData.append("language", "en");

      // Make the API request directly
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContent(data.text);
      setShowForm(true);

      // Clean up the audio file
      try {
        await FileSystem.deleteAsync(uri);
      } catch (error) {
        console.error("Error deleting audio file:", error);
      }
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);

      if (uri) {
        await transcribeAudio(uri);
      }
    } catch (err) {
      console.error("Failed to stop recording:", err);
      alert("Failed to stop recording");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      const dream: Dream = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await storeDream(dream);
      router.back();
    } catch (error) {
      console.error("Error saving dream:", error);
      alert("Failed to save dream. Please try again.");
    }
  };

  // Format current date as "Wed, 15 Jan, 2025"
  const formattedDate = format(new Date(), "EEE, MMM dd, yyyy");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-xl text-secondary">Cancel</Text>
        </TouchableOpacity>
        <Text className="text-xl font-semibold">{formattedDate}</Text>
        <TouchableOpacity onPress={handleSave} disabled={!showForm}>
          <Text
            className={`text-xl font-bold ${
              !showForm ? "text-secondary/50" : "text-secondary"
            }`}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isTranscribing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
            <Text style={styles.loadingText}>Transcribing your dream...</Text>
          </View>
        ) : showForm ? (
          <View style={styles.formContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.contentInput}
              placeholder="Start writing..."
              value={content}
              onChangeText={setContent}
              multiline
              placeholderTextColor="#999"
              textAlignVertical="top"
            />
          </View>
        ) : (
          <>
            <WaveVisualizer metering={audioData} isRecording={isRecording} />

            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordingButton,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Feather
                name={isRecording ? "square" : "mic"}
                size={32}
                color="#fff"
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginBottom: 40,
    gap: 2,
  },
  waveBar: {
    width: 3,
    backgroundColor: "#0066CC",
    borderRadius: 2,
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordingButton: {
    backgroundColor: "#FF453A",
  },
  statusText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    flex: 1,
    width: "100%",
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000",
  },
  contentInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    color: "#666",
  },
});
