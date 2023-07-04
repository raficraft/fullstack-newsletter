import { fireEvent, render, screen } from '@testing-library/react';
import Modal from '../Modal';

const mockCallback = jest.fn();
const mockText = 'Mock children';

describe('When Modal is mounted', () => {
  beforeEach(() => {
    render(
      <Modal close={mockCallback}>
        <h1>{mockText}</h1>
      </Modal>
    );
  });

  afterEach(() => {
    mockCallback.mockReset();
  });

  test('Should be rendered', () => {
    expect(screen.getByTestId('backdrop')).toBeInTheDocument();
  });

  test('Should be called callback when clicked on the cross icon', () => {
    const closeButton = screen.getByTestId('close_modal');

    fireEvent.click(closeButton);

    expect(mockCallback).toHaveBeenCalled();
  });

  test('Should be called callback when clicked on the background', () => {
    const background = screen.getByTestId('backdrop');

    fireEvent.click(background);

    expect(mockCallback).toHaveBeenCalled();
  });

  test('Should render this children', () => {
    const children = screen.getByText(mockText);

    expect(children).toBeInTheDocument();
  });
});
