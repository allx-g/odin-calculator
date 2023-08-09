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
    num1 = parseInt(operand1);
    num2 = parseInt(operand2);
    switch (operator) {
        case 'add':
            result = add(num1, num2);
            break;
        case 'subtract':
            result = subtract(num1, num2);
            break;
        case 'multiply':
            result = multiply(num1, num2);
            break;
        case 'divide':
            result = divide(num1, num2);
            break;
    }

    stringResult = result.toString();
    operands[0].value = result;
    operands[0].isCalculated = true;
    console.log('result: ', result);
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
    calculatorDisplay.textContent = operands[currentOperand].value;
}

function clear() {
    operands[currentOperand].value = "0";

    if (currentOperand === 1 && operands[1].cleared) {
        operands[0].value = "0";
        operands[1].value = "0";
        currentOperand = 0;
        result = 0;
        operands[1].cleared = false;
        console.log('superly cleared');
    }
    if (currentOperand === 1) {
        operands[1].cleared = true;
    }
    updateDisplay();
    console.log('cleared');
}

function updateOperand(num) {
    (operands[currentOperand].value === "0") ? 
    operands[currentOperand].value = num :
    operands[currentOperand].value += num;

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
    console.log('operation'); 
    if (isArithmeticOperation(currentInput)) {
        operator = currentInput;
        if (currentOperand === 1) {
            console.log('chained operation')
            result = operate(operands[0].value, operator, operands[1].value);
            operands[0].value = result.toString();
            operands[1].value = "0";
            currentOperand = 0;
            updateDisplay();
            currentOperand = 1;
        }
        if (currentOperand === 0) {
            switchCurrentOperand();
        }
        
    }
    if (isCalculatorOperation(currentInput)) {
        const calculatorOperation = currentInput;
        switch(calculatorOperation) {
            case 'clear':
                clear();
                break;
            case 'equals':
                result = operate(operands[0].value, operator, operands[1].value);
                currentOperand = 0;
                operands[1].value = "0";
                updateDisplay();
                break;
        }
    }
}

const calculatorDisplay = document.querySelector("#display-text");
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener('click', manageCalculation));

let currentInput;
// A calculator operation has two operands and an operator
let operands = [{ value: "0", isCalculated: false}, { value: "0", cleared: false }]
let operator = "";
let currentOperand = 0;
let result = 0;