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
const showFPSCounter = false;

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
const dueDateElement = document.getElementById("taskDueDate");
const taskListElement = document.getElementById("tasks");
const taskProgressElement = document.getElementById("taskProgressList");

let tempSteps = [];
function addStep() {
  if (stepTextBox.value == "") {
    return;
  }
  console.log(stepTextBox.value);
  stepNumberElement.innerText++;
  stepListElement.innerHTML += `<li>${stepTextBox.value}</li>`;
  tempSteps.push([stepTextBox.value,  false]);
  stepTextBox.value = "";
}

async function calculateAward(date, numberOfSteps) {
  // const currentDate = new Date(currentTime)
  // const dueDate = new Date(date); 
  // currentDate.setHours(0,0,0);
  // dueDate.setHours(0,0,0);
  // const msPast = (dueDate.getTime() - currentDate.getTime());
  // const award = 0.2 * (pointsPerMS * msPast + 10) * (numberOfSteps + 1); 
  // console.log(award);
  return 100;
}

async function createTask() {
  if (!validatePage2()) {
    alert("Please add a step!");
    return;
  }
  let task = {};
  task.title = taskTitleElement.value; 
  task.duedate = dueDateElement.value;
  task.description = taskDescriptionElement.value;
  task.steps = tempSteps;
  task.completedsteps = 0;
  task.completed = false;  
  task.award = await calculateAward(task.duedate, tempSteps.length);
  taskTitleElement.value = "";
  dueDateElement.value = "";
  taskDescriptionElement.value = "";
  stepTextBox.value = "";
  save.data.tasks.push(task);
  stepListElement.innerHTML = "";
  stepNumberElement.innerText = "1";
  tempSteps = [];
  await showToast("Sucessfully created quest!", {type: "success"});
  // Pass in true to hide the notification.
  await saveGame(true);
  await loadTasks();

  console.log(task);
}

function validatePage1() {
  if (taskTitleElement.value == "") {
    return false; 
  }
  else if (taskDescriptionElement.value == "") {
    return false;
  }
  else if (dueDateElement.value == "") {
    return false;
  }

  return true;
}

const nextBtn = document.getElementById('nextButton');
const prevBtn = document.getElementById('prevButton');
const finishBtn = document.getElementById('createTaskButton');

const page1 = document.getElementById('modalPage1');
const page2 = document.getElementById('modalPage2');

nextBtn.addEventListener('click', () => {
  if (!validatePage1()) {
    alert("Please fill out all of the fields.");
    return;
  }
  page1.style.display = 'none';
  page2.style.display = 'block';
  nextBtn.style.display = 'none';
  finishBtn.style.display = 'inline-block';
  prevBtn.style.display = 'inline-block';
});

prevBtn.addEventListener('click', () => {
  page1.style.display = 'block';
  page2.style.display = 'none';
  nextBtn.style.display = 'inline-block';
  finishBtn.style.display = 'none';
  prevBtn.style.display = 'none';
});

// Always reset to Page 1 when modal opens
const modal = document.getElementById('create-task-modal');
modal.addEventListener('show.bs.modal', () => {
  page1.style.display = 'block';
  page2.style.display = 'none';
  nextBtn.style.display = 'inline-block';
  finishBtn.style.display = 'none';
  prevBtn.style.display = 'none';
});


async function validatePage2() {
  return tempSteps.length > 0;
}


