export class building {
  constructor(name, numberOwned, baseCost) {
    this.numberOwned = numberOwned;
    this.name = name;
    this.baseCost = baseCost;
    this.cost = this.calculateCost();
  }

  buyMore(numberToBuy) {
    this.numberOwned += numberToBuy;
  }

  getNumOwned() {
    return this.numberOwned;
  }

  setNumOwned(newNumberOwned) {
    this.numberOwned = newNumberOwned;
    this.cost = this.calculateCost();
  }

  getCost() {
    return this.cost;
  }

  calculateCost() {
    return Math.floor(this.baseCost * Math.pow(1.15, this.numberOwned));
  }
}
