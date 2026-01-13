"use client";

import { useEffect, useRef, useState } from 'react';
import type { Game as PhaserGameType } from 'phaser';

export default function GameWrapper() {
    const gameRef = useRef<PhaserGameType | null>(null);
    const [isGameReady, setIsGameReady] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let game: PhaserGameType | null = null;

        async function initGame() {
            // Dynamically import Phaser and Config
            const Phaser = (await import('phaser')).default;
            const config = (await import('@/game/phaserGame')).default;

            if (!isMounted) return; // Prevent creation if unmounted

            console.log("GameWrapper: Creating Phaser Game...");
            game = new Phaser.Game(config);
            gameRef.current = game;
            setIsGameReady(true);
        }

        initGame();

        return () => {
            isMounted = false;
            if (game) {
                console.log("GameWrapper: Destroying Phaser Game...");
                game.destroy(true);
            }
            gameRef.current = null;
        };
    }, []);

    const handleSpawnPlayer = () => {
        if (gameRef.current) {
            gameRef.current.events.emit('SPAWN_PLAYER');
            console.log("Event SPAWN_PLAYER emitted");
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* UI Layer */}
            <div className="absolute top-0 left-0 w-full p-4 pointer-events-none z-10 flex justify-between items-start">
                <div className="bg-gray-800/80 text-yellow-400 font-bold px-4 py-2 rounded-lg border border-yellow-600 shadow-md backdrop-blur-sm">
                    Gold: 100
                </div>
                
                <button 
                    onClick={handleSpawnPlayer}
                    className="pointer-events-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform transition active:scale-95 border-b-4 border-blue-800"
                >
                    Spawn Bocil
                </button>
            </div>

            {/* Game Container */}
            <div id="game-container" className="absolute top-0 left-0 w-full h-full z-0"></div>
        </div>
    );
}
