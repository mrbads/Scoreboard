'use client'

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Button } from '@heroui/react';

export default function Controls() {
    const [teamA, setTeamA] = useState('Team A');
    const [teamAScore, setTeamAScore] = useState(0);
    const [teamB, setTeamB] = useState('Team B');
    const [teamBScore, setTeamBScore] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [programma, setProgramma] = useState(null);

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
            const prog = await fetch("https://data.sportlink.com/programma?gebruiklokaleteamgegevens=NEE&eigenwedstrijden=JA&thuis=JA&uit=NEE&aantaldagen=6&client_id=4h70DmVVZX");
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

    const sendTimerControl = (action: 'start' | 'pause' | 'stop') => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'timerControl', data: { action } }));
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
        <div className="flex flex-col items-center gap-4 p-4">
            <Card>
                <CardHeader>
                    <h2>{teamA}</h2>
                </CardHeader>
                <CardBody>
                    <div className="flex gap-2">
                        <Button onPress={() => increaseScore('A')}>+</Button>
                        <p>{teamAScore}</p>
                        <Button onPress={() => decreaseScore('A')}>-</Button>
                    </div>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <p className="h2">{teamB}</p>
                </CardHeader>
                <CardBody>
                    <div className="flex gap-2">
                        <Button onPress={() => increaseScore('B')}>+</Button>
                        <p>{teamBScore}</p>
                        <Button onPress={() => decreaseScore('B')}>-</Button>
                    </div>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <h2>General</h2>
                </CardHeader>
                <CardBody>
                    <Button onPress={resetScore}>Reset scores</Button>
                </CardBody>
            </Card>
            <Card>
                <CardHeader>
                    <p className="h2">Timer</p>
                </CardHeader>
                <CardBody>
                    <p>{timer}s</p>
                    <Button onPress={() => sendTimerControl('start')}>Start</Button>
                    <Button onPress={() => sendTimerControl('pause')}>Pause</Button>
                    <Button onPress={() => sendTimerControl('stop')}>Stop</Button>
                </CardBody>
            </Card>
            <Card>
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
                                <tr key={wedstrijd.id}>
                                    <td>{wedstrijd.datum}</td>
                                    <td>{wedstrijd.tijd}</td>
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