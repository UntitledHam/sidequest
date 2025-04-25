import { Save } from "./save.js";
import { fetchJson } from "./jsonUtils.js";
const task = document.getElementById("task-test");
const steps = task.querySelectorAll(".step");

const crossedOutColor = window.getComputedStyle(document.documentElement).getPropertyValue('--bs-tertiary-color');
const standardColor = window.getComputedStyle(document.documentElement).getPropertyValue('--bs-list-group-color');


for (let step of steps) {
  step.addEventListener("click", () => {
    if (!step.classList.contains("done")) {
      step.innerHTML = `<s><i>${step.innerText}</i></s>`
      step.style.color = crossedOutColor;
      step.classList.add("done");
    }
    else {
      step.innerHTML = step.innerText;
      step.style.color = standardColor;
      step.classList.remove("done");
    }
  });
}

// Init the tooltips
document.addEventListener('DOMContentLoaded', function () {
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  popoverTriggerList.map(function (el) {
    return new bootstrap.Popover(el)
  })
})
