const targetFrameRate = 60;

let points = 0;
let pointsElement = document.getElementById("points");
let pointsPerSecondElement = document.getElementById("pointsPerSecond");
let lastTime = null;
let totalTime = 0;

const buildingAPerMS = 0.001;
const buildingBPerMS = 0.003;

function updateGame(deltaTime, totalTime) {
  points += buildingAPerMS * deltaTime;
  points += buildingBPerMS * deltaTime;
  // Truncate to 2 decimal places.
  pointsElement.innerText=points.toFixed(2);
  pointsPerSecondElement.innerText = `Per second or whatever...`; 
}

// The gameloop runs ${targetFrameRate} times per second.
setInterval(function gameloop() {
  const currentTime = Date.now();
  if (lastTime === null) {
    lastTime = currentTime;
  }
  const deltaTime = currentTime - lastTime;
  totalTime+=deltaTime;
  lastTime = currentTime;
  updateGame(deltaTime, totalTime);

}, 1000/targetFrameRate);

console.log("Game started.");
