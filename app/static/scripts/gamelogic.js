import {skinnerBox} from './skinnerBox.js';
import { Save } from "./save.js";
import {monkey} from './monkeys.js';
import {RPG} from './RPG.js';
import { fetchJson } from './jsonUtils.js';
import { gup } from './gup.js';

let buildingJson;

let buildings = new Map();


let AbreviationList = ["Error","k","M","B","T","qd","Qn","sx","Sp","O","N","de","Ud","DD","tdD","qdD","QnD","sxD","SpD","OcD","NvD","Vgn","UVg","DVg","TVg","qtV","QnV","SeV","SPG","OVG","NVG","TGN","UTG","DTG","tsTG","qtTG","QnTG","ssTG","SpTG","OcTG","NoTG","QdDR","uQDR","dQDR","tQDR","qdQDR","QnQDR","sxQDR","SpQDR","OQDDr","NQDDr","qQGNT","uQGNT","dQGNT","tQGNT","qdQGNT","QnQGNT","sxQGNT","SpQGNT", "OQQGNT","NQQGNT","SXGNTL"];


const pointsHistory = [];
const timeHistory = [];

// Config options
const targetFrameRate = 60;
const saveInterval = 15000;
const fpsValuesToAverage = 10; 

let save;




const timeStep = 1000/targetFrameRate;

// For the Gameloop:
let lastTime = null;
let totalTime = loadTime();
let currentTime = 0;
let timeOfLastSave = 0;
let accumulatedLag = 0;
let fpsThisFrame = 0;
let frameCount = 0;
let totalFPS = 0;
let fps = targetFrameRate;

// Money:
let points = 0;
let oldPoints = 0;
let totalPoints = 0;


//get the elements for the tutorial
let taskBox = document.getElementById("TaskBox");
let tutorialSpot = 0;


//Money per second Tracking
let pointsPerMS = 0;
let oldPointsPerMS = 0;

let pointsElement = document.getElementById("points");
let pointsPerSecondElement = document.getElementById("pointsPerSecond");
let fpsCounterElement = document.getElementById("fpsDisplay");
const stepButtonElement = document.getElementById("addStep");
const stepTextBox = document.getElementById("stepBox");
const stepNumberElement = document.getElementById("stepNum");
const stepListElement = document.getElementById("taskSteps");
const taskTitleElement = document.getElementById("taskTitle");
const taskDescriptionElement = document.getElementById("taskDescription");
const createTaskButtonElement = document.getElementById("createTaskButton");
const dueDateElement = document.getElementById("taskDueDate")
const taskListElement = document.getElementById("tasks")

let tempSteps = [];
function addStep() {
  if (stepTextBox.value == "") {
    return;
  }
  console.log(stepTextBox.value);
  stepNumberElement.innerText++;
  stepListElement.innerHTML += `<li>${stepTextBox.value}</li>`;
  tempSteps.push(stepTextBox.value);
  stepTextBox.value = "";
}
async function createTask() {
  let task = {};
  task.title = taskTitleElement.value; 
  task.duedate = dueDateElement.value;
  task.description = taskDescriptionElement.value;
  task.steps = tempSteps;
  taskTitleElement.value = "";
  dueDateElement.value = "";
  taskDescriptionElement.value = "";
  stepTextBox.value = "";
  save.data.tasks.push(task);
  stepListElement.innerHTML = "";
  stepNumberElement.innerText = "1";
  await showToast("Sucessfully created quest!", {type: "success"});
  // Pass in true to hide the notification.
  await saveGame(true);
  await loadTasks();

  console.log(task);
}


async function loadTasks() {
  taskListElement.innerHTML = "";
  for (let task of save.data.tasks.values()) {
    console.log(`Loading task: ${task.title}`)
    let stepHtml = "";
    if (task.hasOwnProperty("steps")) {
      for (let step of task.steps.values()) {
        stepHtml += `<li><small class="step">${step}</small></li>`
      }
    } 
    taskListElement.innerHTML += `
    <li class="list-group-item border" style="border-radius: 0">
      <div class="container">
        <div class="row">
          <div class="col-sm-8">
            <h5 class="fs-4 fw-bold text-start">${task.title}</h5>
          </div>
          <div class="col-sm-4">
            <p class="fs-6 text-end fst-italic">Due: ${new Date(task.duedate).toLocaleDateString()}</p>
          </div>
        </div>
        <div class="row text-start">
          <ul>
            ${stepHtml}
          </ul>
        </div>
      </div>
    </li>
    `; 
  }
}


stepButtonElement.addEventListener("click", () => addStep());
createTaskButtonElement.addEventListener("click", () => createTask());

