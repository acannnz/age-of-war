import { Types } from 'phaser';
import { MainScene } from './scenes/MainScene';

const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.RESIZE, // Auto width/height handling
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // Top-down view logic (no falling gravity)
            debug: false
        }
    },
    scene: [MainScene]
};

export default config;
