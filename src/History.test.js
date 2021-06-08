import {render, screen} from '@testing-library/react';
import History from './History';

const props = {
  resultHist: [{input: '8+8', result: '16'}],
};

describe('App', () => {
  test('renders elements properly', () => {
    const {getByText} = render(<History {...props} />);

    expect(getByText('8+8')).toBeInTheDocument();
    expect(getByText('16')).toBeInTheDocument();
  });
});
