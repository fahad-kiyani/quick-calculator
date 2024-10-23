// Constants
const DISPLAY_IDS = {
    OPERATION: 'operation',
    RESULT: 'result'
};

const MAX_INPUT_LENGTH = 100;
const MAX_DECIMAL_PLACES = 10;

// Calculator state
let memory = 0;
let lastResult = 0;

// Utility functions
function getElement(id) {
    return document.getElementById(id);
}

function isValidNumber(num) {
    return typeof num === 'number' && isFinite(num) && !isNaN(num);
}

function formatNumber(num) {
    if (!isValidNumber(num)) return '0';
    return Number(Number(num).toFixed(MAX_DECIMAL_PLACES)).toString();
}

// Display functions
function appendToDisplay(value) {
    const display = getElement(DISPLAY_IDS.OPERATION);
    if (!display) return;
    
    const currentValue = display.value;
    if (currentValue.length >= MAX_INPUT_LENGTH) {
        alert('Maximum input length reached');
        return;
    }
    
    // Prevent multiple decimal points in a number
    if (value === '.' && currentValue.split(/[-+*/]/).pop().includes('.')) {
        return;
    }
    
    // Prevent multiple operators in sequence
    if (['+', '-', '*', '/'].includes(value)) {
        const lastChar = currentValue.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            display.value = currentValue.slice(0, -1) + value;
            return;
        }
    }
    
    display.value += value;
}

function clearDisplay() {
    const operation = getElement(DISPLAY_IDS.OPERATION);
    const result = getElement(DISPLAY_IDS.RESULT);
    
    if (operation) operation.value = '';
    if (result) result.value = '';
}

function deleteLast() {
    const display = getElement(DISPLAY_IDS.OPERATION);
    if (display) {
        display.value = display.value.slice(0, -1);
    }
}

// Math operations
function safeEvaluate(expression) {
    // Remove all whitespace
    expression = expression.replace(/\s+/g, '');
    
    // Validate characters
    if (!/^[0-9+\-/.()%\s]$/.test(expression)) {
        throw new Error('Invalid characters in expression');
    }
    
    // Convert percentages
    expression = expression.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    
    // Split into tokens
    const tokens = expression.match(/(\d+(\.\d+)?|[+\-*/()])/g) || [];
    
    // Basic validation
    let parentheses = 0;
    for (const token of tokens) {
        if (token === '(') parentheses++;
        if (token === ')') parentheses--;
        if (parentheses < 0) throw new Error('Mismatched parentheses');
    }
    if (parentheses !== 0) throw new Error('Mismatched parentheses');
    
    // Create a safe evaluation context
    const mathContext = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => {
            if (b === 0) throw new Error('Division by zero');
            return a / b;
        }
    };
    
    // Use Function constructor with a controlled context
    const safeFunction = new Function(
        'mathContext',
        `'use strict';
        return ${expression}
            .replace(/[^0-9+\\-*/().]/g, '')
            .replace(/([\d.]+)\s*([-+/])\s([\d.]+)/g, 
                (_, a, op, b) => mathContext[op](parseFloat(a), parseFloat(b)))`
    );
    
    try {
        const result = safeFunction(mathContext);
        if (!isValidNumber(result)) {
            throw new Error('Invalid calculation result');
        }
        return result;
    } catch (error) {
        throw new Error('Invalid calculation');
    }
}

function calculate() {
    const operation = getElement(DISPLAY_IDS.OPERATION);
    const result = getElement(DISPLAY_IDS.RESULT);
    
    if (!operation || !result) return;
    
    try {
        const expression = operation.value;
        if (!expression) return;
        
        const calculatedResult = safeEvaluate(expression);
        lastResult = calculatedResult;
        result.value = formatNumber(calculatedResult);
    } catch (error) {
        alert(error.message || 'Invalid input');
        result.value = '';
    }
}

// Scientific functions
function sqrt() {
    const result = getElement(DISPLAY_IDS.RESULT);
    if (!result) return;
    
    const value = parseFloat(result.value);
    if (!isValidNumber(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    if (value < 0) {
        alert('Cannot calculate square root of negative number');
        return;
    }
    
    const sqrtResult = Math.sqrt(value);
    result.value = formatNumber(sqrtResult);
    lastResult = sqrtResult;
}

function square() {
    const result = getElement(DISPLAY_IDS.RESULT);
    if (!result) return;
    
    const value = parseFloat(result.value);
    if (!isValidNumber(value)) {
        alert('Please enter a valid number');
        return;
    }
    
    const squareResult = value * value;
    result.value = formatNumber(squareResult);
    lastResult = squareResult;
}

// Memory functions
function memoryAdd() {
    const result = getElement(DISPLAY_IDS.RESULT);
    if (!result) return;
    
    const value = parseFloat(result.value);
    if (isValidNumber(value)) {
        memory += value;
    }
}

function memorySubtract() {
    const result = getElement(DISPLAY_IDS.RESULT);
    if (!result) return;
    
    const value = parseFloat(result.value);
    if (isValidNumber(value)) {
        memory -= value;
    }
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    const operation = getElement(DISPLAY_IDS.OPERATION);
    if (operation) {
        operation.value += formatNumber(memory);
    }
}

// Theme management
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkMode = document.body.classList.contains('dark-theme');
    localStorage.setItem('calculatorTheme', isDarkMode ? 'dark' : 'light');
}

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        // Prevent default behavior for calculator keys
        if (['+', '-', '*', '/', '.', 'Enter', 'Escape', 'Backspace'].includes(key)) {
            event.preventDefault();
        }
        
        // Handle numeric and operator keys
        if (/[\d+\-*/.]/.test(key)) {
            appendToDisplay(key);
        }
        // Handle Enter for calculation
        else if (key === 'Enter') {
            calculate();
        }
        // Handle Escape for clear
        else if (key === 'Escape') {
            clearDisplay();
        }
        // Handle Backspace for delete
        else if (key === 'Backspace') {
            deleteLast();
        }
    });
});