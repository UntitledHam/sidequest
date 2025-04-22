import { building } from "./building.js";
export class monkey extends building {
  constructor(numberOwned, baseCost) {
    super("monkey", numberOwned, baseCost);
    this.timeSinceLastWord = 0;
    this.threshhold = 0.9;
    this.bonus = 700;
    this.interval = 100;
  }

  update(deltaTime) {
    if (this.numberOwned == 0) {
      return 0;
    }

    this.timeSinceLastWord += deltaTime;

    if (this.timeSinceLastWord > this.interval && Math.random() < this.threshhold) {
      this.timeSinceLastWord -= this.interval;
      return this.bonus * this.numberOwned;
    }
    else {
      return 0;
    }
  }
}
