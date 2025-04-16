const task = document.getElementById("task-test");
const steps = task.querySelectorAll(".step");

const crossedOutColor = window.getComputedStyle(document.documentElement).getPropertyValue('--bs-tertiary-color');
const standardColor = window.getComputedStyle(document.documentElement).getPropertyValue('--bs-list-group-color');


async function fetchJson(url) {
  const response = await fetch(url, { method: 'GET' })
  const data = response.json();
  return data;
}

async function sendJson(url, content) {

}

console.log(task.innerText)
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

async function main() {
  const test = await fetchJson("https://musicbrainz.org/ws/2/artist/?query=%22Stephanie%20Beatriz%22&fmt=json");
  console.log(test);
  console.log(test["count"]);


  console.log("Loaded Tasks.");
}
main();
