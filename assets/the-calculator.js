//Initializing a constant for the calculator display.
const calculatorDisplay = document.getElementById("calc-display");

//This adds values to the calculator input.
function appendToDisplay(input) {
    //checks if it's an error, clears the display before sending the new input.
    if (calculatorDisplay.value === 'Error') {
        clearDisplay();
    } else if (input === '.' && calculatorDisplay.value.includes('.')) {
        //this checks whether there is a decimal point and makes sure that only ONE decimal point can be assigned to a number.
        const lastNumber = getLastNumber();
        if (lastNumber.includes('.')) {
            return;
        }
    } else if (input === '.' && calculatorDisplay.value === '') {
        calculatorDisplay.value += '0'; // adds '0' before the decimal point for the first decimal number
    } else if (/[+\*/]/.test(input) && calculatorDisplay.value === '') {
        // this prevents most operators for being used if there isn't a value present on the display. (this excludes subtraction in order to make negative numbers.)
        return;
    } else if (/[+\-*/]/.test(input) && /[+\-*/]/.test(calculatorDisplay.value.slice(-1))) {
        //this checks whether there is an operator on the display and changes it if another operator is chosen.
        if (!/\d/.test(calculatorDisplay.value) && input !== '-') {
            //this checks so that the previous statement doesn't change the operator if there is no numeric value.
            return;
        }
        calculatorDisplay.value = calculatorDisplay.value.slice(0, -1) + input;
        return;
    } else if (/[+\-*/]/.test(input) && /^[+\-*/()]*$/.test(calculatorDisplay.value) && input !== '-') {
        // this prevents any operator other than subtraction if the display contains only operators and parentheses
        return;
    }
    calculatorDisplay.value += input;
}

//it clears the display
function clearDisplay() {
    calculatorDisplay.value = "";
}


//it works like backspace, it deletes one at a time. (It clears the entire display if there's an error.)
function deleteDisplay() {
    if (calculatorDisplay.value === 'Error') {
        clearDisplay();
    }

    let currentCalculatorDisplayValue = calculatorDisplay.value;
    currentCalculatorDisplayValue = currentCalculatorDisplayValue.slice(0, -1);
    calculatorDisplay.value = currentCalculatorDisplayValue;
}

//it gets the last current number from the display by turning it into an array and splitting it
function getLastNumber() {
    const expression = calculatorDisplay.value;
    const numbers = expression.split(/(?=[+\-*/()])/);
    return numbers[numbers.length - 1];
}

//this is a slight modification of the normal eval function so that it can incorporate multiplication abbreviations like 8(2) to 8*(2) like how most modern calculators do it.
function customCalculate(expression) {
        // regex checking for when there's a number followed by opening parenthesis in order to use multiplication.
        expression = expression.replace(/(\d+)\(/g, '$1*(');
        // regex checking for when there's a number followed after closing paranthesis in order to use multiplication.
        expression = expression.replace(/\)(\d+)/g, ')*$1');
        // returns the evaluated expression
        return eval(expression);
}

//this calculates the given equation from the display by using the customCalculate function before rounding it to 10 decimal points.
function calculate() {
    try {
        let result = customCalculate(calculatorDisplay.value);
        result = Math.round((result + Number.EPSILON) * 10000000000) / 10000000000;
        calculatorDisplay.value = result;
    }
    catch(error) {
        calculatorDisplay.value = "Error";
    }
}