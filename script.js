let memory = 0;  // Memory for storing values

// Function to append numbers and operators to the display
function appendToDisplay(value) {
    document.getElementById('operation').value += value;
}

// Function to clear the display
function clearDisplay() {
    document.getElementById('operation').value = '';
    document.getElementById('result').value = '';
}

// Function to delete the last character
function deleteLast() {
    let currentValue = document.getElementById('operation').value;
    document.getElementById('operation').value = currentValue.slice(0, -1);
}

// Function to calculate the result
function calculate() {
    let expression = document.getElementById('operation').value;

    // Handle percentage operator and trigonometric functions
    expression = expression.replace(/(\d+)%/g, '(($1)*0.01)');

    try {
        let result = new Function('return ' + expression)();
        document.getElementById('result').value = result;
    } catch (error) {
        alert('Invalid input');
    }
}

// Scientific Functions
function sqrt() {
    let currentValue = document.getElementById('operation').value;
    document.getElementById('operation').value = `Math.sqrt(${currentValue})`;
}

function square() {
    let currentValue = document.getElementById('operation').value;
    document.getElementById('operation').value = `${currentValue}**2`;
}

function power() {
    let currentValue = document.getElementById('operation').value;
    document.getElementById('operation').value = `Math.pow(${currentValue}, `;
}

// Memory Functions
function memoryAdd() {
    memory += parseFloat(document.getElementById('result').value) || 0;
}

function memorySubtract() {
    memory -= parseFloat(document.getElementById('result').value) || 0;
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    document.getElementById('operation').value += memory;
}

// Dark Mode Toggle
let darkMode = false;
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    darkMode = !darkMode;
}