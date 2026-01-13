import { Scene } from 'phaser';

export class Unit extends Phaser.GameObjects.Rectangle {
    public body!: Phaser.Physics.Arcade.Body; // Explicitly type the body
    public hp: number;
    public maxHp: number;
    public damage: number;
    public speed: number;
    public team: 'player' | 'enemy';
    public isMoving: boolean;

    constructor(scene: Scene, x: number, y: number, team: 'player' | 'enemy') {
        // Size: 32x64, Color: Green (Player) or Red (Enemy)
        const color = team === 'player' ? 0x00ff00 : 0xff0000;
        super(scene, x, y, 32, 64, color);
        
        this.team = team;
        
        // Stats
        this.maxHp = 100;
        this.hp = this.maxHp;
        this.damage = 10;
        this.speed = 100; // Pixels per second
        this.isMoving = true;

        // Visuals
        this.setOrigin(0.5, 1); // Pivot at bottom center

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Physics Body Settings
        // In Phaser 3, adding a Game Object to physics creates the body. 
        // We cast it to ensure TypeScript knows it's an Arcade Body.
        this.body.setCollideWorldBounds(true);
        
        console.log(`Unit created: ${team} at ${x},${y} with color ${color.toString(16)}`);
    }

    update(time: number, delta: number) {
        if (!this.active) return;
        
        if (this.isMoving) {
            if (this.team === 'player') {
                this.body.setVelocityX(this.speed);
            } else {
                this.body.setVelocityX(-this.speed);
            }
        } else {
            this.body.setVelocityX(0);
        }
    }

    takeDamage(amount: number) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.destroy();
        }
    }

    stopMoving() {
        this.isMoving = false;
        this.body.setVelocityX(0);
    }

    walk() {
        this.isMoving = true;
    }
}
