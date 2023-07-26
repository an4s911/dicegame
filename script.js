const dieOptions = ["one", "two", "three", "four", "five", "six"];

const rollBtn = document.getElementById("roll-btn");

const die1 = document.getElementById("die1");
const die2 = document.getElementById("die2");

const dice = [die1, die2];

rollBtn.addEventListener("click", rollDice);

function rollDice() {
    dice.forEach(rollDie);
}

function rollDie(die) {
    let randomNumber = Math.floor(Math.random() * 6);
    die.className = `dice ${dieOptions[randomNumber]}`;
}
