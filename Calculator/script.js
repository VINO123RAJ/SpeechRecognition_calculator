const display = document.getElementById("display");
const calculator = document.getElementById("calc");
let expression = "";

function append(value) {
  if (expression === "0") expression = "";
  expression += value;
  updateDisplay();
}

function updateDisplay() {
  display.textContent = expression || "0";
}

function clearDisplay() {
  expression = "";
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  try {
    const result = eval(expression);
    expression = result.toString();
    updateDisplay();
    speak(`The answer is ${result}`);
  } catch (e) {
    expression = "Error";
    updateDisplay();
    speak("There was an error in the calculation.");
  }
}

function toggleTheme() {
  calculator.classList.toggle("dark");
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript.toLowerCase();
    transcript = transcript.replace(/x/gi, '*')
                           .replace(/times/gi, '*')
                           .replace(/into/gi, '*')
                           .replace(/divided by/gi, '/')
                           .replace(/plus/gi, '+')
                           .replace(/minus/gi, '-')
                           .replace(/equals to|equals|equal to|is equal to|is/gi, '=');

    const parts = transcript.split('=');
    if (parts.length > 1) {
      expression = parts[0];
      calculate();
    } else {
      expression += transcript;
      updateDisplay();
    }
  };
  recognition.start();
}

document.addEventListener("keydown", function (event) {
  const validKeys = "0123456789+-*/().";
  if (validKeys.includes(event.key)) {
    append(event.key);
  } else if (event.key === "Enter") {
    calculate();
  } else if (event.key === "Backspace") {
    backspace();
  } else if (event.key.toLowerCase() === "c") {
    clearDisplay();
  }
});
