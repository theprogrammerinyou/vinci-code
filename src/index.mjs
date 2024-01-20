const startBtn = document.getElementById("container--button-start");
const inputField = document.getElementById("container--input");
const numbersContainer = document.getElementById("container--numbers");
const scoreContainer = document.getElementById("container--score");
const leaderboardBtn = document.getElementById("container--button-leaderboard");
const levelContainer = document.getElementById("container--level");

let score = 0;
let level = 1;
let generatedNumbers = [];
let enteredNumbers = [];
let isUserInput = false;

function resetState() {
  generatedNumbers = [];
  enteredNumbers = [];
  inputField.value = "";
  startBtn.textContent = "Start Game";
  inputField.placeholder = "Please enter your name to start the game";
  score = 0;
  level = 1;
}

function generateRandomNumbers() {
  return Math.floor(Math.random() * 60) + 1;
}

function getRandomNumbersList() {
  for (let i = 0; i < level; i++) {
    generatedNumbers.push(generateRandomNumbers());
  }
}

function endGame() {
  scoreContainer.innerText = `Your score is ${score}`;
}

function verifyLevel() {
  const isCorrect = enteredNumbers.every((number, index) => {
    if (Number(number) == Number(generatedNumbers[index])) return true;
    return false;
  });

  isUserInput = false;
  if (isCorrect) {
    score = level;
    level += 1;
    const user = localStorage.getItem("currentUserName");
    const playersDetails = {
      playerName: user,
      playerScore: score,
      playerLevel: level,
    };
    localStorage.setItem("playersDetails", JSON.stringify(playersDetails));
    localStorage.removeItem("currentUserName");
    generatedNumbers = [];
    enteredNumbers = [];
    getRandomNumbersList();
    displayNumbers({ valueToBeShown: 0 });
  } else {
    endGame();
    resetState();
  }
}

function checkUserInput() {
  const inputValue = inputField.value;
  enteredNumbers.push(inputValue);
  inputField.value = "";
  isUserInput = true;
  if (enteredNumbers.length === generatedNumbers.length) {
    verifyLevel();
  } else if (enteredNumbers.length < generatedNumbers.length) {
    getUserInput();
  }
}

function getUserInput() {
  inputField.placeholder = "Please enter the number shown";
  startBtn.textContent = "Enter Number";
  isUserInput = true;
}

function displayNumbers({ valueToBeShown }) {
  if (valueToBeShown < level) {
    numbersContainer.style.display = "block";
    numbersContainer.innerHTML = `Generated Number: ${generatedNumbers[valueToBeShown]}`;
    setTimeout(() => {
      numbersContainer.innerHTML = "";
      displayNumbers({ valueToBeShown: valueToBeShown + 1 });
    }, 2000);
  } else {
    numbersContainer.style.display = "none";
    getUserInput();
  }
}

function getLeaderboard() {
  const playerDetailsList = JSON.parse(localStorage.getItem("playersDetails"));
  if (playerDetailsList) {
    const playerScoresSorted = playerDetailsList.sort(
      (a, b) => a.playerScore > b.playerScore
    );
    console.log("player score", playerScoresSorted);
  } else {
    console.log("No details found");
  }
}

function startGame() {
  levelContainer.innerHTML = `Your level is: ${level}`;
  if (isUserInput) {
    checkUserInput();
  } else {
    localStorage.setItem("currentUserName", inputField.value);
    inputField.value = "";
    getRandomNumbersList();
    displayNumbers({ valueToBeShown: 0 });
  }
}

leaderboardBtn.addEventListener("click", getLeaderboard);

startBtn.addEventListener("click", startGame);
