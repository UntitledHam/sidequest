import {building} from './building.js';
export class monkeys extends building {

    constructor(name,numberOwned) {
        super(name, numberOwned);
        this.timeSinceLastWord = 0;
        this.threshhold = 0.9;
        this.bonus = 700;
        this.interval = 100;
    }



    update(deltaTime) {
        this.timeSinceLastWord += deltaTime;

        if ((this.timeSinceLastWord > this.interval) && (Math.random() < this.threshhold)) {
            this.timeSinceLastWord -= this.interval;
            return this.bonus * this.numberOwned;
        }
        else {
            return 0;
        }

    }

}