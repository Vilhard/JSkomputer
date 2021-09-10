// Hide or show load payment button
const shouldShowLoanElementButton = bool => bool ? 
  document.getElementById("repay--button").classList.remove("hidden") : 
  document.getElementById("repay--button").classList.add("hidden")

  export default shouldShowLoanElementButton