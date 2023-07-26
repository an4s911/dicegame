const rollBtn = document.getElementById("roll-btn");
const turnOverBtn = document.getElementById("turn-over-btn");

const die1 = document.getElementById("die1");
const die2 = document.getElementById("die2");
const dice = document.querySelectorAll(".dice");

const turnPronounElement = document.querySelector("#turn > span");

const turnScoreElement = document.querySelector("#turn-score > p");
const playerScoreElement = document.querySelector("#your-score > p");
const computerScoreElement = document.querySelector("#computer-score > p");

let user = {
    playerScore: 0,
    pronoun: "Your",
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
    pronoun: "Computer's",
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
        turnPronounElement.textContent = this.currentPlayer.pronoun;
    },
    get player() {
        return this.currentPlayer;
    },
    switchPlayer: function () {
        if (this.currentPlayer === user) {
            rollBtn.setAttribute("disabled", false);
            turnOverBtn.setAttribute("disabled", false);
            this.player = computer;
        } else {
            rollBtn.setAttribute("disabled", true);
            turnOverBtn.setAttribute("disabled", true);
            this.player = user;
        }
        turnPronounElement.textContent = this.currentPlayer.pronoun;
    },
};

rollBtn.addEventListener("click", () => {
    const rollDetails = rollDice();
    const validationResult = rollDetails.validateRoll();
    if (validationResult === 1) {
        currentTurn.score += rollDetails.rollValue;
    } else {
        currentTurn.score = 0;
        if (validationResult === -1) {
            currentTurn.player.score = 0;
        }
        currentTurn.switchPlayer();
    }
});

turnOverBtn.addEventListener("click", () => {
    currentTurn.player.score += currentTurn.score;
    currentTurn.score = 0;

    currentTurn.switchPlayer();
});

function rollDice() {
    return {
        die1Value: rollDie(dice[0]),
        die2Value: rollDie(dice[1]),
        validateRoll: function () {
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
