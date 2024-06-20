import { useEffect, useRef, useState } from "react";

export function useCountDown(
  total: number,
  ms: number = 1000,
  onCompleted: () => void
) {
  const [counter, setCountDown] = useState(total);
  const [startCountDown, setStartCountDown] = useState(true);
  // Store the created interval
  const intervalId = useRef<NodeJS.Timeout>();
  const start: () => void = () => setStartCountDown(true);
  const pause: () => void = () => setStartCountDown(false);
  const reset: () => void = () => {
    clearInterval(intervalId.current);
    setStartCountDown(false);
    setCountDown(total);
  };

  useEffect(() => {
    intervalId.current = setInterval(() => {
      startCountDown && counter > 0 && setCountDown((counter) => counter - 1);
    }, ms);
    // Clear interval when count to zero
    if (counter === 0) {
      clearInterval(intervalId.current);
      onCompleted();
    }
    // Clear interval when unmount
    return () => clearInterval(intervalId.current);
  }, [startCountDown, counter, ms, onCompleted]);

  const minutes = Math.floor(counter / 60) % 60;
  const seconds = counter % 60;
  const hours = Math.floor(minutes / 60);

  return { counter, start, pause, reset, minutes, seconds, hours };
}
