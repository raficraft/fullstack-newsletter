import { useState, useRef, MutableRefObject } from 'react';

type UseAudioPlayerResult = {
  playing: boolean;
  pause: boolean;
  pauseAudio: () => void;
  playAudio: () => void;
  handleEnded: () => void;
  audioRef: MutableRefObject<HTMLAudioElement | null>;
};

const useAudioPlayer = (src: string | null): UseAudioPlayerResult => {
  const [playing, setPlaying] = useState(false);
  const [pause, setPause] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.play();
      setPlaying(true);
      setPause(true);
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      setPlaying(false);
      setPause(true);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setPause(false);
  };

  return {
    playing,
    pause,
    pauseAudio,
    playAudio,
    handleEnded,
    audioRef,
  };
};

export default useAudioPlayer;
