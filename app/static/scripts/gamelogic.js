// Config options
const targetFrameRate = 144;
const saveInterval = 5000;
const numUpdatesForPanic = 300;

const timeStep = 1000/targetFrameRate;

// For the Gameloop:
let lastTime = null;
let totalTime = loadTime();
let timeOfLastSave = 0;
let accumulatedLag = 0;
let numberOfUpdates = 0;

// Money:
let points = 0;
let pointsElement = document.getElementById("points");
let pointsPerSecondElement = document.getElementById("pointsPerSecond");

// Building Amounts:
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

// Save the time when the player exits.
window.addEventListener("beforeunload", () => saveTime(totalTime));

function saveGame() {
  // Todo: Implement game save functionality.
  console.log("The game has saved.");
}

function updateGame(deltaTime, totalTime) {
  const timeSinceLastSave = totalTime - timeOfLastSave;
  if (timeSinceLastSave >= saveInterval) {
    saveGame();
    timeOfLastSave = totalTime;
  }
  points += buildingAPerMS * deltaTime;
  points += buildingBPerMS * deltaTime;
}

function render() {
  pointsElement.innerText = points.toFixed(2);
}

// The gameloop runs ${targetFrameRate} times per second.
function gameLoop(currentTime) {
  // More accurate than Date.now() according to some guy on github.
  // const currentTime = performance.now();
  if (lastTime === null) {
    lastTime = currentTime;
  }
  const deltaTime = currentTime - lastTime;
  totalTime += deltaTime;
  accumulatedLag += deltaTime;
  lastTime = currentTime;
  
  while (accumulatedLag >= timeStep) {
    accumulatedLag -= timeStep;
    updateGame(timeStep, totalTime);
  }
  render();

  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

console.log("Game started.");
