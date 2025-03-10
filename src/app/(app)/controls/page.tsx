'use client'

import { useState, useEffect } from "react";
import {Card, CardHeader, CardBody, Button, ButtonGroup, Input} from '@heroui/react';

export default function Controls() {
    const [teamA, setTeamA] = useState('Team A');
    const [teamAScore, setTeamAScore] = useState(0);
    const [teamB, setTeamB] = useState('Team B');
    const [teamBScore, setTeamBScore] = useState(0);
    const [programma, setProgramma] = useState(null);
    const [startMinute, setStartMinute] = useState(0);
    const [endMinute, setEndMinute] = useState(45); // default end minute

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/scoreboard');
            const { teamAScore, teamBScore } = await res.json();
            setTeamAScore(teamAScore);
            setTeamBScore(teamBScore);
        }

        fetchData();

        const ws = new WebSocket('ws://localhost:8080');
        ws.onmessage = (event) => {
            const {type, data} = JSON.parse(event.data);
            if (type === 'scoreboardUpdated') {
                setTeamAScore(data.teamAScore);
                setTeamBScore(data.teamBScore);
            }
        };

        return () => ws.close();
    }, []);

    useEffect(() => {
        const fetchProgramma = async () => {
            const prog = await fetch("/api/sportlink?programma=true");
            const data = await prog.json();
            setProgramma(data);
        };

        fetchProgramma();
    }, []);

    const updateScoreboard = async (teamAScore: number, teamBScore: number) => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'updateScoreboard', data: { teamAScore, teamBScore } }));
            ws.close();
        }
        await fetch('/api/scoreboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamAScore, teamBScore }),
        });
    };

    const sendTimerControl = (action: 'start' | 'stop', startMinute: number, endMinute: number) => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            const data = { action, startMinute, endMinute };
            ws.send(JSON.stringify({ type: 'timerControl', data }));
            ws.close();
        }
    };

    const increaseScore = (team: 'A' | 'B') => {
        if (team === 'A') {
            setTeamAScore((prevScore) => {
                const newScore = prevScore + 1;
                updateScoreboard(newScore, teamBScore);
                return newScore;
            });
        } else {
            setTeamBScore((prevScore) => {
                const newScore = prevScore + 1;
                updateScoreboard(teamAScore, newScore);
                return newScore;
            });
        }
    };

    const decreaseScore = (team: 'A' | 'B') => {
        if (team === 'A' && teamAScore > 0) {
            setTeamAScore((prevScore) => {
                const newScore = prevScore - 1;
                updateScoreboard(newScore, teamBScore);
                return newScore;
            });
        } else if (team === 'B' && teamBScore > 0) {
            setTeamBScore((prevScore) => {
                const newScore = prevScore - 1;
                updateScoreboard(teamAScore, newScore);
                return newScore;
            });
        }
    };

    const resetScore = () => {
        setTeamAScore(0);
        setTeamBScore(0);
        updateScoreboard(0, 0);
    }

    const selectWedstrijd = async (wedstrijdcode: string, thuisteam: string, uitteam: string) => {
        setTeamA(thuisteam);
        setTeamB(uitteam);
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'wedstrijdcode', data: { wedstrijdcode } }));
            ws.close();
        }
        await fetch('/api/scoreboard', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wedstrijdcode }),
        });

    }

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <Card>
                <CardHeader>
                    <h2>{teamA}</h2>
                </CardHeader>
                <CardBody>
                    <ButtonGroup fullWidth={true}>
                        <Button onPress={() => decreaseScore('A')}>-</Button>
                        <Button>{teamAScore}</Button>
                        <Button onPress={() => increaseScore('A')}>+</Button>
                    </ButtonGroup>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <p className="h2">{teamB}</p>
                </CardHeader>
                <CardBody>
                    <ButtonGroup fullWidth={true}>
                        <Button onPress={() => decreaseScore('B')}>-</Button>
                        <Button>{teamBScore}</Button>
                        <Button onPress={() => increaseScore('B')}>+</Button>
                    </ButtonGroup>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <p className="h2">Klok</p>
                </CardHeader>
                <CardBody className={"gap-2"}>
                    <Button onPress={() => {sendTimerControl('start', 0, 45); setStartMinute(0); setEndMinute(45);}}>Start 0-45</Button>
                    <Button onPress={() => {sendTimerControl('start', 45, 90); setStartMinute(45); setEndMinute(90);}}>Start 45-90</Button>
                    <Button onPress={() => sendTimerControl('start', startMinute, endMinute)}>Start</Button>
                    <Button onPress={() => sendTimerControl('stop', startMinute, endMinute)}>Stop</Button>
                    <div className={"flex gap-2"}>
                        <Input
                            type="number"
                            value={startMinute.toString()}
                            onChange={(e) => setStartMinute(Number(e.target.value))}
                            label="Start Minute"
                            labelPlacement={"outside"}
                        />
                        <Input
                            type="number"
                            value={endMinute.toString()}
                            onChange={(e) => setEndMinute(Number(e.target.value))}
                            label="End Minute"
                            labelPlacement={"outside"}
                            validate={(value) => Number(value) > startMinute ? true : null}
                            isInvalid={endMinute <= startMinute}
                        />
                    </div>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <h2>Algemeen</h2>
                </CardHeader>
                <CardBody>
                    <Button onPress={resetScore}>Reset scores</Button>
                </CardBody>
            </Card>
            <Card className={"col-span-2"}>
                <CardHeader>
                    <h2>Programma</h2>
                </CardHeader>
                <CardBody>
                    {programma ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Home Team</th>
                                <th>Away Team</th>
                                <th>Game code</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {programma.map((wedstrijd) => (
                                <tr key={wedstrijd.wedstrijdcode}>
                                    <td>{wedstrijd.datum}</td>
                                    <td>{wedstrijd.aanvangstijd}</td>
                                    <td>{wedstrijd.thuisteam}</td>
                                    <td>{wedstrijd.uitteam}</td>
                                    <td>{wedstrijd.wedstrijdcode}</td>
                                    <td><Button onPress={() => selectWedstrijd(wedstrijd.wedstrijdcode, wedstrijd.thuisteam, wedstrijd.uitteam)}>Select</Button></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}