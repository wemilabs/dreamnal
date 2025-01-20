import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

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

const styles = StyleSheet.create({
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
});

export default WaveVisualizer;
