

export class building {
  constructor(name, numberOwned, baseCost) {
    this.numberOwned = numberOwned;
    this.name = name;
    this.baseCost = baseCost;
    this.cost = this.calculateCost();
  }

  buyMore(numberToBuy) {
    //This is the function that lets as user buy a building
    this.numberOwned += numberToBuy;
  }

  getNumOwned() {
    // returns the number of a building owned
    return this.numberOwned;
  }

  setNumOwned(newNumberOwned) {
    //sets the number of items owned. 
    this.numberOwned = newNumberOwned;
    this.cost = this.calculateCost();
  }

  getCost() {
    // returns the cost of a building
    return this.cost;
  }

  calculateCost() {
    // calculates the cost of the building
    return Math.floor(this.baseCost * Math.pow(1.15, this.numberOwned));
  }
}
