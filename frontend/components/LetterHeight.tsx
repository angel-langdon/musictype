import { Dispatch, SetStateAction } from "react";

interface LetterHeightProps {
  setHeigth: Dispatch<SetStateAction<number>>;
  textSize: string;
}
export default function LetterHeight(props: LetterHeightProps) {
  return (
    <div
      className={`fixed ${props.textSize}`}
      style={{ left: -1000 }}
      ref={(ref) => ref && props.setHeigth(ref.clientHeight)}
    >
      A
    </div>
  );
}
