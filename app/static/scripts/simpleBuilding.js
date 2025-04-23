import { building } from "./building.js";

export class simpleBuilding extends building {
  constructor(name, amountPerSecond, numberOwned, baseCost) {
    super(name, numberOwned, baseCost);
    this.amountPerMs = amountPerSecond / 1000;
  }
  
  update(deltaTime) {
    return this.numberOwned * deltaTime * this.amountPerMs
  }
}
