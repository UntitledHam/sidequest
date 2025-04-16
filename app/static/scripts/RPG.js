import {building} from './building.js';
export class RPG extends building {

    constructor(name,numberOwned) {
        super(name, numberOwned);
        this.timeOfLastCheck = 0;
        this.threshhold = 1;
        this.bonus = 1000;
        this.interval = 1000;
    }



    update(deltaTime) {
        this.timeOfLastCheck += deltaTime;
        let ans = this.bonus * (-(Math.cos((this.timeOfLastCheck)/this.interval)) + 1);
        return this.numberOwned * ans;
        }

    }
