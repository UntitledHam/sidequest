import {building} from './building.js';
export class skinnerBox extends building {

    constructor(name,numberOwned) {
        super(name, numberOwned);
        this.numberOwned = numberOwned
        this.timeSinceLastBox = 0;
        this.threshhold = 0.5;
        this.bonus = 1000;
        this.interval = 1000;
    }



    update(deltaTime) {
        this.timeSinceLastBox += deltaTime;

        if ((this.timeSinceLastBox > this.interval) && (Math.random() < this.threshhold)) {
            this.timeSinceLastBox -= this;
            return this.bonus * this.numberOwned;
        }
        else {
            return 0;
        }

    }

}

