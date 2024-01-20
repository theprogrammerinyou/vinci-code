const startBtn = document.getElementById("container--button-start");
const inputField = document.getElementById("container--input");
const numbersContainer = document.getElementById("container--numbers");
const scoreContainer = document.getElementById("container--score");
const leaderboardBtn = document.getElementById("container--button-leaderboard");
const levelContainer = document.getElementById("container--level");
const leaderContainer = document.getElementById("container--leaderboard");
const nameContainer = document.getElementById("container--name");
const updateNameBtn = document.getElementById("container--button-update-name");
const namePara = document.getElementById("container--p-name");

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
  scoreContainer.style.display = "block";
  scoreContainer.innerText = `Your score is ${score}`;
  const user = localStorage.getItem("currentUserName");
  const oldPlayerDetails =
    JSON.parse(localStorage.getItem("playersDetails")) || [];
  const playersDetails = {
    playerName: user,
    playerScore: score,
    playerLevel: level,
  };
  const updatedPlayerDetails = [...oldPlayerDetails, playersDetails];
  localStorage.setItem("playersDetails", JSON.stringify(updatedPlayerDetails));
  localStorage.removeItem("currentUserName");
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
    startBtn.disabled = true;
    numbersContainer.style.display = "block";
    numbersContainer.innerHTML = `Generated Number: ${generatedNumbers[valueToBeShown]}`;
    setTimeout(() => {
      startBtn.disabled = true;
      numbersContainer.innerHTML = "";
      displayNumbers({ valueToBeShown: valueToBeShown + 1 });
    }, 2000);
  } else {
    startBtn.disabled = false;
    numbersContainer.style.display = "none";
    getUserInput();
  }
}

function getLeaderboard() {
  leaderContainer.style.display = "block";
  const playerDetailsList = JSON.parse(localStorage.getItem("playersDetails"));
  if (playerDetailsList) {
    const playerScoresSorted = playerDetailsList.sort(
      (a, b) => a.playerScore > b.playerScore
    );
    playerScoresSorted.forEach((player, index) => {
      const { playerName, playerScore } = player;
      const node = document.createElement("p");
      node.innerText = `${index + 1}. ${playerName} : ${playerScore}`;
      leaderContainer.appendChild(node);
    });
  } else {
    console.log("No details found");
  }
}

function updateName() {
  isUserInput = false;
  startBtn.textContent = "Update Name and Start Game";
  inputField.placeholder = "Please enter your name to start the game";
}

function startGame() {
  levelContainer.innerHTML = `You are at level: ${level}`;
  leaderContainer.style.display = "none";
  if (isUserInput) {
    checkUserInput();
  } else {
    localStorage.setItem("currentUserName", inputField.value);
    namePara.innerText = `Hi ${inputField.value} `;
    nameContainer.style.display = "flex";
    updateNameBtn.style.display = "block";
    inputField.value = "";
    getRandomNumbersList();
    displayNumbers({ valueToBeShown: 0 });
  }
}

leaderboardBtn.addEventListener("click", getLeaderboard);

updateNameBtn.addEventListener("click", updateName);

startBtn.addEventListener("click", startGame);
