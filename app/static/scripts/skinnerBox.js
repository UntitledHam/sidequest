import { simpleBuilding } from "./simpleBuilding.js";
export class skinnerBox extends simpleBuilding {
  constructor(numberOwned, baseCost) {
    super("skinnerbox", 0.1, numberOwned, baseCost);
    // this.timeSinceLastBox = 0;
    // this.threshhold = 0.2;
    // this.bonus = 1;
    // this.interval = 1000;
  }

//   randomNum(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   }
//
//   update(deltaTime) {
//
//     if (this.numberOwned == 0) {
//       return 0;
//     }
//
//     this.timeSinceLastBox += deltaTime;
//
//     if (this.timeSinceLastBox > this.interval && Math.random() < this.threshhold) {
//       this.timeSinceLastBox -= this.interval;
//       return this.bonus * this.getNumOwned();
//
//     }
//     else {
//       return 0;
//     }
//   }
}
