"use client";

import { useCallback, useEffect, useRef } from "react";
import { PREFERRED_MIME_TYPES } from "./recorder-mime";
import { useScreenWakeLock } from "./use-screen-wake-lock";

export type RecorderError = "unsupported" | "denied" | "interrupted";

export function useRecorder() {
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelledRef = useRef(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startedAtRef = useRef(0);
  const wakeLock = useScreenWakeLock();

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => {
      t.stop();
    });
    streamRef.current = null;
    void ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    analyserRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    wakeLock.release();
  }, [wakeLock]);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async (): Promise<RecorderError | null> => {
    cancelledRef.current = false;
    // Created synchronously inside the click's user-activation window so it
    // doesn't come up "suspended" after the getUserMedia await.
    const ctx = new AudioContext();
    const close = () => {
      void ctx.close().catch(() => {});
    };
    if (
      typeof MediaRecorder === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      close();
      return "unsupported";
    }
    const mimeType = PREFERRED_MIME_TYPES.find((t) =>
      MediaRecorder.isTypeSupported(t),
    );
    if (!mimeType) {
      close();
      return "unsupported";
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      close();
      return "denied";
    }
    if (cancelledRef.current) {
      stream.getTracks().forEach((t) => {
        t.stop();
      });
      close();
      return "interrupted";
    }
    await ctx.resume();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.75;
    source.connect(analyser);

    const recorder = new MediaRecorder(stream, {
      mimeType,
      audioBitsPerSecond: 48000,
    });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    streamRef.current = stream;
    ctxRef.current = ctx;
    analyserRef.current = analyser;
    recorderRef.current = recorder;
    startedAtRef.current = performance.now();
    wakeLock.acquire();
    recorder.start(250);
    return null;
  }, [wakeLock]);

  const stop = useCallback((): Promise<Blob | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        cleanup();
        resolve(blob.size > 0 ? blob : null);
      };
      recorder.stop();
    });
  }, [cleanup]);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }
    cleanup();
  }, [cleanup]);

  return { start, stop, cancel, analyserRef, startedAtRef };
}
