import { simpleBuilding } from "./simpleBuilding.js";

export class gup extends simpleBuilding {
  constructor(numOwned, baseCost) {
    const amountPerSecond = 1;
    super("gup", amountPerSecond, numOwned, baseCost)
  }
}
