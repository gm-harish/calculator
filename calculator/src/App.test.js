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

  test('test add button', () => {
    const {getByTestId} = render(<App />);

    fireEvent.click(getByTestId('button1'));
    expect(getByTestId('input')).toHaveValue('1');

    fireEvent.click(getByTestId('button2'));
    expect(getByTestId('input')).toHaveValue('12');

    fireEvent.click(getByTestId('button+'));
    expect(getByTestId('input')).toHaveValue('12+');

    fireEvent.click(getByTestId('button7'));
    expect(getByTestId('input')).toHaveValue('12+7');

    fireEvent.click(getByTestId('button='));
    expect(getByTestId('result')).toHaveValue('19');
  });

  test('test multiply button', () => {
    const {getByTestId} = render(<App />);

    fireEvent.click(getByTestId('button3'));
    expect(getByTestId('input')).toHaveValue('3');

    fireEvent.click(getByTestId('button0'));
    expect(getByTestId('input')).toHaveValue('30');

    fireEvent.click(getByTestId('button*'));
    expect(getByTestId('input')).toHaveValue('30*');

    fireEvent.click(getByTestId('button1'));
    expect(getByTestId('input')).toHaveValue('30*1');

    fireEvent.click(getByTestId('button='));
    expect(getByTestId('result')).toHaveValue('30');
    
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

  test('test trignometry values', () => {
    const {getByTestId} = render(<App />);

    fireEvent.click(getByTestId('button9'));
    expect(getByTestId('input')).toHaveValue('9');

    fireEvent.click(getByTestId('button0'));
    expect(getByTestId('input')).toHaveValue('90');

    fireEvent.click(getByTestId('buttonsin'));
    expect(getByTestId('input')).toHaveValue('sin(90)');

    fireEvent.click(getByTestId('button='));
    expect(getByTestId('result')).toHaveValue('0.8939966636005579')
  });

  test('test impoper values', () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const {getByTestId} = render(<App />);

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8');

    fireEvent.click(getByTestId('button)'));
    expect(getByTestId('input')).toHaveValue('8)');

    fireEvent.click(getByTestId('button='));
    expect(window.alert).toHaveBeenCalled();

  });

  test('test undo button', () => {
    const {getByTestId} = render(<App />);

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8');

    fireEvent.click(getByTestId('button+'));
    expect(getByTestId('input')).toHaveValue('8+');

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8+8');

    fireEvent.click(getByTestId('button='));
    expect(getByTestId('result')).toHaveValue('16');

    fireEvent.click(getByTestId('button8'));
    expect(getByTestId('input')).toHaveValue('8+88');

    fireEvent.click(getByTestId('buttonundo'));
    expect(getByTestId('input')).toHaveValue('8+8');
    expect(getByTestId('result')).toHaveValue('0');
  });
});