async function loadTasks() {
  taskListElement.innerHTML = "";
  taskProgressElement.innerHTML = "";

  if (save.data.tasks.length == 0) {
     taskProgressElement.innerHTML += `
      <div class="carousel-item active">
        <div class="container" style="width:70%">
          <h3><b>No Quests</b></h3>
          <small class="fs-6">Please create a Quest for it to display here.</small>
        </div>
      </div>
    `
    taskListElement.innerHTML += `
       <li class="list-group-item border" style="border-radius: 0">
        <div class="container">
          <div class="row">
            <div class="col-sm-8">
              <h5 class="fs-4 fw-bold text-start">No Quests</h5>
              <small class="fs-6">Please create a Quest for it to display here.</small>
            </div>
          </div>
        </div>
      </li>
    `
  }

  for (let x = save.data.tasks.length - 1; x >= 0; x--) {
    const task = save.data.tasks[x];
    if (!task || task.completed) continue;

    if (task.completedsteps === task.steps.length & !task.completed) {
      save.data.tasks[x].completed = true;
      save.data.completedtasks.push(task);
      save.data.tasks.splice(x, 1);
      console.log("Awarding points");
      points += task.award;
      totalPoints += task.award;
      console.log(`Points are now ${points}`)
      await saveGame(true);
      return loadTasks();
    }

    console.log(`Loading task: ${task.title}`);

    let stepHtml = "";
    if (Array.isArray(task.steps)) {
      for (let y = 0; y < task.steps.length; y++) {
        const step = task.steps[y];
        if (!step) continue;
        stepHtml += `<li><button id="task-${x}-step-${y}" class="btn invisible-btn step ${step[1] ? "disabled" : ""}">${step[0]}</button></li>`;
      }
    }
    
    taskListElement.innerHTML += `
      <li class="list-group-item border quest" style="border-radius: 0">
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
            <ul>${stepHtml}</ul>
          </div>
          <p>Awards: ${task.award}</p>
        </div>
      </li>
    `;
  
    let firstUncomplete = "";
    for (let step of task.steps) {
      if (!step[1]) {
        firstUncomplete = step[0];
        break;
      }
    }
    const progress = Math.floor(100 * (task.completedsteps / task.steps.length));
    taskProgressElement.innerHTML += `
      <div class="carousel-item ${taskProgressElement.innerHTML == "" ? "active":""}">
        <div class="container" style="width:70%">
          <h3><b>${task.title}</b></h3>
          <small class="fs-6">Next up: ${firstUncomplete}</small>
          <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="${progress}"
            aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar progress-bar-striped taskbar" style="width:${progress}%"></div>
          </div>
          <small>Awards: ${task.award}</small>
        </div>
      </div>
    `

  }

  setTimeout(() => {
    for (let x = 0; x < save.data.tasks.length; x++) {
      const task = save.data.tasks[x];
      if (!task || task.completed || !Array.isArray(task.steps)) continue;

      for (let y = 0; y < task.steps.length; y++) {
        const step = task.steps[y];
        if (!step) continue;

        const buttonId = `task-${x}-step-${y}`;
        const stepElement = document.getElementById(buttonId);
        if (!stepElement) continue;

        if (y == 0) {
          stepElement.parentElement.parentElement.parentElement.parentElement.parentElement.addEventListener("click", async() => {
            await displayTask(task);
          });
        }
        

        stepElement.addEventListener("click", async () => {
          const stepData = save.data.tasks[x].steps[y];
          if (!stepData || stepData[1]) return;

          stepData[1] = true;
          save.data.tasks[x].completedsteps++;
          stepElement.classList.add("disabled");

          confetti({
            particleCount: 100,
            spread: 150,
            origin: { y: 0.6 }
          });

          await saveGame(true);
          await loadTasks();
          showToast(`Congrats on completing "${stepElement.innerText}"!`, { type: "success" });
        });
      }
    }
  }, 0);
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

async function displayModal(title, content) {
  // Generate a unique ID for each modal to avoid conflicts
  const modalId = 'modal-' + Date.now();

  // Create modal HTML structure
  const modalHTML = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">

            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            ${content}
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>
  `;

  // Append modal to the container
  document.getElementById('modal-container').insertAdjacentHTML('beforeend', modalHTML);

  // Show the modal using Bootstrap's Modal API
  const modalElement = document.getElementById(modalId);
  const bootstrapModal = new bootstrap.Modal(modalElement);
  bootstrapModal.show();

  // Optional: Remove modal from DOM when hidden
  modalElement.addEventListener('hidden.bs.modal', () => {
    modalElement.remove();
  });
}

async function displayTask(task) {
  let stepContent = ``;

  task.steps.forEach((step, i) => {
    stepContent += `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" data-step-index="${i}" ${step[1] ? "checked" : ""}>
        <label class="form-check-label">${step[0]}</label>
      </div>
    `;
  });

  const content = `
    <p>${task.description}</p>
    <h5 class="modal-title">Steps:</h5>
    ${stepContent}
  `;

  // Generate unique ID
  const modalId = 'modal-' + Date.now();
  const modalHTML = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">${task.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            ${content}
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>
  `;

  // Append to DOM
  document.getElementById('modal-container').insertAdjacentHTML('beforeend', modalHTML);

  const modalElement = document.getElementById(modalId);
  const bootstrapModal = new bootstrap.Modal(modalElement);

  // Attach event listener after modal is fully shown
  modalElement.addEventListener('shown.bs.modal', () => {
    const checkboxes = modalElement.querySelectorAll('.form-check-input');
    checkboxes.forEach(checkbox => {
      const index = parseInt(checkbox.getAttribute('data-step-index'), 10);
      checkbox.addEventListener('change', async () => {
        task.steps[index][1] = checkbox.checked;
        task.completedsteps += (checkbox.checked ? 1:-1);
        console.log(`Completed: ${task.completedsteps}`)
        console.log(`Step ${index} is now ${checkbox.checked}`);
        if (task.completedsteps == task.steps.length) {
          bootstrap.Modal.getInstance(modalElement).hide();
        }
        if (checkbox.checked) {
          confetti({
            particleCount: 100,
            spread: 150,
            origin: { y: 0.2 }
          });
        }

        await loadTasks();
      });
    });
  });

  // Show modal
  bootstrapModal.show();

  // Cleanup on close
  modalElement.addEventListener('hidden.bs.modal', () => {
    modalElement.remove();
  });
}

function numberAbreviation(num){
  //console.log(num);
  if (num<1000){
    return num.toFixed(1);
  }
  let truncatedNum = parseFloat(num.toPrecision(4));
  let expNum = truncatedNum.toExponential();
  let splitNumArray = expNum.split('e+');
  return `${(splitNumArray[0] * (10**(splitNumArray[1]%3))).toPrecision(4)}${AbreviationList[Math.round(splitNumArray[1]/3)]}`;
h
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
  if (showFPSCounter) {
    fpsCounterElement.innerText = `FPS: ${fps.toFixed(1)}`;
  }
  lockBuildings();
}

async function lerp(oldVal, newVal, percentage) {
  return oldVal * (1 - percentage) + newVal * percentage;
}
function showModal(title, content) {
  // Generate a unique ID for each modal to avoid conflicts
  const modalId = 'modal-' + Date.now();

  // Create modal HTML structure
  const modalHTML = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            ${content}
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>
  `;

  // Append modal to the container
  document.getElementById('modal-container').insertAdjacentHTML('beforeend', modalHTML);

  // Show the modal using Bootstrap's Modal API
  const modalElement = document.getElementById(modalId);
  const bootstrapModal = new bootstrap.Modal(modalElement);
  bootstrapModal.show();

  // Optional: Remove modal from DOM when hidden
  modalElement.addEventListener('hidden.bs.modal', () => {
    modalElement.remove();
  });
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
    points = 0;
    totalPoints = 0;
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
    save.data.completedtasks = [];
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


  // Hide loading screen.
  document.getElementById('page-blocker').style.display = 'none';
  console.log("Game started.");
}

startup();
