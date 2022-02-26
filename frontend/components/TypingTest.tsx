import { Song } from "api/models";
import { memo } from "react";

interface TypingTestProps {
  song: Song;
  letterHeight: number;
}

const TypingTest = memo(({ song, letterHeight }: TypingTestProps) => {
  return (
    <div
      className="w-[30vw] overflow-scroll"
      style={{ height: letterHeight * 5 }}
    >
      <div className="flex flex-col w-[30vw]">
        {song.lyrics.split("\n").map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
});

export default TypingTest;
