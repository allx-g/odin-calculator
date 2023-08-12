function add(a, b) { return a + b; }

function subtract(a, b) { return a - b; }

function multiply(a, b) { return a * b; }

function divide(a, b) {
    // Division by zero is not allowed, so return a funny message.
    if (b === 0) {
        return DIVIDE_BY_ZERO_ERROR;
    }
    return a / b; 
}

function operate(operand1, operator, operand2) {
    let result;
    num1 = parseFloat(operand1);
    num2 = parseFloat(operand2);
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
    if (stringResult.includes(".")) {
        decimalPlaces = getDecimalPlaces(stringResult);
        let roundedResult = +parseFloat(stringResult).toFixed(decimalPlaces);
        stringResult = roundedResult.toString();
    }
    else if (stringResult.length > NUMBER_LENGTH_LIMIT) {
        let exponentialResult = parseInt(stringResult).toExponential(3);
        stringResult = exponentialResult.toString();
    }
    operands[FIRST_OPERAND].value = stringResult;
    operands[FIRST_OPERAND].isCalculated = true;
    operands[SECOND_OPERAND].cleared = false;
    return stringResult;
}

function getDecimalPlaces(numString) {
    let count = 0;
    for (let i = 0; i < numString.length; i++) {
        count++;
        if(numString.charAt(i) === ".") {
            break;
        }
    }
    return NUMBER_LENGTH_LIMIT - count;
}

function isNumber(string) {
    return /^\d+$/.test(string);
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

    if (currentOperand === SECOND_OPERAND && operands[SECOND_OPERAND].cleared) {
        operands[FIRST_OPERAND].value = "0";
        operands[SECOND_OPERAND].value = "0";
        currentOperand = FIRST_OPERAND;
        result = 0;
        operands[1].cleared = false;
        console.log('superly cleared');
    }
    if (currentOperand === SECOND_OPERAND) {
        operands[SECOND_OPERAND].cleared = true;
    }
    updateDisplay();
    console.log('cleared');
}

function updateOperandValue(numToAdd) {
    if (operands[currentOperand].value === "0" || operands[currentOperand].isCalculated) {
        operands[currentOperand].value = numToAdd; // Replace the number displayed;
        operands[currentOperand].isCalculated = false;
    }
    else if (operands[currentOperand].value.length < NUMBER_LENGTH_LIMIT) {
        operands[currentOperand].value += numToAdd; // Concatenate to the number displayed;
    }
    if (currentOperand === SECOND_OPERAND) {
        operands[SECOND_OPERAND].cleared = false;
    }
}

function switchCurrentOperand() {
    currentOperand = (currentOperand === FIRST_OPERAND) ?
        SECOND_OPERAND :
        FIRST_OPERAND;
}
        
function manageCalculation(e) {
    const button = e.target;
    input = button.getAttribute('data-key');
    const firstOperandValue = operands[FIRST_OPERAND].value;
    const secondOperandValue = operands[SECOND_OPERAND].value;

    if (isNumber(input)) {
        const num = input;
        updateOperandValue(num);
        updateDisplay();
    }
    else if (isArithmeticOperation(input)) {
        if (operands[currentOperand].value !== DIVIDE_BY_ZERO_ERROR) {
            if (currentOperand === SECOND_OPERAND) {
                result = operate(firstOperandValue, operator, secondOperandValue);
                operands[FIRST_OPERAND].value = result;
                operands[SECOND_OPERAND].value = "0";
                currentOperand = FIRST_OPERAND;
                updateDisplay();
                currentOperand = SECOND_OPERAND;
            }
            if (currentOperand === FIRST_OPERAND) {
                switchCurrentOperand();
            }
            operator = input;
        }
    } 
    else if (isCalculatorOperation(input)) {
        const calculatorOperation = input;
        const operatorWasGiven = operator != '';
        switch(calculatorOperation) {
            case 'clear':
                clear();
                break;
            case 'equals':
                if (operatorWasGiven) {
                    result = operate(firstOperandValue, operator, secondOperandValue);
                    currentOperand = 0;
                    operands[SECOND_OPERAND].value = "0";
                    updateDisplay();
                }
                break;
        }
    }
    console.log("operands: ", operands);
}

function processKeyboardInput(e) {
    function clickCorrespondingNumber(e, digit) {
        e.preventDefault();
        document.querySelector(`button[data-key="${digit}"]`).click();
    }
    function clickCorrespondingOperation(e, operation) {
        e.preventDefault();
        if (operation === "Enter" || operation === "=") {
            document.querySelector(`button[data-key="equals"]`).click();
        }
        switch (operation) {
            case "+":
                document.querySelector(`button[data-key="add"]`).click();
                break;
            case "-":
                document.querySelector(`button[data-key="subtract"]`).click();
                break;
            case "/":
                document.querySelector(`button[data-key="divide"]`).click();
                break;
            case "*":
                document.querySelector(`button[data-key="multiply"]`).click();
                break;
        }
    }

    const keyValue = e.key;
    const POSSIBLE_OPERATIONS = ["+", "-", "/", "*", "Enter"];
    
    if (isNumber(keyValue)) {
        const digit = keyValue;
        clickCorrespondingNumber(e, digit)
    }
    else if (POSSIBLE_OPERATIONS.includes(keyValue)) {
        const operation = keyValue;
        clickCorrespondingOperation(e, operation);
    }
}

const calculatorDisplay = document.querySelector("#display-text");
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener('click', manageCalculation));
document.addEventListener('keydown', processKeyboardInput);

const DIVIDE_BY_ZERO_ERROR = "OUCHIES";
const NUMBER_LENGTH_LIMIT = 9;
const FIRST_OPERAND = 0;
const SECOND_OPERAND = 1;

let input;
// A calculator operation has two operands and an operator
let operands = [
    { 
        value: "0", 
        isCalculated: false
    },
    {
        value: "0",
        cleared: false 
    }
];
let operator = "";
let currentOperand = FIRST_OPERAND;
let result = 0;
