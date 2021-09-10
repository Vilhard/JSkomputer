"use strict";
// DOM Elements
const computersElement = document.getElementById("computers");
const featuresElement = document.getElementById("features");
const infoElement = document.getElementById("info");
const infoTitleElement = document.getElementById("info--title");
const infoDescElement = document.getElementById("info--desc");
const infoPriceElement = document.getElementById("info--price");
const infoImageElement = document.getElementById("info--image");
const loanButtonElement = document.getElementById("loan--button");
const bankButtonElement = document.getElementById("bank--button");
const workButtonElement = document.getElementById("work--button");
const repayButtonElement = document.getElementById("repay--button");
const buyButtonElement = document.getElementById("info--buy");
const payElement = document.getElementById("pay--amount");
const balanceElement = document.getElementById("balance--amount");
const loanElement = document.getElementById("loan--amount");
const imageElement = document.createElement("img")
const url = "https://noroff-komputer-store-api.herokuapp.com/"

let computers = [];
let pay = 0;
let total = 0;
let loan = 0;
let value;
let loanAllowed = true

const interestProcent = (10 / 100)
const subtract = (a, b) => a - b
const add = (a, b) => a + b
const multiply = (a, b) => a * b


fetch(`${url}computers`)
  .then((response) => response.json())
  .then((data) => (computers = data))
  .then((computers) => addComputersToMenu(computers));

const addComputersToMenu = computers => {
  computers.forEach((x) => addComputerToMenu(x));
  featuresElement.innerText = computers[0].specs.join('\n');
  infoTitleElement.innerText = computers[0].title;
  infoDescElement.innerText = computers[0].description;
  infoPriceElement.innerText = computers[0].price;
  addImageToInfo(computers[0])
};

const addComputerToMenu = computer => {
  const computerElement = document.createElement("option");
  computerElement.value = computer.id;
  computerElement.appendChild(document.createTextNode(computer.title));
  computersElement.appendChild(computerElement);
};

const addImageToInfo = computer => {
  imageElement.src = `${url}` + computer.image
  imageElement.classList.add("img");
  imageElement.onerror =
    function () {
      this.onerror = null; this.src = 'images/notFound.png';
    }
  infoImageElement.appendChild(imageElement)
}

const handleComputerMenuChange = (e) => {
  const selectedComputer = computers[e.target.selectedIndex];
  addImageToInfo(selectedComputer)
  featuresElement.innerText = selectedComputer.specs.join('\n');
  infoTitleElement.innerText = selectedComputer.title;
  infoDescElement.innerText = selectedComputer.description;
  infoPriceElement.innerText = selectedComputer.price;
}

// Check if input is normal positive integer number
const isNormalInteger = str => /^\+?(0|[1-9]\d*)$/.test(str);

// Function checks if loan is allowed and validates loan valuesda
const getLoan = () => {
  value = prompt("Enter a loan amount");
  if (value === null) {
    return;
  }
  if (loanAllowed === false) {
    alert("You need to buy a laptop before eligible for another loan")
    return;
  }
  switch (true) {
    case isNaN(value):
      alert('Input is not a number')
      break;
    case !isNormalInteger(value):
      alert('Enter a positive number')
      break;
    case value > total * 2:
      alert("Loan request is too big");
      break;
    default:
      loan = value;
      loanAllowed = false
      updateLoanElement(value);
      showLoanButtonElement();
      total += +loan
      updateBalanceElement(total)
  }
}

// Hide load payment button
const hideLoanButtonElement = () =>
  document.getElementById("repay--button").classList.add("hidden");
// Display loan payment button
const showLoanButtonElement = () =>
  document.getElementById("repay--button").classList.remove("hidden");
// Replace pay element value to zero
const updatePayElement = value =>
  payElement.replaceChild(document.createTextNode(value), payElement.childNodes[0]);
//Update balance element value
const updateBalanceElement = value => balanceElement.replaceChild(document.createTextNode(value), balanceElement.childNodes[0]);
// Update loan element value with paramater value
const updateLoanElement = value =>
  loanElement.replaceChild(
    document.createTextNode(value),
    loanElement.childNodes[0]
  );
//  Replaces pay element value with currentvalue + 100
const addWork = () =>
  payElement.replaceChild(
    document.createTextNode((pay += 100)),
    payElement.childNodes[0]
  );

// Checks if there is loan -> add interest to loan, if not add pay to bank
const addToBank = () => {
  if (+loan > 0) {
    loan = add(+loan, multiply(interestProcent, pay))
    updateLoanElement(loan);
  }
  total = add(total, pay);
  pay = 0;
  updatePayElement(0);
  updateBalanceElement(total)
};

//TODO: Button wont close when loan 0
const payLoan = () => {
  if (pay > loan) {
    total = add(total, subtract(pay, loan))
    loan = 0;
    updateLoanElement(0);
    pay = 0
    updatePayElement(0);
    updateBalanceElement(total)
    hideLoanButtonElement()
  }
  loan = subtract(loan, pay);
  updateLoanElement(loan);
  pay = 0;
  updatePayElement(0);
};

// Checks if there is enough money in the bank to buy a computer and then handles the exhange
const buyComputer = () => {
  if (total >= +infoPriceElement.innerText) {
    total = subtract(total, infoPriceElement.innerText)
    updateBalanceElement(total)
    loanAllowed = true
    alert(`You are the owner of this laptop`)
  } else {
    alert("You don't have enough money in the bank to buy this laptop")
  }
}

// listeners
computersElement.addEventListener("change", handleComputerMenuChange);
workButtonElement.addEventListener("click", addWork);
bankButtonElement.addEventListener("click", addToBank);
repayButtonElement.addEventListener("click", payLoan);
loanButtonElement.addEventListener("click", getLoan);
buyButtonElement.addEventListener("click", buyComputer)
