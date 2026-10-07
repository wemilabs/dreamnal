export type Cue = "start" | "stop";

const NOTE_SECONDS = 0.09;
const GAP_SECONDS = 0.02;
const PEAK_GAIN = 0.15;

const FREQUENCIES: Record<Cue, [number, number]> = {
  start: [660, 880],
  stop: [880, 660],
};

export const playCue = (ctx: AudioContext, cue: Cue): Promise<void> => {
  if (ctx.state === "closed") {
    return Promise.resolve();
  }
  const frequencies = FREQUENCIES[cue];
  return new Promise((resolve) => {
    // Closing the context mid-cue never fires onended, so resolve on the
    // state change instead.
    const finish = () => {
      ctx.removeEventListener("statechange", onStateChange);
      resolve();
    };
    const onStateChange = () => {
      if (ctx.state === "closed") {
        finish();
      }
    };
    ctx.addEventListener("statechange", onStateChange);
    const now = ctx.currentTime;
    frequencies.forEach((frequency, index) => {
      const at = now + index * (NOTE_SECONDS + GAP_SECONDS);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(PEAK_GAIN, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + NOTE_SECONDS);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + NOTE_SECONDS);
      if (index === frequencies.length - 1) {
        osc.onended = finish;
      }
    });
  });
};
