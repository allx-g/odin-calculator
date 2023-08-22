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
    console.log('result: ', stringResult);
    if (stringResult.length > NUMBER_LENGTH_LIMIT) {
        console.log("big num: ", stringResult);
        let exponentialResult = parseFloat(stringResult).toExponential(3);
        stringResult = exponentialResult.toString();
    }
    else if (stringResult.includes(".")) {
        decimalPlaces = getDecimalPlaces(stringResult);
        let roundedResult = +parseFloat(stringResult).toFixed(decimalPlaces);
        stringResult = roundedResult.toString();
    }
    operands[FIRST_OPERAND].isCalculated = true;
    operands[SECOND_OPERAND].isInput = false;
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
    return /^\d+$/.test(string) || string === ".";
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
    return CALCULATOR_OPERATIONS.includes(string);
}

function updateDisplay() {
    calculatorDisplay.textContent = operands[currentOperand].value;
}

function clear() {
    operands[currentOperand].value = "0";

    if (currentOperand === SECOND_OPERAND && operands[SECOND_OPERAND].cleared) {
        turnOffCurrentOperationButton();
        operands[FIRST_OPERAND].value = "0";
        operands[SECOND_OPERAND].value = "0";
        currentOperand = FIRST_OPERAND;
        result = 0;
        operands[1].cleared = false;
        console.log('superly cleared');
    }
    if (currentOperand === SECOND_OPERAND) {
        operands[SECOND_OPERAND].cleared = true;
        operands[SECOND_OPERAND].isInput = false;
    }
    updateDisplay();
    console.log('cleared');
}

function undo() {
    console.log('inside undo function');
    if (operands[currentOperand].value !== "0") {
        const operandLength = operands[currentOperand].value.length;

        if (operandLength === 1 || operands[currentOperand].isCalculated) {
            operands[currentOperand].value = "0";
        }
        if (operandLength > 1) {
            operands[currentOperand].value = operands[currentOperand].value.slice(0, operandLength - 1);
        }
    }
    updateDisplay();
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
        operands[SECOND_OPERAND].isInput = true;
    }
}

function switchCurrentOperand() {
    currentOperand = (currentOperand === FIRST_OPERAND) ?
        SECOND_OPERAND :
        FIRST_OPERAND;
}

function evaluateCurrentExpression() {
    const firstOperandValue = operands[FIRST_OPERAND].value;
    const secondOperandValue = operands[SECOND_OPERAND].value;

    turnOffCurrentOperationButton();
    result = operate(firstOperandValue, operator, secondOperandValue);
    operands[FIRST_OPERAND].value = result;
    currentOperand = FIRST_OPERAND;
    operands[SECOND_OPERAND].value = "0";
}

function turnOnCurrentOperationButton(e) {
    const operationButton = e.target;
    if (!operationButton.classList.contains('active-operation')) {
        operationButton.classList.add('active-operation');
    }
}

function turnOffCurrentOperationButton() {
    if (operator != '') {
        const currentOperationButtton = operationsContainer.querySelector(`button[data-key="${operator}"`);
        currentOperationButtton.classList.remove('active-operation');
    }
}
        
function manageCalculation(e) {
    function chainOperation() {
        evaluateCurrentExpression();
        updateDisplay();
        // Prepare input for the second operand.
        currentOperand = SECOND_OPERAND;
    }


    const button = e.target;
    input = button.getAttribute('data-key');

    if (isNumber(input)) {
        const num = input;
        turnOffCurrentOperationButton();
        updateOperandValue(num);
        updateDisplay();
    }
    else if (isArithmeticOperation(input)) {
        const operand = operands[currentOperand];
        if (operand.value !== DIVIDE_BY_ZERO_ERROR) {
            if (currentOperand === SECOND_OPERAND && operand.isInput) {
                chainOperation();
            }
            else if (currentOperand === FIRST_OPERAND) {
                switchCurrentOperand();
            }
            turnOffCurrentOperationButton();
            turnOnCurrentOperationButton(e);
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
                    evaluateCurrentExpression();
                    updateDisplay();
                }
                break;
            case 'undo':
                undo();
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
            document.querySelector('button[data-key="equals"]').click();
        }
        if (operation === "Backspace") {
            document.querySelector('button[data-key="undo"]').click();
        }
        switch (operation) {
            case "+":
                operationsContainer.querySelector(`button[data-key="add"]`).click();
                break;
            case "-":
                operationsContainer.querySelector(`button[data-key="subtract"]`).click();
                break;
            case "/":
                operationsContainer.querySelector(`button[data-key="divide"]`).click();
                break;
            case "*":
                operationsContainer.querySelector(`button[data-key="multiply"]`).click();
                break;
        }
    }

    const keyValue = e.key;
    const POSSIBLE_OPERATION_KEYS = ["+", "-", "/", "*", "Enter", "Backspace"];
    
    if (isNumber(keyValue)) {
        const digit = keyValue;
        clickCorrespondingNumber(e, digit)
    }
    else if (POSSIBLE_OPERATION_KEYS.includes(keyValue)) {
        const operation = keyValue;
        clickCorrespondingOperation(e, operation);
    }
}

const calculatorDisplay = document.querySelector("#display-text");
const buttons = document.querySelectorAll("button");
const operationsContainer = document.querySelector('.operations');
buttons.forEach(button => {
    button.addEventListener('click', manageCalculation);
});
document.addEventListener('keydown', processKeyboardInput);

const DIVIDE_BY_ZERO_ERROR = "OUCHIES";
const NUMBER_LENGTH_LIMIT = 9;
const FIRST_OPERAND = 0;
const SECOND_OPERAND = 1;
const CALCULATOR_OPERATIONS = ['equals', 'clear', 'undo'];

let input;
// A calculator operation has two operands and an operator
let operands = [
    { 
        value: "0", 
        isCalculated: false
    },
    {
        value: "0",
        cleared: false, 
        isInput: false
    }
];
let operator = "";
let currentOperand = FIRST_OPERAND;
let result = 0;
