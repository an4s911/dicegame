document.addEventListener("DOMContentLoaded", () => {
    rollDice();
    showInfoMsg("Click on Roll to begin the game");
});

document.querySelector("body").style.overflow = "hidden";

const rollBtn = document.getElementById("roll-btn");
const turnOverBtn = document.getElementById("turn-over-btn");

const die1 = document.getElementById("die1");
const die2 = document.getElementById("die2");
const dice = document.querySelectorAll(".dice");

const turnPronounElement = document.querySelector("#turn > span");

const turnScoreElement = document.querySelector("#turn-score > div > span");
const playerScoreElement = document.querySelector("#your-score > p");
const computerScoreElement = document.querySelector("#computer-score > p");

const winningScore = 100;

const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("start-btn");

const showRulesBtn = document.getElementById("show-rules-btn");

startBtn.addEventListener("click", () => {
    document.querySelector("body").style.overflow = "auto";
    overlay.style.display = "none";
});

showRulesBtn.addEventListener("click", () => {
    startBtn.textContent = "Continue";
    document.querySelector("body").style.overflow = "hidden";
    overlay.style.display = "grid";
    document.querySelector("#overlay > div").scrollTop = 0;
});

let user = {
    playerScore: 0,
    pronoun: "You",
    possessivePronoun: "Your",
    set score(value) {
        this.playerScore = value;
        playerScoreElement.textContent = this.playerScore;
    },
    get score() {
        return this.playerScore;
    },
};

let computer = {
    playerScore: 0,
    pronoun: "Computer",
    possessivePronoun: "Computer's",
    set score(value) {
        this.playerScore = value;
        computerScoreElement.textContent = this.playerScore;
    },
    get score() {
        return this.playerScore;
    },
};

const currentTurn = {
    turnScore: 0,
    currentPlayer: user,
    set score(value) {
        this.turnScore = value;
        turnScoreElement.textContent = this.turnScore;
    },
    get score() {
        return this.turnScore;
    },
    set player(otherPlayer) {
        this.currentPlayer = otherPlayer;
        turnPronounElement.textContent = this.currentPlayer.possessivePronoun;
    },
    get player() {
        return this.currentPlayer;
    },
    switchPlayer: function() {
        if (this.currentPlayer === user) {
            rollBtn.setAttribute("disabled", true);
            turnOverBtn.setAttribute("disabled", true);
            this.player = computer;
            emulateComputerTurn();
        } else {
            setTimeout(() => {
                rollBtn.removeAttribute("disabled");
                turnOverBtn.removeAttribute("disabled");
            }, 400);
            this.player = user;
        }
        turnPronounElement.textContent = this.currentPlayer.possessivePronoun;
    },
};

rollBtn.addEventListener("click", rollAndValidate);

turnOverBtn.addEventListener("click", () => {
    turnOver();
    showInfoMsg("You turned over, you got " + currentTurn.score + " points");
});

function turnOver() {
    currentTurn.player.score += currentTurn.score;
    setTimeout(() => {
        currentTurn.score = 0;
    }, 400);

    if (currentTurn.player.score >= winningScore) {
        playerWins(currentTurn.player);
    } else {
        currentTurn.switchPlayer();
    }
}

function rollAndValidate() {
    const rollDetails = rollDice();
    const validationResult = rollDetails.validateRoll();
    const player = currentTurn.player;
    if (validationResult === 1) {
        currentTurn.score += rollDetails.rollValue;

        if (currentTurn.player.score + currentTurn.score >= winningScore) {
            turnOver();
        } else if (currentTurn.player === computer) {
            if (currentTurn.score >= 20) {
                showInfoMsg("Computer got " + player.score + " points");
                turnOver();
            } else {
                emulateComputerTurn();
            }
        }
    } else {
        currentTurn.score = 0;
        if (validationResult === -1) {
            currentTurn.player.score = 0;
            showInfoMsg(`${player.pronoun} rolled two 1's!`);
        } else {
            showInfoMsg(`${player.pronoun} rolled a 1!`);
        }
        turnOver();
    }
}

function playerWins(player) {
    setTimeout(() => {
        alert(player.pronoun + " Won!!! with " + player.score + " points");
    }, 100);
    setTimeout(() => {
        resetGame();
    }, 100);
}

function resetGame() {
    user.score = 0;
    computer.score = 0;
    rollBtn.removeAttribute("disabled");
    turnOverBtn.removeAttribute("disabled");
    currentTurn.player = user;
    currentTurn.score = 0;
}

function rollDice() {
    let audio = new Audio("./media/dice-roll.mp3");
    audio.play();
    return {
        die1Value: rollDie(dice[0]),
        die2Value: rollDie(dice[1]),
        validateRoll: function() {
            if (this.die1Value === 1 && this.die2Value === 1) {
                return -1;
            } else if (this.die1Value === 1 || this.die2Value === 1) {
                return 0;
            } else {
                return 1;
            }
        },
        get rollValue() {
            return this.die1Value + this.die2Value;
        },
    };
}

function rollDie(die) {
    let randomNumber = Math.floor(Math.random() * 6);

    const dieOptions = ["one", "two", "three", "four", "five", "six"];
    die.className = `dice ${dieOptions[randomNumber]}`;

    return randomNumber + 1;
}

function emulateComputerTurn() {
    setTimeout(rollAndValidate, 2300);
}

function showInfoMsg(message) {
    const infoBox = document.querySelector("#info-box > div > p");
    infoBox.textContent = message;
}
