"use client";

import { useEffect, useRef } from 'react';
import type { Game as PhaserGameType } from 'phaser'; // Import type only to be safe

export default function Game() {
    const gameRef = useRef<PhaserGameType | null>(null);

    useEffect(() => {
        async function initGame() {
            if (gameRef.current) return;

            // Dynamically import Phaser and Config to ensure they are only loaded on the client
            const Phaser = (await import('phaser')).default;
            const config = (await import('@/game/phaserGame')).default;

            gameRef.current = new Phaser.Game(config);
        }

        initGame();

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div id="game-container" style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
    );
}
