import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AudioPlayer from "../AudioPlayer";

jest
  .spyOn(HTMLAudioElement.prototype, "play")
  .mockImplementation(() => Promise.resolve());
jest
  .spyOn(HTMLAudioElement.prototype, "pause")
  .mockImplementation(() => Promise.resolve());

const target = {
  audio: /^audio player$/i,
  button: /^audio-player-button$/,
};

const customRender = (source: string | null) => {
  render(<AudioPlayer src={source} />);

  const audioElement = screen.getByLabelText(target.audio);
  const playButton = screen.getByTestId(target.button);

  return { audioElement, playButton };
};

describe("When the audioPlayer component is loaded with an audio source", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should display the button and audio element when loaded with an audio source", () => {
    const { audioElement, playButton } = customRender("audio.mp3");

    expect(audioElement).toBeInTheDocument();
    expect(playButton).toBeInTheDocument();
  });

  test("Should play the audio source when the play button is clicked", async () => {
    const { audioElement, playButton } = customRender("audio.mp3");

    fireEvent.click(playButton);

    await waitFor(() => {
      expect(audioElement).toHaveAttribute("data-playing", "true");
      expect(screen.getByTestId("icon-pause")).toBeInTheDocument();
    });
  });

  test("Should pause the audio source when the pause button is clicked", async () => {
    const { audioElement, playButton } = customRender("audio.mp3");

    fireEvent.click(playButton); // play

    await waitFor(() => {
      expect(audioElement).toHaveAttribute("data-playing", "true");
    });

    fireEvent.click(playButton); // Pause

    await waitFor(() => {
      expect(audioElement).toHaveAttribute("data-playing", "false");
      expect(audioElement).toHaveAttribute("data-pause", "true");
    });

    await waitFor(() => {
      expect(screen.getByTestId("icon-pause")).toBeInTheDocument();
    });
  });
});

describe("When the audioPlayer component is loaded without an audio source ", () => {
  test("Should display nothing", () => {
    render(<AudioPlayer src={null} />);

    expect(screen.queryByLabelText(target.audio)).not.toBeInTheDocument();
  });
});
