import { useEffect, useRef, useState } from 'react';
import { unlockImpactAudio } from './impactAudio';

const STEPS = ['👋', '🖐️ 🍎', '🥚 💦', '🖐️ 🦆', '🔄 🔍', '🧂 🥄', '🥢 💧', '🧺 ✨'];

export function ChildIntro({ onComplete }: { onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const [step, setStep] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const audio = new Audio('/audio/vi/intro-0.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;
    let active = true;
    const play = () => {
      setWaiting(false);
      void audio.play().catch(() => { if (active) setWaiting(true); });
    };
    audio.onended = () => {
      if (!active) return;
      const next = ++indexRef.current;
      if (next === STEPS.length) { completeRef.current(); return; }
      setStep(next);
      audio.src = `/audio/vi/intro-${next}.mp3`;
      play();
    };
    audio.ontimeupdate = () => {
      if (active && Number.isFinite(audio.duration) && audio.duration > 0) setProgress((indexRef.current + audio.currentTime/audio.duration)/STEPS.length*100);
    };
    audio.onerror = () => { if (active) setWaiting(true); };
    play();
    return () => { active = false; audio.pause(); audio.onended = null; audio.onerror = null; audio.ontimeupdate = null; audioRef.current = null; indexRef.current = 0; };
  }, []);

  return <div data-child-intro role="region" aria-label="Hướng dẫn ngay trong màn chơi" className="absolute bottom-5 left-5 right-[168px] sm:right-[240px] lg:right-[272px] z-[100] rounded-3xl border-2 border-sky-200 bg-white/95 shadow-lg p-3 sm:p-4 flex flex-wrap items-center justify-center gap-3">
    <div aria-hidden="true" className="text-3xl sm:text-4xl select-none">{STEPS[step]}</div>
    {waiting ? <button autoFocus aria-label="Bắt đầu nghe hướng dẫn" className="rounded-full min-w-[64px] min-h-[64px] bg-amber-400 border-4 border-white shadow-md text-3xl" onClick={() => {
      unlockImpactAudio();
      const audio = audioRef.current;
      if (!audio) return;
      setWaiting(false);
      if (audio.error) audio.load();
      void audio.play().catch(() => setWaiting(true));
    }}>▶</button> : <div aria-label="Đang đọc hướng dẫn" className="text-3xl animate-pulse">🔊</div>}
    <div role="progressbar" aria-label="Tiến trình hướng dẫn" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} className="flex-1 min-w-[48px] max-w-64 h-3 rounded-full bg-sky-200 overflow-hidden"><div className="h-full bg-sky-500 rounded-full transition-all" style={{width: `${progress}%`}}/></div>
  </div>;
}
