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
    try {
        let result = eval(document.getElementById('operation').value);
        document.getElementById('result').value = result;
    } catch (error) {
        alert('Invalid input');
    }
}

// Add keyboard support for better user experience
document.addEventListener('keydown', function(event) {
    const key = event.key;
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', 'Enter', 'Backspace'];

    if (allowedKeys.includes(key)) {
        if (key === 'Enter') {
            calculate();
        } else if (key === 'Backspace') {
            deleteLast();
        } else {
            appendToDisplay(key);
        }
    }
});