let intervalIds = [];
let taskRunning = false;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setInitialRandomValues() {
    document.getElementById("box1").textContent = randomInt(10, 20);
    document.getElementById("box2").textContent = randomInt(-10, 10);
    document.getElementById("box3").textContent = randomInt(-100, 0);
    document.getElementById("box4").textContent = randomInt(0, 20);
    document.getElementById("box5").textContent = randomInt(-40, 40);
    document.getElementById("box6").textContent = randomInt(100, 200);
}

function startRandomBoxes() {
    if (taskRunning) return;

    taskRunning = true;
    setInitialRandomValues();

    intervalIds.push(setInterval(() => {
        document.getElementById("box1").textContent = randomInt(10, 20);
    }, 10000));

    intervalIds.push(setInterval(() => {
        document.getElementById("box2").textContent = randomInt(-10, 10);
    }, 20000));

    intervalIds.push(setInterval(() => {
        document.getElementById("box3").textContent = randomInt(-100, 0);
    }, 8000));

    intervalIds.push(setInterval(() => {
        document.getElementById("box4").textContent = randomInt(0, 20);
    }, 12000));

    intervalIds.push(setInterval(() => {
        document.getElementById("box5").textContent = randomInt(-40, 40);
    }, 16000));

    intervalIds.push(setInterval(() => {
        document.getElementById("box6").textContent = randomInt(100, 200);
    }, 14000));
}

function stopRandomBoxes() {
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
    taskRunning = false;
}

async function loadData() {
    const btn = document.getElementById("runBtn");
    const loadingText = document.getElementById("loadingText");
    const outputArea = document.getElementById("outputArea");

    if (taskRunning) {
        stopRandomBoxes();
        btn.textContent = "Run Multithreading Task";
        loadingText.textContent = "Task stopped.";
        return;
    }

    btn.disabled = true;
    btn.textContent = "Loading...";
    loadingText.textContent = "Multithreading task is running...";
    outputArea.style.display = "none";

    try {
        const response = await fetch("/get-data");
        const data = await response.json();

        document.getElementById("tableLink").href = data.table_file;
        document.getElementById("graphLink").href = data.graph_file;

        startRandomBoxes();

        btn.disabled = false;
        btn.textContent = "Stop Task";
        loadingText.textContent = "Task completed. Random values are refreshing automatically.";
        outputArea.style.display = "block";
    } catch (error) {
        btn.disabled = false;
        btn.textContent = "Run Multithreading Task";
        loadingText.textContent = "Something went wrong while running the task.";
    }
}