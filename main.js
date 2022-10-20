const screen = document.querySelector('.screen__input');
const numpad = document.querySelector(".numpad");
const buttons = numpad.querySelectorAll("button");
const ac_btn = numpad.querySelector("button[data-action=clear");

class Calculator {
  constructor(screen, buttons, ac_btn) {
    this.ac_btn = ac_btn;
    this.updateAcBtn("AC");
    this.operation = null;
    this.previous = null;
    this.current = null;
    this.fractional = false;

    this.total = 0;
    this.screen = screen;
    this.renderNum(0);


    /* Set up click handlers. */
    buttons.forEach(button => button.addEventListener('click', e => {
      if (!button.dataset.action) {
        this.numberPress(parseInt(button.innerText));
      } else {
        this.actionPress(button.dataset.action);
      }
    }));
  }

  sum(a, b) {
    return a + b;
  }
  mul(a, b) {
    return a * b;
  }
  sub(a, b) {
    return a - b;
  }
  div(a, b) {
    return a / b;
  }

  calculate() {
    if (this.operation) {
      const result = this.operation(this.previous, this.current);
      this.previous = result;
      this.operation = null;
      this.renderNum(result);
    } else if (this.current !== null) {
      this.previous = this.current;
      this.renderNum(this.current);
    }
    this.current = null;
    this.fractional = false;
  }

  actionPress(action) {
    this.updateAcBtn("C");
    switch (action) {
      /* Binary operators */
      case '+':
        this.calculate();
        this.operation = this.sum;
        break;
      case '*':
        this.calculate();
        this.operation = this.mul;
        break;
      case '-':
        this.calculate();
        this.operation = this.sub;
        break;
      case '/':
        this.calculate();
        this.operation = this.div;
        break;
      /* Singular operators. */
      case 'clear':
        this.updateAcBtn("AC");
        this.current = null;
        this.previous = null;
        this.operation = null;
        this.fractional = false;
        this.renderNum(0);
        break;
      case '=':
        this.calculate();
        break;
      case '+/-':
        if (this.current === null) {
          this.current = 0;
        }
        this.current *= -1;
        this.renderNum(this.current);
        break;
      case '%':
        if (!this.current && this.previous) {
          this.current = this.previous;
        }
        if (this.current) {
          this.current /= 100.0;
          this.renderNum(this.current);
        }
        break;
      case '.':
        if (!this.fractional) {
          this.fractional = true;
          /* TODO: Get appropriate symbol from locale */
          if (!this.current) {
            this.renderNum(0);
          }
          this.screen.innerText += "."
        }
        break;
      default:
        console.log(`Warning: Unsupported action "${action}"`);
    }
  }

  isZeroNegative(zero) {
    const isZero = zero === 0;
    const isNegative = 1 / zero === -Infinity;
    return isNegative && isZero;
  }

  numberPress(digit) {
    this.updateAcBtn("C");
    if (!this.fractional) {
      if (this.current === null) {
        this.current = 0;
      }
      if (this.current < 0 || this.isZeroNegative(this.current)) {
        digit = -digit;
      }
      this.current *= 10;
      this.current += digit;
    }
    else {
      let s = (this.current ?? 0).toString();
      if (!s.match(/\./)) {
        s += ".";
      }
      s += digit.toString();
      this.current = parseFloat(s);
    }
    this.renderNum(this.current);
  }

  updateAcBtn(text) {
      this.ac_btn.innerText = text;
  }

  renderNum(num) {
    let output_str = num.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      }
    );

    if (output_str.length > 8 || (num !== 0 && num < 0.00001 && output_str === "0")) {
      output_str = num.toExponential(2);
    }

    this.screen.innerText = output_str;
  }
}

const calculator = new Calculator(screen, buttons, ac_btn);

document.addEventListener('keypress', e => {
  let name = e.key;
  let code = e.code;

  switch (name) {
    case "*":
    case "/":
    case "-":
    case "+":
    case ".":
    case "=":
      calculator.actionPress(name);
      e.preventDefault();
      break;
    case "0":
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      calculator.numberPress(parseInt(name));
      e.preventDefault();
      break;
    case "Enter":
      calculator.actionPress("=");
      e.preventDefault();
      break;
  }
}, false);

document.addEventListener('keyup', e => {
  let name = e.key;
  let code = e.code;

  switch (name) {
    case "Escape":
    case "Backspace":
    case "Delete":
      calculator.actionPress("clear");
      e.preventDefault();
      break;
  }
}, false);