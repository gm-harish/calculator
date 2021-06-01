import React from 'react';
import './App.css';
import {evaluate} from 'mathjs';

const rows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '='],
  ['+', '-', '*'],
  ['sin', 'cos', '/'],
  ['ce', 'c', 'undo'],
  ['(', ')', 'tan'],
];
//tan, brackets

function validate(text) {
  switch (text.slice(-1)) {
    case '+':
    case '-':
    case '*':
    case '/':
      return false;
    default:
      return true;
  }
}

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      input: '0',
      result: '0',
      resultHist: [],
    };
    this.onKeyPadPress = this.onKeyPadPress.bind(this);
    this.doOperation = this.doOperation.bind(this);
    this.onInputText = this.onInputText.bind(this);
    this.OnTrigValues = this.OnTrigValues.bind(this);
    this.onUndoPress = this.onUndoPress.bind(this);
  }

  calculateResult() {
    if (validate(this.state.input)) {
      try {
        const result = evaluate(this.state.input);
        console.log(result);
        this.setState({
          result,
        });
        this.setState((prevState) => ({
          resultHist: prevState.resultHist.concat(prevState.input),
        }));
      } catch (e) {
        console.log(e);
        alert('please enter proper values');
      }
    } else {
      alert('please enter both values of operator');
      this.setState({result: 'Math Err'});
    }
  }

  onKeyPadPress(text) {
    if (this.state.input === '0') {
      this.setState({input: validate(text) || text !== '0' ? text : '0'});
    } else {
      this.setState((prevState) => ({
        input:
          validate(prevState.input) || validate(text)
            ? prevState.input + text
            : prevState.input.slice(0, -1) + text,
      }));
    }
  }

  OnTrigValues(text) {
    if (this.state.input !== '0') {
      console.log(text);
      this.setState((prevState) => ({
        input: text + '(' + prevState.input + ')',
      }));
    }
  }

  onInputText(text) {
    this.setState({input: text});
  }

  onUndoPress() {
    const lastExp = this.state.resultHist[this.state.resultHist.length - 1];
    if (lastExp) {
      this.setState({input: lastExp, result: '0'});
      this.setState({resultHist: this.state.resultHist.slice(0, -1)});
    }
  }

  doOperation(operator) {
    switch (operator) {
      case 'c':
        this.setState((prevState) => ({
          input: prevState.input.slice(0, -1),
        }));
        break;
      case 'ce':
        this.setState({input: '0'});
        break;
      case '=':
        this.calculateResult();
        break;
      case 'sin':
      case 'cos':
      case 'tan':
        this.OnTrigValues(operator);
        break;
      case 'undo':
        this.onUndoPress();
        break;
      default:
        this.onKeyPadPress(operator);
        break;
    }
  }

  render() {
    return (
      <table className="table">
        <tbody>
          <tr>
            <th colSpan="3">
              <input
                data-testid="input"
                type="text"
                value={this.state.input}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    this.calculateResult();
                  }
                }}
                onChange={(e) => {
                  this.onInputText(e.target.value);
                }}
              ></input>
            </th>
          </tr>
          <tr>
            <th colSpan="3">
              <input
                data-testid="result"
                readOnly
                type="text"
                value={this.state.result}
              ></input>
            </th>
          </tr>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((el, i) => (
                <td key={i}>
                  <button
                    data-testid={'button' + el}
                    className="button"
                    type="button"
                    onClick={() => this.doOperation(el)}
                  >
                    {el}
                  </button>
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th colSpan="3">
              <button
                data-testid="copyButton"
                type="button"
                className="button"
                style={{width: '100%'}}
                onClick={() => {
                  navigator.clipboard.writeText(this.state.result);
                }}
              >
                Copy Result
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default App;
