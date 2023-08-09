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

function isNumber(string) {
    return +currentInput === +currentInput;
}

function isArithmeticOperation(string) {
    const ARITHMETIC_OPERATIONS = [
        "add",
        "subtract",
        "multiply",
        "divide"
    ];

    return ARITHMETIC_OPERATIONS.includes(string);
}

function isCalculatorOperation(string) {
    const CALCULATOR_OPERATIONS = ["equals", "clear"];

    return CALCULATOR_OPERATIONS.includes(string);
}

function updateDisplay() {
    calculatorDisplay.textContent = operands[currentOperand];
}

function clear() {
    operands[currentOperand] = "0";
    updateDisplay();
    console.log('cleared screen');
}

function updateOperand(num) {
    (operands[currentOperand] === "0") ? 
    operands[currentOperand] = num :
    operands[currentOperand] += num;

}

function switchCurrentOperand() {
    currentOperand = (currentOperand === 0) ? 1 : 0;
}
        
function manageCalculation(e) {
    const button = e.target;
    currentInput = button.getAttribute('data-key');
    console.log("input: ", currentInput);


    if (isNumber(currentInput)) {
        const num = currentInput;
        updateOperand(num);
        updateDisplay();
    }
    if (isArithmeticOperation(currentInput)) {
        switchCurrentOperand();
    }
    if (isCalculatorOperation(currentInput)) {
        const calculatorOperation = currentInput;
        switch(calculatorOperation) {
            case 'clear':
                clear();
        }
    }
}

const calculatorDisplay = document.querySelector("#display-text");
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener('click', manageCalculation));

let currentInput;
// A calculator operation has two operands and an operator
let operands = ["0", "0"]
let operator = "";
let currentOperand = 0;
let result = 0;