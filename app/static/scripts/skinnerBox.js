import { building } from "./building.js";
export class skinnerBox extends building {
  constructor(numberOwned, baseCost) {
    super("skinnerbox", numberOwned, baseCost);
    this.timeSinceLastBox = 0;
    this.threshhold = 0.9;
    this.bonus = 1;
    this.interval = 1000;
  }

  update(deltaTime) {
    
    if (this.numberOwned == 0) {
      return 0;
    }

    this.timeSinceLastBox += deltaTime;

    if (this.timeSinceLastBox > this.interval && Math.random() < this.threshhold) {
      this.timeSinceLastBox -= this.interval;
      return this.bonus * this.getNumOwned();
      
    }
    else {
      return 0;
    }
  }
}
