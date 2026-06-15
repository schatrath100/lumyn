import { useCallback, useEffect, useRef } from 'react';

export interface MantraOptions {
  ambient: boolean;
  binaural: boolean;
  intervalMs?: number;
}

export function useMantraAudio(word: string, options: MantraOptions) {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<OscillatorNode | null>(null);
  const binauralRef = useRef<OscillatorNode | null>(null);
  const speakingRef = useRef(false);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const startAmbient = useCallback(() => {
    const ctx = ensureCtx();
    if (ambientRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 174;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    ambientRef.current = osc;
  }, [ensureCtx]);

  const startBinaural = useCallback(() => {
    const ctx = ensureCtx();
    if (binauralRef.current) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 4;
    gain.gain.value = 0.02;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    binauralRef.current = osc;
  }, [ensureCtx]);

  const stopTones = useCallback(() => {
    ambientRef.current?.stop();
    binauralRef.current?.stop();
    ambientRef.current = null;
    binauralRef.current = null;
  }, []);

  const speakWord = useCallback(() => {
    if (speakingRef.current || !('speechSynthesis' in window)) return;
    speakingRef.current = true;
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.85;
    u.pitch = 1;
    u.volume = 0.9;
    u.onend = () => { speakingRef.current = false; };
    u.onerror = () => { speakingRef.current = false; };
    window.speechSynthesis.speak(u);
  }, [word]);

  useEffect(() => {
    if (options.ambient) startAmbient();
    else ambientRef.current?.stop();
    if (options.binaural) startBinaural();
    else binauralRef.current?.stop();
  }, [options.ambient, options.binaural, startAmbient, startBinaural]);

  useEffect(() => () => {
    stopTones();
    ctxRef.current?.close();
    window.speechSynthesis?.cancel();
  }, [stopTones]);

  return { speakWord, stopTones };
}
