import Button from '../Button';
import { fireEvent, render, screen } from '@testing-library/react';

describe('When button component is mountend', () => {
  test('Should be render', () => {
    render(
      <Button>
        <p>Children</p>
      </Button>
    );
    const children = screen.getByText('Children');

    expect(children).toBeInTheDocument();
  });

  describe('When the  props loading is a true', () => {
    test('Should be display the spinner component and hidden the children', () => {
      render(
        <Button loading={true}>
          <p>Children</p>
        </Button>
      );

      const children = screen.queryByText('Children');
      const spinner = screen.getByTestId('spinner');

      expect(spinner).toBeInTheDocument();
      expect(children).not.toBeInTheDocument();
    });
  });
});
