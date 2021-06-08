import {render, screen, fireEvent} from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders elements properly', () => {
    render(<App />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('undo')).toBeInTheDocument();
    expect(screen.getByText('ce')).toBeInTheDocument();
    expect(screen.getByText('c')).toBeInTheDocument();

    expect(screen.getByText('tan')).toBeInTheDocument();
    expect(screen.getByText(')')).toBeInTheDocument();
  });

  test('test add operation', () => {
    const {getByTestId, container} = render(<App />);

    fireEvent.click(getByTestId('button1'));
    expect(getByTestId('input')).toHaveValue('1');

    fireEvent.click(getByTestId('button2'));
    expect(getByTestId('input')).toHaveValue('12');

    fireEvent.click(getByTestId('button+'));
    expect(getByTestId('input')).toHaveValue('12+');

    fireEvent.click(getByTestId('button7'));
    expect(getByTestId('input')).toHaveValue('12+7');

    fireEvent.click(getByTestId('button='));
    const result = container.querySelector('#result');
    expect(result.textContent).toBe('19');
  });

  test('test multiply operation', () => {
    const {getByTestId, container} = render(<App />);

    fireEvent.click(getByTestId('button3'));
    expect(getByTestId('input')).toHaveValue('3');

    fireEvent.click(getByTestId('button0'));
    expect(getByTestId('input')).toHaveValue('30');

    fireEvent.click(getByTestId('button*'));
    expect(getByTestId('input')).toHaveValue('30*');

    fireEvent.click(getByTestId('button1'));
    expect(getByTestId('input')).toHaveValue('30*1');

    fireEvent.click(getByTestId('button='));
    const result = container.querySelector('#result');
    expect(result.textContent).toBe('30');
  });

  test('test leading zeroes', () => {
    const {getByTestId} = render(<App />);

    fireEvent.click(getByTestId('button0'));
    expect(getByTestId('input')).toHaveValue('0');

    fireEvent.click(getByTestId('button0'));
    expect(getByTestId('input')).toHaveValue('0');

    fireEvent.click(getByTestId('button1'));
    expect(getByTestId('input')).toHaveValue('1');
  });

  test('test trignometry values in rad', () => {
    const {getByTestId, container} = render(<App />);

    fireEvent.click(getByTestId('buttonsin'));
    expect(getByTestId('input')).toHaveValue('sin(');

    fireEvent.click(getByTestId('button9'));
    expect(getByTestId('input')).toHaveValue('sin(9');

    fireEvent.click(getByTestId('button0'));
    expect(getByTestId('input')).toHaveValue('sin(90');

    fireEvent.click(getByTestId('button)'));
    expect(getByTestId('input')).toHaveValue('sin(90)');

    fireEvent.click(getByTestId('button='));
    const result = container.querySelector('#result');
    expect(result.textContent).toBe('0.89399666');
  });

  test('test trignometry values in degree', () => {
    const {getByTestId, container} = render(<App />);

    fireEvent.click(getByTestId('buttonsin'));
    expect(getByTestId('input')).toHaveValue('sin(');

    fireEvent.click(getByTestId('button9'));
    expect(getByTestId('input')).toHaveValue('sin(9');

    fireEvent.click(getByTestId('button0'));
    expect(getByTestId('input')).toHaveValue('sin(90');

    fireEvent.click(getByTestId('deg'));
    expect(getByTestId('input')).toHaveValue('sin(90deg');

    fireEvent.click(getByTestId('button)'));
    expect(getByTestId('input')).toHaveValue('sin(90deg)');

    fireEvent.click(getByTestId('button='));
    const result = container.querySelector('#result');
    expect(result.textContent).toBe('1');
  });

  test('test impoper bracket values', () => {
    const {getByTestId, container} = render(<App />);

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8');

    fireEvent.click(getByTestId('button)'));
    expect(getByTestId('input')).toHaveValue('8)');

    fireEvent.click(getByTestId('button='));
    const result = container.querySelector('#result');
    const error = container.querySelector('#error');
    expect(result.textContent).toBe('Math Err');
    expect(error.textContent).toBe('please check brackets');
  });

  test('test impoper operand values', () => {
    const {getByTestId, container} = render(<App />);

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8');

    fireEvent.click(getByTestId('button+'));
    expect(getByTestId('input')).toHaveValue('8+');

    fireEvent.click(getByTestId('button='));
    const result = container.querySelector('#result');
    const error = container.querySelector('#error');
    expect(result.textContent).toBe('Math Err');
    expect(error.textContent).toBe('please enter both values of operator');
  });

  test('test impoper values', () => {
    const {getByTestId, container} = render(<App />);

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8');

    fireEvent.click(getByTestId('deg'));
    expect(getByTestId('input')).toHaveValue('8deg');

    fireEvent.click(getByTestId('button='));
    const result = container.querySelector('#result');
    const error = container.querySelector('#error');
    expect(result.textContent).toBe('Math Err');
    expect(error.textContent).toBe('please enter proper values');
  });

  test('test undo button', () => {
    const {getByTestId, container} = render(<App />);

    const result = container.querySelector('#result');

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8');

    fireEvent.click(getByTestId('button+'));
    expect(getByTestId('input')).toHaveValue('8+');

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8+8');

    fireEvent.click(getByTestId('button='));
    expect(result.textContent).toBe('16');

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8+88');

    fireEvent.click(getByTestId('buttonundo'));
    expect(getByTestId('input')).toHaveValue('8+8');
    expect(result.textContent).toBe('0');
  });
});
