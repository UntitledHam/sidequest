import {skinnerBox} from './skinnerBox.js';
import { Save } from "./save.js";
import {monkeys} from './monkeys.js';
import {RPG} from './RPG.js';
let testBox = new skinnerBox('testBox',1);
let testMonkey = new monkeys('testMonkey',1);
let testRPG  = new RPG('testRPG', 1);

let AbreviationList = ["Error","k","M","B","T","qd","Qn","sx","Sp","O","N","de","Ud","DD","tdD","qdD","QnD","sxD","SpD","OcD","NvD","Vgn","UVg","DVg","TVg","qtV","QnV","SeV","SPG","OVG","NVG","TGN","UTG","DTG","tsTG","qtTG","QnTG","ssTG","SpTG","OcTG","NoTG","QdDR","uQDR","dQDR","tQDR","qdQDR","QnQDR","sxQDR","SpQDR","OQDDr","NQDDr","qQGNT","uQGNT","dQGNT","tQGNT","qdQGNT","QnQGNT","sxQGNT","SpQGNT", "OQQGNT","NQQGNT","SXGNTL"];


const pointsHistory = [];
const timeHistory = [];

// Config options
const targetFrameRate = 60;
const saveInterval = 15000;
const fpsValuesToAverage = 10; 

let save = await Save.loadSave();




const timeStep = 1000/targetFrameRate;

// For the Gameloop:
let lastTime = null;
let totalTime = loadTime();
let timeOfLastSave = 0;
let accumulatedLag = 0;
let numberOfUpdates = 0;
let fpsThisFrame = 0;
let frameCount = 0;
let totalFPS = 0;
let fps = targetFrameRate;

// Money:
let points = 0;
let oldPoints = 0;

let gupCount = 0;

//Money per second Tracking
let pointsPerMS = 0;
let oldPointsPerMS = 0;

let pointsElement = document.getElementById("points");
let pointsPerSecondElement = document.getElementById("pointsPerSecond");
let fpsCounterElement = document.getElementById("fpsDisplay");
let buttonElement = document.getElementById("gup");
let gupCountElement = document.getElementById("gup-amount");

buttonElement.addEventListener("click", () => { 
  gupCount++;
  pointsPerMS+= 0.001;
  gupCountElement.innerText = gupCount; 
});


async function updatePps(deltaTime){
  let len = pointsHistory.push(points);
  if (len > 100){
    await pointsHistory.shift();
  }
  let len2 = timeHistory.push(deltaTime);
  if (len2 > 100){
    await timeHistory.shift();
  }
  let num = 0;
  let lastElement = pointsHistory[0];
  pointsHistory.forEach(element => {
    num += element - lastElement;
    lastElement = element;
  });
  let timeSince = 0;
  timeHistory.forEach(element => {timeSince += element;});
  oldPointsPerMS = pointsPerMS;
  pointsPerMS = (num/(timeSince));
}

async function numberAbreviation(num){
  //console.log(num);
  if (num<1000){
    return num.toFixed(1);
  }
  let truncatedNum = parseFloat(num.toPrecision(4));
  let expNum = truncatedNum.toExponential();
  let splitNumArray = expNum.split('e+');
  //console.log('Start Point');
  //console.log(splitNumArray[0]);
  //console.log((10**(splitNumArray[1]%3)));
  //console.log((splitNumArray[0] * (10**(splitNumArray[1]%3))));
  //console.log((splitNumArray[0] * (10**(splitNumArray[1]%3))).toPrecision(4));
  return `${(splitNumArray[0] * (10**(splitNumArray[1]%3))).toPrecision(4)}${AbreviationList[Math.floor(splitNumArray[1]/3)]}`;

}



async function loadTime() {
  const time = window.localStorage.getItem("total_time");

  if (time) {
    return parseFloat(time);
  } 
  return 0;
}

async function saveTime(time) {
  window.localStorage.setItem("total_time", time);
}

async function saveGame() {
  saveTime();
  await save.sendSave();
  console.log("The game has \"saved\".");
}

// Save the time when the player exits.
window.addEventListener("beforeunload", async () => await saveTime(totalTime));


// The gameloop.
async function gameLoop(currentTime) {
  if (lastTime === null) {
    lastTime = currentTime;
  }
  // Get time since the last time run.
  const deltaTime = currentTime - lastTime;
  // totalTime += deltaTime;
  accumulatedLag += deltaTime;
  lastTime = currentTime;
  
  while (accumulatedLag >= timeStep) {
    accumulatedLag -= timeStep;
    updateGame(timeStep, currentTime);
  }
  const interp = accumulatedLag / timeStep;
  fpsThisFrame = 1000 / deltaTime;
  frameCount++;
  totalFPS+=fpsThisFrame;
  if (frameCount >= fpsValuesToAverage) {
    fps = totalFPS / frameCount;
    // Stop it from displaying infinity:
    if (!isFinite(fps)) {
      fps = targetFrameRate;
    }
    totalFPS = 0;
    frameCount = 0;
  }
  render(interp);

  requestAnimationFrame(gameLoop);
}

async function updateGame(deltaTime, totalTime) {
  const timeSinceLastSave = totalTime - timeOfLastSave;
  if (timeSinceLastSave >= saveInterval) {
    await saveGame();
    timeOfLastSave = totalTime;
  }
  oldPoints = points;
  
  await updatePps(deltaTime);
  // points += testBox.update(deltaTime);
  // points += testMonkey.update(deltaTime);
  points += testRPG.update(deltaTime);
  
}

async function render(interp) {
  const interpPoints = await lerp(oldPoints, points, interp);
  const interpPPS = await lerp(oldPointsPerMS, pointsPerMS, interp);
  pointsElement.innerText = await numberAbreviation(interpPoints);
  pointsPerSecondElement.innerText = `${await numberAbreviation(interpPPS * 1000)} per second.`;
  fpsCounterElement.innerText = `FPS: ${fps.toFixed(1)}`;
}

async function lerp(oldVal, newVal, percentage) {
  return oldVal * (1 - percentage) + newVal * percentage;
}

// Start the gameloop.
requestAnimationFrame(gameLoop);

console.log("Game started.");
