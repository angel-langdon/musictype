import { memo, useEffect, useRef } from "react";

const correctColor = "text-zinc-300";
const wrongColor = "text-red-500";

interface LetterProps {
  songLetter: string;
  writtenLetter: string | undefined;
  isLetterActive: boolean;
}
function getProps(songLt: string, writtenLt: string | undefined) {
  const text = songLt === " " ? "\u00A0" : songLt;
  const isLetterUsed = writtenLt !== undefined;
  if (!isLetterUsed) return [text, ""];
  if (songLt === writtenLt) return [text, correctColor];
  if (songLt === " ") return [writtenLt, wrongColor];
  return [text, wrongColor];
}

const Letter = memo((props: LetterProps) => {
  const { songLetter, writtenLetter, isLetterActive } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [text, textColor] = getProps(songLetter, writtenLetter);
  const decoration = isLetterActive ? " underline decoration-[#e2b714]" : "";

  useEffect(() => {
    if (!ref.current || !isLetterActive) return;
    ref.current.scrollIntoView();
  }, [ref, isLetterActive]);

  return (
    <div ref={ref} className={textColor + decoration}>
      {text}
    </div>
  );
});

export default Letter;
