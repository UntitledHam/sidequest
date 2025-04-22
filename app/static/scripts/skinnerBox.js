import { building } from "./building.js";
export class skinnerBox extends building {
  constructor(numberOwned, baseCost) {
    super("skinnerbox", numberOwned, baseCost);
    this.numberOwned = numberOwned;
    this.timeSinceLastBox = 0;
    this.threshhold = 0.5;
    this.bonus = 1000;
    this.interval = 1000;
  }

  update(deltaTime) {
    if (this.numberOwned == 0) {
      return 0;
    }

    this.timeSinceLastBox += deltaTime;

    if (this.timeSinceLastBox > this.interval && Math.random() < this.threshhold) {
      this.timeSinceLastBox -= this;
      return this.bonus * this.numberOwned;
    }
    else {
      return 0;
    }
  }
}
