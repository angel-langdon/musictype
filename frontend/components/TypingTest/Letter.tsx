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
  const ref = useRef<HTMLDivElement>(null);
  const [text, textColor] = getProps(props.songLetter, props.writtenLetter);

  useEffect(() => {
    if (!ref.current || !props.isLetterActive) return;
    ref.current.scrollIntoView();
  }, [ref, props.isLetterActive]);

  return (
    <div ref={ref} className={textColor}>
      {text}
    </div>
  );
});

export default Letter;
