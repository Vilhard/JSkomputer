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
const payElement = document.getElementById("pay--amount");
const balanceElement = document.getElementById("balance--amount");
const loanElement = document.getElementById("loan--amount");
const imageElement = document.createElement("img")
const url = "https://noroff-komputer-store-api.herokuapp.com/"

let computers = [];
let features = [];
let pay = 0;
let total = 0;
let loan = 0;
let interest = 0;
let value;

fetch(`${url}computers`)
  .then((response) => response.json())
  .then((data) => (computers = data))
  .then((computers) => addComputersToMenu(computers));

const addComputersToMenu = computers => {
  computers.forEach((x) => addComputerToMenu(x));
  featuresElement.innerText = computers[0].specs;
  infoTitleElement.innerText = computers[0].title;
  infoDescElement.innerText = computers[0].description;
  infoPriceElement.innerText = `${computers[0].price} €`;
  addImageToInfo(computers[0])
};

const addComputerToMenu = computer => {
  const computerElement = document.createElement("option");
  computerElement.value = computer.id;
  computerElement.appendChild(document.createTextNode(computer.title));
  computersElement.appendChild(computerElement);  
};

const addImageToInfo = computer => {
  imageElement.src = `${url}`+ computer.image
  imageElement.classList.add("img");
  infoImageElement.replaceChild(imageElement, infoImageElement.childNodes[0])
}

const handleComputerMenuChange = (e) => {
  const selectedComputer = computers[e.target.selectedIndex];
  addImageToInfo(selectedComputer)
  featuresElement.innerText = selectedComputer.specs;
  infoTitleElement.innerText = selectedComputer.title;
  infoDescElement.innerText = selectedComputer.description;
  infoPriceElement.innerText = `${selectedComputer.price} €`;
}
// Check if input is normal positive integer number
const isNormalInteger = str => /^\+?(0|[1-9]\d*)$/.test(str);

// TODO: Buy computer before accessing new loan
const getLoan = () => {
  value = prompt("Enter a loan amount");
  if (value === null) {
    return; // break out early with cancel
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
      updateLoanElement(value);
      showLoanButtonElement();
  }
}

const checkLoanInput = () => {
  const value = prompt("Enter a loan amount");
  if (isNaN(+value))
    alert("Enter a number")
  if (value > total * 2) {
    alert("Loan request is too big");
  }
}

// Hide load payment button
const hideLoanButtonElement = () =>
  document.getElementById("repay--button").classList.add("hidden");
// Display loan payment button
const showLoanButtonElement = () =>
  document.getElementById("repay--button").classList.remove("hidden");
// Replace pay element value to zero
const resetPayElement = () =>
  payElement.replaceChild(document.createTextNode(0), payElement.childNodes[0]);
// Update loan element value with paramater value
const updateLoanElement = (value) =>
  loanElement.replaceChild(
    document.createTextNode(value),
    loanElement.childNodes[0]
  );
// Replaces pay element value with currentvalue + 100
const addWork = () =>
  payElement.replaceChild(
    document.createTextNode((pay += 100)),
    payElement.childNodes[0]
  );

const addToBank = () => {
  if (loan > 0) {
    interest = (10 / 100) * pay;
    pay - interest;
  }
  total += pay;
  pay = 0;
  let updateLoan = +loan + +interest;
  loan = updateLoan;
  resetPayElement();
  updateLoanElement(updateLoan);
  balanceElement.replaceChild(
    document.createTextNode(total),
    balanceElement.childNodes[0]
  );
};
//TODO
const repayLoan = () => {
  const lpay = pay - loan;
};

// listeners
computersElement.addEventListener("change", handleComputerMenuChange);
workButtonElement.addEventListener("click", addWork);
bankButtonElement.addEventListener("click", addToBank);
repayButtonElement.addEventListener("click", repayLoan);
loanButtonElement.addEventListener("click", getLoan);
