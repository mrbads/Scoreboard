import Timer from "./Timer";

interface ScoreBoardProps {
    score1: number;
    score2: number;
    halfLength: number;
    startingMinutes: number;
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
    goalScored: boolean;
    timerReset: boolean;
    setTimerReset: (timerReset: boolean) => void;
}

export default function ScoreBoard( {score1, score2, halfLength, startingMinutes, isRunning, setIsRunning, goalScored, timerReset, setTimerReset}: ScoreBoardProps) {
    return(
        <>
            <div className="border-2">
                Sponsor banner
            </div>
            <div className="grid grid-cols-3 items-center">
                <div>
                    <p>Logo 1</p>
                    <p>Team 1</p>
                </div>
                <div>
                    <p>{score1} - {score2}</p>
                    {goalScored && <p>Goal!</p>}
                </div>
                <div>
                    <p>Logo 2</p>
                    <p>Team 2</p>
                </div>
                <div className="col-start-2">
                    <Timer halfLength={halfLength} startingMinutes={startingMinutes} isRunning={isRunning} setIsRunning={setIsRunning} reset={timerReset} setReset={setTimerReset} />
                </div>
            </div>
            <div className="border-2">
                Sponsor banner
            </div>
        </>
    )
}