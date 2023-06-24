import styles from "./AudioPlayer.module.scss";
import useAudioPlayer from "@hooks/useAudioPlayer/useAudioPlayer";
import { IconPlay, IconPause } from "@assets/svg/icons";
import useThemeStore from "src/store/useThemeStore/useThemeStore";

type AudioPlayerProps = {
  src: string | null;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const { playing, pause, pauseAudio, playAudio, handleEnded, audioRef } =
    useAudioPlayer(src);
  const theme = useThemeStore((state) => state.theme);

  return (
    <>
      {src && (
        <audio
          ref={audioRef}
          src={src}
          onEnded={handleEnded}
          data-playing={playing}
          data-pause={pause}
          aria-label='Audio Player'
        />
      )}
      <button
        onClick={!pause ? playAudio : pauseAudio}
        type='button'
        className={styles.btn}
        data-theme={theme}
        data-testid='audio-player-button'
        aria-label={!pause ? "Play Audio" : "Pause Audio"}
      >
        {!pause && <IconPlay data-testid='icon-play' />}
        {pause && <IconPause data-testid='icon-pause' />}
      </button>
    </>
  );
};

export default AudioPlayer;
