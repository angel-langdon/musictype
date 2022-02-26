import { Dispatch, SetStateAction, useRef } from "react";

interface LetterHeightProps {
  setHeigth: Dispatch<SetStateAction<number>>;
}
export default function LetterHeight(props: LetterHeightProps) {
  return (
    <div
      className="fixed"
      style={{ left: -1000 }}
      ref={(ref) => ref && props.setHeigth(ref.clientHeight)}
    >
      A
    </div>
  );
}