async function updatePps(deltaTime){
  let len = pointsHistory.push(totalPoints);
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

function numberAbreviation(num){
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
  return `${(splitNumArray[0] * (10**(splitNumArray[1]%3))).toPrecision(4)}${AbreviationList[Math.round(splitNumArray[1]/3)]}`;

}
async function tutorial(){
  //console.log(document.getElementById("TaskBox"));
  //console.log(bootstrap.Popover.getInstance(taskBox)); // Should not be null
  switch(tutorialSpot){
    case 0:
      bootstrap.Popover.getInstance(taskBox).show();
      tutorialSpot = 1;
      break;
    case 1:
      if(buildings.get("skinnerbox").getNumOwned() >=1){
        bootstrap.Popover.getInstance(taskBox).hide();
        tutorialSpot = 2;
      }
      break;
    case 2:
      break;
    default:
      console.log("TutorialSpot error Value is " + tutorialSpot);

  }
  
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

async function saveGame(silent=false) {
  timeOfLastSave = currentTime;
  await save.sendSave();
  console.log("The game has saved.");
  if (!silent) {
    await showToast("Game saved.", {type: "success"});
  }
}

// Save the time when the player exits.
window.addEventListener("beforeunload", async () => await saveTime(totalTime));


// The gameloop.
async function gameLoop(time) {
  currentTime = time;
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
    await updateGame(timeStep, currentTime);
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

async function updateBuildings(deltaTime) {
  for (let building of buildings.values()) {
   let deltaPoints = building.update(deltaTime);
   points += deltaPoints;
   totalPoints += deltaPoints;
  }
}

async function lockBuildings() {
  for (let [key, building] of buildings) {
    // If your'e a broke boy just say so.
    if (building.getCost() > points) {
      document.getElementById(key).disabled = true;
    }
    // Nah, i aint broke...
    else {
      document.getElementById(key).disabled = false;
    }
  }
}

async function updateGame(deltaTime, totalTime) {
  const timeSinceLastSave = totalTime - timeOfLastSave;
  if (timeSinceLastSave >= saveInterval) {
    await saveGame();
  }

  oldPoints = points;
  save.data.points = points;
  save.data.totalPoints = totalPoints;  
  
  await updatePps(deltaTime);
  await updateBuildings(deltaTime);
  await tutorial();
}

async function render(interp) {
  const interpPoints = await lerp(oldPoints, points, interp);
  const interpPPS = await lerp(oldPointsPerMS, pointsPerMS, interp);
  const pointsToDisplay = await numberAbreviation(interpPoints);
  pointsElement.innerText = pointsToDisplay;
  // pointsElement.getElementById("pointsInTooltip").innerText = pointsToDisplay;
  pointsPerSecondElement.innerText = `${await numberAbreviation(interpPPS * 1000)} satisfaction per second.`;
  fpsCounterElement.innerText = `FPS: ${fps.toFixed(1)}`;
  lockBuildings();
}

async function lerp(oldVal, newVal, percentage) {
  return oldVal * (1 - percentage) + newVal * percentage;
}

async function setBuildingCount(buildingKey, count) {
  const building = buildings.get(buildingKey);
  building.setNumOwned(count);
  save.data.buildings[buildingKey].amount = count;
  let buildingElement = document.getElementById(buildingKey);
  let amountElement = buildingElement.querySelector(".building-amount");
  let costElement = buildingElement.querySelector(".building-cost");
  amountElement.innerText = count;
  let cost = buildings.get(buildingKey).getCost();
  costElement.innerHTML = `<span style="color: var(--cost)">Cost:</span> ${numberAbreviation(cost)} satisfaction.`;
}

async function showToast(message, options = {}) {
  const { delay = 3000, type = 'info' } = options;
  const id = `toast-${Date.now()}`;

  const toastHTML = `
    <div id="${id}" class="toast align-items-center text-white border-${type} mb-2" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  const container = document.getElementById('toast-container');
  container.insertAdjacentHTML('beforeend', toastHTML);

  const toastEl = document.getElementById(id);
  const toast = new bootstrap.Toast(toastEl, { delay });
  toast.show();

  // Optionally clean it up when hidden
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

async function buyBuilding(buildingKey) {
  const building = buildings.get(buildingKey);
  const cost = building.getCost();
  if (points >= cost) {
    points -= cost;
    setBuildingCount(buildingKey, building.getNumOwned()+1);
  }
}

async function loadSave() {
  save = await Save.loadSave();
  if (save.data.hasOwnProperty("points")) {
    console.log("Saved points found.");
    oldPoints = save.data.points;
    points = save.data.points;
    if(save.data.hasOwnProperty("totalPoints")){
    totalPoints = save.data.totalPoints;
    }
    else{
      totalPoints = save.data.points;
    }
  }
  else {
    // Set this to zero when out of testing.
    points = 100000;
    totalPoints = 100000;
  }
  const buildingKeys = ["gup", "skinnerbox", "monkey", "rpg"]
  
  if (!save.data.hasOwnProperty("buildings")) { save.data.buildings = {}; }
  buildingKeys.forEach(buildingKey => {
    if (!save.data.buildings.hasOwnProperty(buildingKey)) {
      save.data.buildings[buildingKey] = {"amount": 0}
    }
  });

  if (!save.data.hasOwnProperty("tasks")) {
    save.data.tasks = []; 
  }

  buildings.set("skinnerbox", new skinnerBox(save.data.buildings.skinnerbox.amount, buildingJson.skinnerbox.baseCost));
  buildings.set("gup", new gup(save.data.buildings.gup.amount, buildingJson.gup.baseCost));
  buildings.set("monkey", new monkey(save.data.buildings.monkey.amount, buildingJson.monkey.baseCost));
  buildings.set("rpg", new RPG(save.data.buildings.rpg.amount, buildingJson.rpg.baseCost));
  await loadBuildingCounts();
  await loadTasks();
}

async function loadBuildingCounts() {
  const buildingElements = document.querySelectorAll(".building");

  buildingElements.forEach(element => {
    const amountElement = element.querySelector(".building-amount")
    const buildingId = element.getAttribute("id");
    const costElement = element.querySelector(".building-cost")
    amountElement.innerText = save.data.buildings[buildingId].amount;
    costElement.innerHTML = `<span style="color: var(--cost)">Cost:</span> ${numberAbreviation(buildings.get(buildingId).calculateCost())} satisfaction.`;
    element.addEventListener("click", async () => await buyBuilding(buildingId));
  });
}

async function startup() {
  // Load the save
  buildingJson = await fetchJson("/getbuildingjson")
  await loadSave();
  // Start the gameloop.
  requestAnimationFrame(gameLoop);

  // Add save hotkey.
  document.addEventListener('keydown', async (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      await saveGame();
    }
  });

  console.log("Game started.");
}

startup();
