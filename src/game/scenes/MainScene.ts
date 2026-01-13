import { Scene } from 'phaser';
import { Unit } from '../objects/Unit';

export class MainScene extends Scene {
    private playerUnits!: Phaser.Physics.Arcade.Group;
    private enemyUnits!: Phaser.Physics.Arcade.Group;
    private enemySpawnTimer: number = 0;
    private readonly ENEMY_SPAWN_INTERVAL = 3000; // 3 seconds

    constructor() {
        super('MainScene');
    }

    preload() {
        // Create specific placeholder textures
        const graphics = this.make.graphics({ x: 0, y: 0, add: false } as any); // Type assertion to bypass strict check if needed or just remove 'add' if invalid
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 32, 64);
        graphics.generateTexture('unit_placeholder', 32, 64);
    }

    create() {
        // ... (Background/Ground code unchanged) ...
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB).setOrigin(0);
        const groundHeight = 100;
        const groundY = this.scale.height - groundHeight;
        this.add.rectangle(0, groundY, this.scale.width, groundHeight, 0x228B22).setOrigin(0);
        this.add.rectangle(50, groundY - 40, 80, 80, 0x0000FF).setOrigin(0.5, 1);
        this.add.rectangle(this.scale.width - 50, groundY - 40, 80, 80, 0x8B0000).setOrigin(0.5, 1);

        this.playerUnits = this.physics.add.group({ classType: Unit, runChildUpdate: true });
        this.enemyUnits = this.physics.add.group({ classType: Unit, runChildUpdate: true });

        this.game.events.on('SPAWN_PLAYER', () => { 
            this.spawnUnit('player'); 
        });
        this.physics.add.overlap(this.playerUnits, this.enemyUnits, this.handleUnitCollision, undefined, this);
        this.add.text(10, 10, 'Phase 2: Core Mechanics', { color: '#000', fontSize: '18px' });
    }

    update(time: number, delta: number) {
        this.enemySpawnTimer += delta;
        if (this.enemySpawnTimer >= this.ENEMY_SPAWN_INTERVAL) {
            console.log('MainScene: Spawning Enemy (Timer)');
            this.spawnUnit('enemy');
            this.enemySpawnTimer = 0;
        }

        this.playerUnits.children.each((child: any) => {
            const unit = child as Unit;
            if (unit.active) unit.walk();
            return true; // Return true to continue iteration
        });
        this.enemyUnits.children.each((child: any) => {
             const unit = child as Unit;
             if (unit.active) unit.walk();
             return true; // Return true to continue iteration
        });
    }

    private spawnUnit(team: 'player' | 'enemy') {
        const groundY = this.scale.height - 100; // Top of the ground
        let x = team === 'player' ? 100 : this.scale.width - 100;
        
        let group = team === 'player' ? this.playerUnits : this.enemyUnits;
        let unit = new Unit(this, x, groundY, team);
        group.add(unit);
        
        // Random slight Y variation to avoid Z-fighting look or perfect stacking
        unit.y += Phaser.Math.Between(-5, 5); 
    }

    private handleUnitCollision(playerUnit: any, enemyUnit: any) {
        const pUnit = playerUnit as Unit;
        const eUnit = enemyUnit as Unit;

        if (pUnit.active && eUnit.active) {
            pUnit.stopMoving();
            eUnit.stopMoving();

            const damagePerFrame = 0.5; 
            pUnit.takeDamage(damagePerFrame);
            eUnit.takeDamage(damagePerFrame);
        }
    }
}
