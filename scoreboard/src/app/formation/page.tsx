'use client'

import { useEffect, useMemo, useState } from "react";

export default function Formation() {
    const players = useMemo(() => ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5", "Player 6", "Player 7", "Player 8", "Player 9", "Player 10", "Player 11"], []);

    const [currentPlayer, setCurrentPlayer] = useState(players[0]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % players.length);
        }, 1000);

        return () => clearInterval(interval);
    }, [players.length]);

    useEffect(() => {
        setCurrentPlayer(players[index]);
    }, [index, players])

    return (
        <div>
            {currentPlayer}
        </div>
    );
}