

import { building } from "./building.js";
export class RPG extends building {
  constructor(numberOwned, baseCost) {
    super("rpg", numberOwned, baseCost);
    this.timeOfLastCheck = 0;
    this.threshhold = 1;
    this.bonus = 100;
    this.interval = 13000;
  }

  getChange(time, delta) {
    //This calculates the points using the integral over the deltatime interval of a sine wave
    //This will let the number of points vary over time.
    let currentValue = Math.cos((2 * Math.PI * (time + delta)) / this.interval);
    let lastValue = Math.cos((2 * Math.PI * time) / this.interval);
    return (
      this.bonus * (delta - (currentValue - lastValue) * (this.interval / (2 * Math.PI))));
  }

  update(deltaTime) {
    //Here is the update function that returns the number of points added this update
    let ans = this.getChange(this.timeOfLastCheck, deltaTime);
    this.timeOfLastCheck += deltaTime;
    return this.numberOwned * ans;
  }
}
