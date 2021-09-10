const balanceElement = document.getElementById("balance--amount");
const loanElement = document.getElementById("loan--amount");
const payElement = document.getElementById("pay--amount");

// Hide load payment button
export const hideLoanButtonElement = () =>
  document.getElementById("repay--button").classList.add("hidden")

// Display loan payment button
export const showLoanButtonElement = () =>
  document.getElementById("repay--button").classList.remove("hidden")

// Replace pay element value with parameter value
export const updatePayElement = value =>
  payElement.replaceChild(document.createTextNode(value), payElement.childNodes[0])
  
//Update balance element value with parameter value
 export const updateBalanceElement = value => balanceElement.replaceChild(document.createTextNode(value), balanceElement.childNodes[0])

// Update loan element value with paramater value
 export const updateLoanElement = value =>
  loanElement.replaceChild(
    document.createTextNode(value),
    loanElement.childNodes[0]
  )

