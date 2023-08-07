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
        
function manageCalculation(e) {
    const button = e.target;
    currentInput = button.getAttribute('data-key');
    console.log("input: ", currentInput);


    if (+currentInput === +currentInput) {
        switch (currentOperand) {
            case 1:
                operand1 += currentInput;
                console.log("op1: ", operand1);
                break;
            case 2:
                operand2 += currentInput;
                console.log("op2: ", operand2);
                break;
        }
    }
    if (currentInput === "add") {
        currentOperand = (currentOperand == 1) ? 2 : 1; 
        console.log(currentOperand);
    }
}

const calculatorDisplay = document.querySelector("#display-text");
const buttons = document.querySelectorAll("button");
buttons.forEach(button => button.addEventListener('click', manageCalculation));

let currentInput;
// A calculator operation has two operands and an operator
let operand1 = "";
let operand2 = "";
let operator = "";
let currentOperand = 1;