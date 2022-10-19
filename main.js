const screen = document.querySelector('.screen__input');
const numpad = document.querySelector(".numpad");
const buttons = numpad.querySelectorAll("button");

class Calculator {
  constructor(screen, buttons) {
    this.operation = null;
    this.previous = 0;

    this.total = 0;
    this.screen = screen;
    this.updateScreen();

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

  actionPress(action) {
    switch (action) {
      /* Binary operators */
      case '+':
        this.operation = this.sum;
        this.previous = this.total;
        this.total = 0;
        break;
      case '*':
        this.operation = this.mul;
        this.previous = this.total;
        this.total = 0;
        break;
      case '-':
        this.operation = this.sub;
        this.previous = this.total;
        this.total = 0;
        break;
      case '/':
        this.operation = this.div;
        this.previous = this.total;
        this.total = 0;
        break;
      /* Singular operators. */
      case 'clear':
        this.total = 0;
        this.updateScreen();
        break;
      case '=':
        console.log(`Prev: ${this.previous} Tot: ${this.total} Op: ${this.operation.toString()}`);
        this.total = this.operation(this.previous, this.total);
        this.previous = this.total;
        this.updateScreen();
        break;
      case '+/-':
        this.total *= -1;
        this.updateScreen();
        break;
      case '%':
        this.total /= 100.0;
        this.updateScreen();
        break;
      default:
        console.log(action);
    }
  }

  numberPress(digit) {
    this.total *= 10;
    this.total += digit;

    this.updateScreen();
  }

  updateScreen() {
    let result = this.total.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      }
    );

    if (result.length > 8 || (this.total !== 0 && this.total < 0.00001 && result === "0")) {
      result = this.total.toExponential(2);
    }

    this.screen.innerText = result;
  }
}

const calculator = new Calculator(screen, buttons);
