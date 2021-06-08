import React from 'react';
import './App.css';
import {evaluate, format} from 'mathjs';
import History from './History';

const rows = [
  ['sin', 'cos', 'tan', 'c'],
  ['1', '2', '3', '*'],
  ['4', '5', '6', '-'],
  ['7', '8', '9', '+'],
  ['.', '0', '=', '/'],
  ['ce', '(', ')', 'undo'],
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

function validateBrackets(s) {
  let temp = 0;
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === '(') {
      temp++;
    } else if (s.charAt(i) === ')') {
      temp--;
    }
  }

  return temp === 0 ? true : false;
}

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      input: '0',
      result: '0',
      resultHist: [],
      isValueEnabled: false,
      errorMsg: '',
      resultHistIndex: -1,
    };
    this.onKeyPadPress = this.onKeyPadPress.bind(this);
    this.doOperation = this.doOperation.bind(this);
    this.onInputText = this.onInputText.bind(this);
    this.OnTrigValues = this.OnTrigValues.bind(this);
    this.onUndoPress = this.onUndoPress.bind(this);
  }

  validateInput() {
    this.setState({errorMsg: ''});
    if (!validateBrackets(this.state.input)) {
      this.setState({
        result: 'Math Err',
        isValueEnabled: true,
        errorMsg: 'please check brackets',
      });
    } else if (!validate(this.state.input)) {
      console.log('123');
      this.setState({
        result: 'Math Err',
        isValueEnabled: true,
        errorMsg: 'please enter both values of operator',
      });
    } else {
      this.calculateResult();
    }
  }

  calculateResult() {
    try {
      const result = evaluate(this.state.input);
      if (typeof result === 'number') {
        this.setState({
          result: format(result, 8),
          isValueEnabled: true,
        });
        this.setState((prevState) => ({
          resultHist: prevState.resultHist.concat({
            input: prevState.input,
            result: prevState.result,
          }),
          resultHistIndex: prevState.resultHistIndex + 1,
        }));
      } else {
        throw Error('unkown maths');
      }
    } catch (e) {
      console.log(e);
      this.setState({
        result: 'Math Err',
        isValueEnabled: true,
        errorMsg: 'please enter proper values',
      });
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
      this.setState((prevState) => ({
        input: prevState.input + text + '(',
      }));
    } else {
      this.setState({
        input: text + '(',
      });
    }
  }

  onInputText(text) {
    this.setState({input: text});
  }

  onUndoPress() {
    if (this.state.resultHistIndex > -1) {
      const lastExp = this.state.resultHist[this.state.resultHistIndex];
      this.setState({input: lastExp.input, result: '0'});
      this.setState((prevState) => ({
        resultHistIndex: prevState.resultHistIndex - 1,
      }));
    }
  }

  doOperation(operator) {
    this.setState({isValueEnabled: false, errorMsg: ' '});

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
        this.validateInput();
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
      <div className="AppContainer">
        <form className="formContainer" name="calculator">
          <div
            style={this.state.isValueEnabled ? {opacity: 1} : {opacity: 0}}
            className="valueContainer"
          >
            {this.state.result}
          </div>
          <input
            data-testid="input"
            type="text"
            className="inputContainer"
            autoFocus
            value={this.state.input}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                e.preventDefault();
                this.validateInput();
              }
            }}
            onChange={(e) => {
              this.setState({isValueEnabled: false});
              this.onInputText(e.target.value);
            }}
          ></input>
          <p
            style={
              this.state.errorMsg
                ? {visibility: 'visible'}
                : {visibility: 'hidden'}
            }
            className="error_form"
          >
            {this.state.errorMsg}
          </p>
          <table className="table">
            <tbody>
              {/* <tr>
              <th colSpan="4"></th>
            </tr> */}
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
                <td colSpan="1">
                  <button
                    data-testid="copyButton"
                    type="button"
                    className="button"
                    style={{width: '100%'}}
                    onClick={() => {
                      this.doOperation('deg');
                    }}
                  >
                    deg
                  </button>
                </td>
                <td colSpan="3">
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
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <History resultHist={this.state.resultHist} />
      </div>
    );
  }
}

export default App;
