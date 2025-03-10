'use client'

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
    const [teamAScore, setTeamAScore] = useState(0);
    const [teamBScore, setTeamBScore] = useState(0);
    const [wedstrijdcode, setWedstrijdcode] = useState(null);
    const [teamAName, setTeamAName] = useState("Team A");
    const [teamBName, setTeamBName] = useState("Team B");
    const [teamALogo, setTeamALogo] = useState("/default-logo.svg");
    const [teamBLogo, setTeamBLogo] = useState("/default-logo.svg");
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [startMinute, setStartMinute] = useState(0);
    const [endMinute, setEndMinute] = useState(45); // default end minute

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/scoreboard');
            const { teamAScore, teamBScore, wedstrijdcode } = await res.json();
            setTeamAScore(teamAScore);
            setTeamBScore(teamBScore);
            setWedstrijdcode(wedstrijdcode);
        }

        fetchData();

        const ws = new WebSocket('ws://localhost:8080');
        ws.onmessage = (event) => {
            const {type, data} = JSON.parse(event.data);
            if (type === 'scoreboardUpdated') {
                setTeamAScore(data.teamAScore);
                setTeamBScore(data.teamBScore);
            } else if (type === 'timerControl') {
                if (data.action === 'start') {
                    setStartMinute(data.startMinute);
                    setEndMinute(data.endMinute);
                    setTimer(data.startMinute * 60);
                    setIsRunning(true);
                } else if (data.action === 'stop') {
                    setIsRunning(false);
                    setTimer(0);
                }
            } else if (type === 'wedstrijdcodeUpdated') {
                setWedstrijdcode(data.wedstrijdcode);
            }
        };

        return () => ws.close();
    }, []);

    useEffect(() => {
        const fetchSportlinkData = async () => {
            const res = await fetch(`/api/sportlink?wedstrijdcode=${wedstrijdcode}`);
            const data = await res.json();
            if (data) {
                setTeamAName(data.thuisteam.naam);
                setTeamBName(data.uitteam.naam);
                setTeamALogo(`https://logoapi.voetbal.nl/logo.php?clubcode=${data.thuisteam.code}`);
                setTeamBLogo(`https://logoapi.voetbal.nl/logo.php?clubcode=${data.uitteam.code}`);
            }
        };

        if (wedstrijdcode) {
            fetchSportlinkData();
        }
    }, [wedstrijdcode]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isRunning) {
                setTimer((prevTimer) => (prevTimer < endMinute * 60 ? prevTimer + 1 : endMinute * 60));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, endMinute, startMinute]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Image src="/sponsor-top-banner.svg" alt="Sponsor Top Banner" width={728} height={90} />
            <main className="flex justify-between items-center w-full max-w-2xl">
                <div className="flex flex-col items-center gap-2">
                    <Image src={teamALogo} alt="Team A logo" width={200} height={200} />
                    <span className="text-2xl font-bold">{teamAName}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-xl font-semibold">{formatTime(timer)}</div>
                    <span className="text-2xl font-bold">{teamAScore} - {teamBScore}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Image src={teamBLogo} alt="Team B logo" width={200} height={200} />
                    <span className="text-2xl font-bold">{teamBName}</span>
                </div>
            </main>
            <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
                <Image src="/sponsor-bottom-banner.svg" alt="Sponsor Bottom Banner" width={728} height={90} />
            </footer>
        </div>
    );
}