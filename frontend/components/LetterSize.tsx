import { useRef } from "react";
import { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

interface LetterSizeProps {
  setLetter: Dispatch<SetStateAction<{ width: number; height: number }>>;
  textSize: string;
}
export default function LetterSize(props: LetterSizeProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    props.setLetter({
      height: ref.current.clientHeight,
      width: ref.current.clientWidth,
    });
  }, [ref]);

  return (
    <div
      className={`fixed ${props.textSize}`}
      style={{ left: -1000 }}
      ref={ref}
    >
      A
    </div>
  );
}
