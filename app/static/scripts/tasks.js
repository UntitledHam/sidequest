import { Save } from "./save.js";
import { fetchJson } from "./jsonUtils.js";
const task = document.getElementById("task-test");
const steps = task.querySelectorAll(".step");

const crossedOutColor = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--bs-tertiary-color");
const standardColor = window
  .getComputedStyle(document.documentElement)
  .getPropertyValue("--bs-list-group-color");

for (let step of steps) {
  step.addEventListener("click", () => {
    if (!step.classList.contains("done")) {
      step.innerHTML = `<s><i>${step.innerText}</i></s>`;
      step.style.color = crossedOutColor;
      step.classList.add("done");
    } else {
      step.innerHTML = step.innerText;
      step.style.color = standardColor;
      step.classList.remove("done");
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const toastEls = document.querySelectorAll(".toast");
  toastEls.forEach((toastEl) => {
    new bootstrap.Toast(toastEl, { delay: 4000 }).show();
  });
});

// Init the tooltips
document.addEventListener("DOMContentLoaded", function() {
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]'),
  );
  popoverTriggerList.map(function(el) {
    return new bootstrap.Popover(el);
  });
});

const stepButtonElement = document.getElementById("addStep");
const stepTextBox = document.getElementById("stepBox");
const stepNumberElement = document.getElementById("stepNum");
const stepListElement = document.getElementById("taskSteps");
const taskTitleElement = document.getElementById("taskTitle");
const taskDescriptionElement = document.getElementById("taskDescription");
const createTaskButtonElement = document.getElementById("createTaskButton");
const dueDateElement = document.getElementById("taskDueDate")

let tempSteps = [];
function addStep() {
  console.log(stepTextBox.value);
  if (stepTextBox.value == "") {
    stepTextBox.classList.add("is-invalid")
    return;
  }
  stepNumberElement.innerText++;
  stepListElement.innerHTML += `<li>${stepTextBox.value}</li>`;
  tempSteps.push(stepTextBox.value);
  stepTextBox.value = "";
}
function createTask() {
  let task = {};
  task.title = taskTitleElement.value; 
  task.duedate = dueDateElement.value;
  task.description = taskDescriptionElement.value;
  task.steps = tempSteps;
  console.log(task);
}

function saveTask() {
  taskTitleElement.value = "";
  dueDateElement.value = "";
  taskDescriptionElement.value = "";
  stepTextBox.value = "";
} 

stepButtonElement.addEventListener("click", () => addStep());
stepTextBox.addEventListener("focus", () => {
  stepTextBox.classList.remove("is-invalid");
});
createTaskButtonElement.addEventListener("click", () => createTask());

