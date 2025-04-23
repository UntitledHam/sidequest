export class building {
  constructor(name, numberOwned, baseCost) {
    this.numberOwned = numberOwned;
    this.name = name;
    this.baseCost = baseCost;
  }

  buyMore(numberToBuy) {
    this.numberOwned += numberToBuy;
  }

  getNumOwned() {
    return this.numberOwned;
  }

  setNumOwned(newNumberOwned) {
    this.numberOwned = newNumberOwned;
  }

  calculateCost() {
    return Math.floor(this.baseCost * Math.pow(1.15, this.numberOwned));
  }
}
