// 🎮 Advanced Sudoku Game

const sudokuGrid = document.getElementById("sudokuGrid");
const message = document.getElementById("message");
const timerElement = document.getElementById("timer");
const hintCountElement = document.getElementById("hintCount");
const difficultySelect = document.getElementById("difficulty");

let timer;
let seconds = 0;
let hintCount = 3;

// Example puzzles by difficulty (0 = empty)
const puzzles = {
  easy: [
    [5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]
  ],
  medium: [
    [0,2,0,6,0,8,0,0,0],[5,8,0,0,0,9,7,0,0],[0,0,0,0,4,0,0,0,0],
    [3,7,0,0,0,0,5,0,0],[6,0,0,0,0,0,0,0,4],[0,0,8,0,0,0,0,1,3],
    [0,0,0,0,2,0,0,0,0],[0,0,9,8,0,0,0,3,6],[0,0,0,3,0,6,0,9,0]
  ],
  hard: [
    [0,0,0,0,0,0,0,1,2],[0,0,0,0,0,0,7,0,0],[0,0,1,0,9,0,0,0,0],
    [0,0,0,5,0,0,0,0,0],[0,1,0,0,0,0,0,8,0],[0,0,0,0,0,3,0,0,0],
    [0,0,0,0,8,0,6,0,0],[0,0,2,0,0,0,0,0,0],[8,3,0,0,0,0,0,0,0]
  ]
};

// Solutions (for simplicity, pre-defined)
const solutions = {
  easy: [
    [5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]
  ],
  medium: [
    [1,2,3,6,7,8,9,4,5],[5,8,4,2,3,9,7,6,1],[9,6,7,1,4,5,3,2,8],
    [3,7,2,4,6,1,5,9,8],[6,9,1,5,8,7,2,3,4],[4,5,8,9,2,3,6,1,7],
    [7,1,5,3,2,6,4,8,9],[2,4,9,8,1,5,1,3,6],[8,3,6,7,9,2,1,5,2]
  ],
  hard: [
    [3,4,5,6,7,9,8,1,2],[6,8,9,1,3,2,7,4,5],[2,7,1,4,9,5,3,6,8],
    [1,6,3,5,2,7,4,8,9],[5,1,4,9,6,8,2,7,3],[9,2,7,8,1,3,5,6,4],
    [4,5,6,2,8,1,6,9,7],[7,9,2,3,5,4,1,2,6],[8,3,1,7,4,6,9,5,2]
  ]
};

let currentPuzzle, currentSolution;

// 🛠 Initialize Grid
function loadPuzzle() {
  sudokuGrid.innerHTML = "";
  hintCount = 3;
  hintCountElement.textContent = hintCount;
  message.textContent = "";

  let difficulty = difficultySelect.value;
  currentPuzzle = JSON.parse(JSON.stringify(puzzles[difficulty]));
  currentSolution = solutions[difficulty];

  currentPuzzle.forEach((row, i) => {
    row.forEach((num, j) => {
      let cell = document.createElement("input");
      cell.type = "text";
      cell.maxLength = 1;
      if (num !== 0) {
        cell.value = num;
        cell.disabled = true;
      }
      sudokuGrid.appendChild(cell);
    });
  });
  resetTimer();
}

// ⏱ Timer
function startTimer() {
  timer = setInterval(() => {
    seconds++;
    let min = String(Math.floor(seconds / 60)).padStart(2, "0");
    let sec = String(seconds % 60).padStart(2, "0");
    timerElement.textContent = `${min}:${sec}`;
  }, 1000);
}
function resetTimer() {
  clearInterval(timer);
  seconds = 0;
  timerElement.textContent = "00:00";
  startTimer();
}

// ✅ Check Puzzle
function checkPuzzle() {
  let inputs = sudokuGrid.querySelectorAll("input");
  let correct = true;

  inputs.forEach((cell, index) => {
    let row = Math.floor(index / 9);
    let col = index % 9;
    if (parseInt(cell.value) !== currentSolution[row][col]) {
      correct = false;
      cell.style.background = "#e74c3c55"; // wrong
    } else {
      cell.style.background = "#2ecc7055"; // correct
    }
  });

  if (correct) {
    message.textContent = "🎉 Congratulations! You solved it!";
    message.className = "success";
    clearInterval(timer);
  } else {
    message.textContent = "❌ Some values are incorrect!";
    message.className = "error";
  }
}

// 🧩 Solve Puzzle
function solvePuzzle() {
  let inputs = sudokuGrid.querySelectorAll("input");
  inputs.forEach((cell, index) => {
    let row = Math.floor(index / 9);
    let col = index % 9;
    cell.value = currentSolution[row][col];
    cell.disabled = true;
    cell.style.background = "#2ecc70555";
  });
  message.textContent = "✔️ Puzzle Solved!";
  message.className = "success";
  clearInterval(timer);
}

// 💡 Hint Feature: Limited Hints
function giveHint() {
  if (hintCount <= 0) {
    message.textContent = "No hints left!";
    message.className = "error";
    return;
  }

  let inputs = sudokuGrid.querySelectorAll("input");
  let emptyCells = [];
  inputs.forEach((cell, index) => {
    if (cell.value === "") emptyCells.push({ cell, index });
  });

  if (emptyCells.length === 0) {
    message.textContent = "No empty cells left for hints!";
    message.className = "error";
    return;
  }

  let randomIndex = Math.floor(Math.random() * emptyCells.length);
  let { cell, index } = emptyCells[randomIndex];
  let row = Math.floor(index / 9);
  let col = index % 9;
  cell.value = currentSolution[row][col];
  cell.style.background = "#3498db55"; // hint color
  hintCount--;
  hintCountElement.textContent = hintCount;
  message.textContent = "💡 Hint applied!";
  message.className = "hint";
}

// 🎯 Event Listeners
document.getElementById("newGame").addEventListener("click", loadPuzzle);
document.getElementById("checkGame").addEventListener("click", checkPuzzle);
document.getElementById("solveGame").addEventListener("click", solvePuzzle);
document.getElementById("hintGame").addEventListener("click", giveHint);
difficultySelect.addEventListener("change", loadPuzzle);

// Load initial puzzle
loadPuzzle();