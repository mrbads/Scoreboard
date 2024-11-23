'use client'

import { Button, Card, CardBody, CardHeader, Input, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import ScoreBoard from "./components/ScoreBoard";
import TeamScore from "./components/TeamScore";
import Formation from "./formation/page";

export default function Home() {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);
  const players = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"];
  const [startingMinutes, setStartingMinutes] = useState(0);
  const [halfLength, setHalfLength] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [goalScored, setGoalScored] = useState(false);
  const [showScoreBoard, setShowScoreBoard] = useState(true);

  const incrementScore1 = () => {
    setScore1(prev => Math.max(0, prev + 1));
    setGoalScored(true);
    setTimeout(() => setGoalScored(false), 10000);
  }
  const decrementScore1 = () => {
    setScore1(prev => Math.max(0, prev - 1));
    setGoalScored(false);
  }
  const incrementScore2 = () => {
    setScore2(prev => Math.max(0, prev + 1));
    setGoalScored(true);
    setTimeout(() => setGoalScored(false), 10000);
  }
  const decrementScore2 = () => {
    setScore2(prev => Math.max(0, prev - 1));
    setGoalScored(false);
  }

  return (
    <div className="container mx-auto">
      {
        showScoreBoard ?
          <ScoreBoard score1={score1} score2={score2} halfLength={halfLength} startingMinutes={startingMinutes} isRunning={isRunning} setIsRunning={setIsRunning} goalScored={goalScored} timerReset={resetTimer} setTimerReset={setResetTimer} />
          :
          <Formation />
      }
      <div className="pt-32">
        <p>Controls</p>
        <div className="grid grid-cols-3 gap-2">
          <Card>
            <CardHeader>
              <p>Algemeen</p>
            </CardHeader>
            <CardBody>
              <Button onClick={() => {setStartingMinutes(0); setIsRunning(!isRunning); }}>{isRunning ? "Stop" : "Start"}</Button>
              <Button onClick={() => {setStartingMinutes(halfLength); setIsRunning(!isRunning); }}>{isRunning ? "Stop" : "Start"} second half</Button>
              <Input type="number" label="HalfLength" labelPlacement="inside" value={halfLength.toString()} onValueChange={(value) => setHalfLength(parseInt(value))} />
              <Button onClick={() => {setResetTimer(true)}}>Reset timer</Button>
              <Button onClick={() => {setScore1(0); setScore2(0); setGoalScored(false);}}>Reset score</Button>
              <Button onPress={() => setShowScoreBoard(!showScoreBoard)}>Switch to {showScoreBoard ? "Formation" : "ScoreBoard"}</Button>
            </CardBody>
          </Card>
          <TeamScore title="thuis" score={score1} incrementScore={incrementScore1} decrementScore={decrementScore1} resetScore={() => setScore1(0)} />
          <TeamScore title="uit" score={score2} incrementScore={incrementScore2} decrementScore={decrementScore2} resetScore={() => setScore2(0)} />
        </div>
      </div>
      {SetFormation({players})}
    </div>
  )
}

function SetFormation({players} : {players : string[]}) {
  const playerItems = players.map((player) => ({label: player, value: player}));
  const [value, setValue] = useState(new Set([]));
  return (
      <>
          <Select
          items={playerItems}
          selectionMode="multiple"
          selectedKeys={value}
          onSelectionChange={setValue}
          >
              {(player) => <SelectItem key={player.value}>{player.label}</SelectItem>}
          </Select>
          <p>{value}</p>
      </>
  )
}