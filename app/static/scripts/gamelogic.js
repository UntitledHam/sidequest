import building from './building.js';
let testbuilng = building(0);

// Config options
const targetFrameRate = 60;
const saveInterval = 5000;
const fpsValuesToAverage = 10; 

let pointsPerMS = 0;
let timeSinceLastBox = 500;

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

let pointsElement = document.getElementById("points");
let pointsPerSecondElement = document.getElementById("pointsPerSecond");
let fpsCounterElement = document.getElementById("fpsDisplay");
let buttonElement = document.getElementById("gup");
buttonElement.addEventListener("click", () => pointsPerMS+= 0.001);

// Building Amounts (amount per millisecond):
const buildingAPerMS = 0.001;
const buildingBPerMS = 0.003;


function loadTime() {
  const time = window.localStorage.getItem("total_time");

  if (time) {
    return parseFloat(time);
  } 
  return 0;
}

function saveTime(time) {
  window.localStorage.setItem("total_time", time);
}

function saveGame() {
  // Todo: Implement game save functionality.
  console.log("The game has \"saved\".");
}

// Save the time when the player exits.
window.addEventListener("beforeunload", () => saveTime(totalTime));

function skinnerBox(){
  let threshhold = 0.5;
  let bonus = 1000;
  if(Math.random()<threshhold)
    points += bonus;
}

function getProductionPerMs() {
  return pointsPerMS;
}

// The gameloop.
function gameLoop(currentTime) {
  if (lastTime === null) {
    lastTime = currentTime;
  }
  // Get time since the last time run.
  const deltaTime = currentTime - lastTime;
  totalTime += deltaTime;
  accumulatedLag += deltaTime;
  lastTime = currentTime;
  
  while (accumulatedLag >= timeStep) {
    accumulatedLag -= timeStep;
    updateGame(timeStep, totalTime);
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

function updateGame(deltaTime, totalTime) {
  const timeSinceLastSave = totalTime - timeOfLastSave;
  if (timeSinceLastSave >= saveInterval) {
    saveGame();
    timeOfLastSave = totalTime;
  }
  oldPoints = points;
  points += getProductionPerMs() * deltaTime;
  timeSinceLastBox += deltaTime;
  if (timeSinceLastBox > 1000){
    skinnerBox();
    timeSinceLastBox -= 1000;
    console.log()
  }

}

function render(interp) {
  const interpPoints = lerp(oldPoints, points, interp);
  pointsElement.innerText = interpPoints.toFixed(1);
  pointsPerSecondElement.innerText = `${(getProductionPerMs() * 1000).toFixed(1)} per second.`;
  fpsCounterElement.innerText = `FPS: ${fps.toFixed(1)}`;
}

function lerp(oldVal, newVal, percentage) {
  return oldVal * (1 - percentage) + newVal * percentage;
}

// Start the gameloop.
requestAnimationFrame(gameLoop);

console.log("Game started.");
