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
        console.log('converting to exponential')
        let exponentialResult = parseInt(stringResult).toExponential(3);
        console.log(exponentialResult);
        stringResult = exponentialResult.toString();
    }
    operands[0].value = stringResult;
    operands[0].isCalculated = true;
    operands[1].cleared = false;
    console.log('result: ', result);
    return result;
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
    if (operands[currentOperand].value === "0" || operands[currentOperand].isCalculated) {
        operands[currentOperand].value = num;
    }
    else if (operands[currentOperand].value.length < NUMBER_LENGTH_LIMIT) {
        operands[currentOperand].value += num;
    }

}

function switchCurrentOperand() {
    currentOperand = (currentOperand === 0) ? 1 : 0;
}
        
function manageCalculation(e) {
    const button = e.target;
    currentInput = button.getAttribute('data-key');
    console.log("input: ", currentInput);
    console.log("currentOperand: ", currentOperand);
    
    if (isNumber(currentInput)) {
        const num = currentInput;
        updateOperand(num);
        operands[1].cleared = false;
        operands[0].isCalculated = false;
        updateDisplay();
    }
    console.log('operation');
    if (isArithmeticOperation(currentInput)) {
        if (operands[currentOperand].value !== DIVIDE_BY_ZERO_ERROR) {
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
            operator = currentInput;
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
    console.table("operands: ", operands);
    console.log("operand after: ", currentOperand);
}

function processKeyboardInput(e) {
    const code = e.code;
    console.log("key pressed: ", code);
    const key = e.key;
    console.log('event.key: ', key);
    const digit = getDigit(code);
    console.log(digit);
    const hasDigit = digit >= 0;

    const POSSIBLE_OPERATOR_KEYS = ["+", "-", "/", "*", "Enter"];
    1
    if (hasDigit) {
        e.preventDefault();
        document.querySelector(`button[data-key="${digit}"]`).click();
    }
    else if (POSSIBLE_OPERATOR_KEYS.includes(key)) {
        e.preventDefault();
        if (key === "Enter" || key === "=") {
            document.querySelector(`button[data-key="equals"]`).click();
        }
        switch (key) {
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
    

    function extractValue(e) {
        const code = e.code;
        const key = e.key;
        const digit = getDigit(code);
        const hasDigit = digit >= 0;

        if (hasDigit) {
            return digit;
        }
        else if (POSSIBLE_OPERATOR_KEYS.includes(key)) {
            return key;
        }

        return -1;
    }

    function getDigit(keyCode) {
        for (let i = 0; i < keyCode.length; i++) {
            const char = keyCode.charAt(i);
            if (isNumber(char)) {
                return parseInt(char);
            }
        }
        return -1;
    }
}

const calculatorDisplay = document.querySelector("#display-text");
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener('click', manageCalculation));
document.addEventListener('keydown', processKeyboardInput);

const DIVIDE_BY_ZERO_ERROR = "OUCHIES";
const NUMBER_LENGTH_LIMIT = 9;

let currentInput;
// A calculator operation has two operands and an operator
let operands = [{ value: "0", isCalculated: false}, { value: "0", cleared: false }]
let operator = "";
let currentOperand = 0;
let result = 0;
