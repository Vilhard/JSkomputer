"use strict";
//imports
import { add, subtract, multiply, isNormalInteger } from './helpers/calculationHelpers.js';
import { updateBalanceElement, updatePayElement,
   updateLoanElement, showLoanButtonElement, hideLoanButtonElement} from './helpers/elementHandlers.js';

// DOM Elements
const computersElement = document.getElementById("computers");
const featuresElement = document.getElementById("features");
const infoTitleElement = document.getElementById("info--title");
const infoDescElement = document.getElementById("info--desc");
const infoPriceElement = document.getElementById("info--price");
const infoImageElement = document.getElementById("info--image");
const loanButtonElement = document.getElementById("loan--button");
const bankButtonElement = document.getElementById("bank--button");
const workButtonElement = document.getElementById("work--button");
const repayButtonElement = document.getElementById("repay--button");
const buyButtonElement = document.getElementById("info--buy");
const imageElement = document.createElement("img")
const url = "https://noroff-komputer-store-api.herokuapp.com/"
 
// Variables
let computers = [];
let pay = 0;
let total = 0;
let loan = 0;
let loanAllowed = true
const interestProcent = (10 / 100)

// Fetch from API
fetch(`${url}computers`)
  .then((response) => response.json())
  .then((data) => (computers = data))
  .then((computers) => addComputersToMenu(computers));

//Adds all laptops to array and displays first laptop when page is loaded
const addComputersToMenu = computers => {
  computers.forEach((x) => addComputerToMenu(x));
  featuresElement.innerText = computers[0].specs.join('\n');
  infoTitleElement.innerText = computers[0].title;
  infoDescElement.innerText = computers[0].description;
  infoPriceElement.innerText = `${computers[0].price} €`;
  addImageToInfo(computers[0])
};
// Creates option element for laptop
const addComputerToMenu = computer => {
  const computerElement = document.createElement("option");
  computerElement.value = computer.id;
  computerElement.appendChild(document.createTextNode(computer.title));
  computersElement.appendChild(computerElement);
};
// Creates image element
const addImageToInfo = computer => {
  imageElement.src = `${url}` + computer.image
  imageElement.classList.add("img");
  imageElement.onerror =
    function () {
      this.onerror = null; this.src = 'images/notFound.png';
    }
  infoImageElement.appendChild(imageElement)
}

// Function display correct laptop when it is chosen
const handleComputerMenuChange = (e) => {
  const selectedComputer = computers[e.target.selectedIndex];
  addImageToInfo(selectedComputer)
  featuresElement.innerText = selectedComputer.specs.join('\n');
  infoTitleElement.innerText = selectedComputer.title;
  infoDescElement.innerText = selectedComputer.description;
  infoPriceElement.innerText = `${selectedComputer.price} €`;
}

// Function checks if loan is allowed and then validates loan value
const getLoan = () => {
  const value = prompt("Enter a loan amount");
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
    case value > multiply(total, 2):
      alert("Loan request is too big");
      break;
    default:
      loan = value
      loanAllowed = false
      updateLoanElement(loan);
      showLoanButtonElement();
      total = add(total,+loan)
      updateBalanceElement(total)
  }
}

//  Replaces pay element value with current pay + 100
const addWork = () => updatePayElement(pay+= 100)

// Checks if there is loan and adds interest to loan, if not add pay to bank
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

// Reduces loan amount. Adds leftover pay to balance if pay is greater than loan value
const payLoan = () => {
  if (pay > loan) {
    total = add(total, subtract(pay, loan))
    loan = 0;
    pay = 0
    updateLoanElement(0);
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
  if (total >= +infoPriceElement.innerText.slice(0, -1)) {
    total = subtract(total, +infoPriceElement.innerText.slice(0, -1))
    updateBalanceElement(total)
    loanAllowed = true
    alert(`You are the owner of ${infoTitleElement.innerText} laptop`)
  } else {
    alert(`You don't have enough money in the bank to buy ${infoTitleElement.innerText} laptop`)
  }
}

// listeners
computersElement.addEventListener("change", handleComputerMenuChange);
workButtonElement.addEventListener("click", addWork);
bankButtonElement.addEventListener("click", addToBank);
repayButtonElement.addEventListener("click", payLoan);
loanButtonElement.addEventListener("click", getLoan);
buyButtonElement.addEventListener("click", buyComputer)
