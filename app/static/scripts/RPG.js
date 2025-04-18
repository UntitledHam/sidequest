import {building} from './building.js';
export class RPG extends building {

    constructor(name,numberOwned) {
        super(name, numberOwned);
        this.timeOfLastCheck = 0;
        this.threshhold = 1;
        this.bonus = 1000;
        this.interval = 13000;
    }

    getChange(time,delta){
        //This is the integral of a sine function over time. Its complicated but it should respond to deltatime correctly. 
        let currentValue = Math.cos(((2 * Math.PI)*(time+delta)/this.interval));
        let lastValue = Math.cos(((2 * Math.PI)*(time)/this.interval));
        return this.bonus * (delta-((currentValue - lastValue)*(this.interval/(2*Math.PI))));
        
    }

    update(deltaTime) {
        let ans = this.getChange(this.timeOfLastCheck,deltaTime);
        this.timeOfLastCheck += deltaTime;
        //console.log('RPG');
        //console.log(ans);
        return this.numberOwned * ans;

        }

    }

