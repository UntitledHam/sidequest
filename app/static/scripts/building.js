export class building {
  constructor(name, numberOwned) {
    this.numberOwned = numberOwned;
    this.name = name;
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
}
