import { useEffect, useState } from "react";

interface TimerProps {
    halfLength: number;
    startingMinutes: number;
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    reset: boolean;
    setReset: (reset: boolean) => void;
}

export default function Timer( { halfLength, startingMinutes, isRunning, setIsRunning, reset, setReset} : TimerProps ) {
    const [timer, setTimer] = useState("00:00")

    useEffect(() => {
        if (isRunning) {
            let seconds = startingMinutes * 60;
            const interval = setInterval(() => {
                seconds++;
                const minutes = Math.floor(seconds/60);
                const remainingSeconds = seconds % 60;
                setTimer(`${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`);
                if (seconds >= 60 * (halfLength + startingMinutes)) {
                    setIsRunning(false);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, startingMinutes, halfLength, setIsRunning]);

    useEffect(() => {
        if (reset) {
            setTimer("00:00");
            setIsRunning(false);
            setReset(false);
        }
    }, [reset, setIsRunning, setReset]);

    return (
        <>
            {timer}
        </>
    )
}