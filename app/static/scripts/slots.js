import { building } from './building.js';
export class slots extends building {

    constructor(name, numberOwned) {
        super(name, numberOwned);
        this.numberOwned = numberOwned
        this.timeSinceLastBox = 0;
        this.threshhold = 0.01;
        this.bonus = 1000000;
        this.interval = 1000;
    }



    update(deltaTime) {
        this.timeSinceLastBox += deltaTime;

        if (this.timeSinceLastBox > this.interval) {
            this.timeSinceLastBox -= this;
            if (Math.random() < this.threshhold) {

                return this.bonus * this.numberOwned;
            }
            else{
                return 0;
            }
        }
        else {
            return 0;
        }

    }

}

