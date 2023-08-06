function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

// A calculator operation has two operands and an operator
let operand1;
let operand2;
let operator;

function operate(operand1, operator, operand2) {
    let result;
    switch (operator) {
        case '+':
            result = add(operand1, operand2);
            break;
        case '-':
            result = subtract(operand1, operand2);
            break;
        case '*':
            result = multiply(operand1, operand2);
            break;
        case '/':
            result = divide(operand1, operand2);
            break;
    }
    return result;
}

function getInput(e) {
    const button = e.target;
    calculatorDisplay.textContent = button.getAttribute('data-key');
}

const calculatorDisplay = document.querySelector("#display-text");

const buttons = document.querySelectorAll("button");

buttons.forEach(button => button.addEventListener('click', getInput));