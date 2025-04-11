class building {

    numberOwned;
    
    constructer(numberOwned){
        this.numberOwned = numberOwned;
    }

    buyMore(numberToBuy){
        this.numberOwned += numberToBuy;
    }

    getNumOwned(){
        return this.numberOwned;
    }
}