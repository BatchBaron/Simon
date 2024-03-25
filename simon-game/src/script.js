let generatedSequence = [];
let playerSequence = [];
const buttons = [...document.getElementsByClassName("button")];
const startGameButton = document.getElementById("start-game");
const score = document.getElementsByClassName("score")[0];
let gameRound = 0;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const buttonSounds = {
    0: 261.63, // Green
    1: 329.63, // Red
    2: 392.00, // Blue
    3: 493.88  // Yellow
};


function createSound(frequency) {
    const sound = audioContext.createOscillator();
    sound.frequency.value = frequency;
    sound.connect(audioContext.destination);
    sound.start();
    sound.stop(audioContext.currentTime + 0.5);
}

function displayButton(buttonIndex) {
    buttons[buttonIndex].classList.add("active");
    setTimeout(() => {
        buttons[buttonIndex].classList.remove("active");
    }, 500);
}

function checkIfValid() {
    if(generatedSequence.length < 1) {return true;}
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== generatedSequence[i]) {
            return false;
        }
    }
    return true;
}

function startGame() {
    generatedSequence = [];
    playerSequence = [];
    addSequence();
    playSequence();
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        const buttonIndex = generatedSequence[i];
        createSound(buttonSounds[buttonIndex]);
        displayButton(buttonIndex);
        i++;
        if (i >= generatedSequence.length) {
            clearInterval(interval);
            enablePlayerInput();
        }
    }, 1000);
}

function enablePlayerInput() {
    buttons.forEach((button, index) => {
        button.onclick = function () {
            playerSequence.push(index);
            createSound(buttonSounds[index]);
            if (!checkIfValid()) {
                endGame();
            } else if (playerSequence.length === generatedSequence.length) {
                setTimeout(startNextRound, 1000);
            }
        };
    });
}

function disablePlayerInput() {
    buttons.forEach((button) => {
        button.onclick = null;
    });
}

function addSequence() {
    const randomNumber = generateRandomNumber();
    generatedSequence.push(randomNumber);
}

function resetGame() {
    generatedSequence = [];
    playerSequence = [];
    gameRound = 0;
    startGameButton.disabled = false;
    startGameButton.style.cursor = "pointer";
}

function generateRandomNumber() {
    return Math.floor(Math.random() * buttons.length);
}

function startNextRound() {
    disablePlayerInput();
    playerSequence = [];
    gameRound++;
    updateScore();
    updateStartButtonText();
    addSequence();
    playSequence();
}

function endGame() {
    alert('You lost! Your score: ' + gameRound);
    resetGame();
    updateScore();
    resetStartButtonText();
}

function styleButtons() {
    buttons.forEach((button) => {
        button.classList.add('mouse-over');
    });
}

function updateScore(){
    score.textContent = `Your score: ${gameRound}`;
}

function updateStartButtonText(){
    startGameButton.textContent = `Round: ${gameRound +1}`;
}

function resetStartButtonText(){
    startGameButton.textContent = "START GAME";
}

document.addEventListener("DOMContentLoaded", function () {
    updateScore();
    startGameButton.addEventListener('click', function () {
        startGameButton.style.cursor = "default";
        startGameButton.disabled = true;
        styleButtons();
        updateStartButtonText();
        startGame();
    });


});