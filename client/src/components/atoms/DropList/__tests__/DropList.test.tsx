import { render, fireEvent, waitFor } from '@testing-library/react';
import DropList from '../DropList';

interface UseCase {
  openListOnClick: (
    selectButton: HTMLButtonElement,
    optionsList: HTMLElement
  ) => Promise<void>;

  openListOnKeyPress: (
    selectButton: HTMLButtonElement,
    optionsList: HTMLElement,
    key: string
  ) => Promise<void>;
}

const mockCallback = jest.fn();
const options = [
  { label: 'Sans-serif', value: 'sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
];

const selector = {
  select: 'select-button',
  optionsList: 'options-list',
  firstOptions: 'option-button-0',
  secondOption: 'option-button-1',
};

const renderDropList = () => {
  const { getByTestId } = render(
    <DropList options={options} callback={mockCallback} />
  );

  const selectButton = getByTestId(selector.select) as HTMLButtonElement;
  const optionsList = getByTestId(selector.optionsList) as HTMLElement;

  return { selectButton, optionsList, getByTestId };
};

const useCase: UseCase = {
  openListOnClick: async (selectButton) => {
    fireEvent.click(selectButton);

    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'true');
    });
  },

  openListOnKeyPress: async (selectButton, optionsList, key) => {
    fireEvent.focus(selectButton);
    fireEvent.keyDown(selectButton, { key: key });

    await waitFor(() => {
      expect(optionsList).toHaveAttribute('data-open', 'true');
    });
  },
};

// Render null

describe('DropList', () => {
  test('Should renders warning message when options are not provided', () => {
    console.warn = jest.fn();

    render(<DropList options={[]} />);

    expect(console.warn).toHaveBeenCalledWith(
      'No options were provided for the DropList.'
    );
  });

  test('Should returns null when options are not provided', () => {
    const { container } = render(<DropList options={[]} />);

    expect(container.firstChild).toBeNull();
  });
});

// Render

describe('When the Droplist component is loaded with its expected props', () => {
  test('Should be render correctly', () => {
    const { selectButton, getByTestId } = renderDropList();

    expect(selectButton).toBeInTheDocument();

    // Vérifie que les options sont affichées
    options.forEach((option, index) => {
      const optionButton = getByTestId(`option-button-${index}`);
      expect(optionButton).toBeInTheDocument();
      expect(optionButton).toHaveTextContent(option.label);
    });
  });
});

// Open List

describe('When dropList button is clicked', () => {
  test('Should open the list of options', async () => {
    const { selectButton, optionsList } = renderDropList();
    useCase.openListOnClick(selectButton, optionsList);
  });
});

describe('When the dropList button is focused and the Enter key is pressed', () => {
  test('Should open the list of options', async () => {
    const { selectButton, optionsList } = renderDropList();
    useCase.openListOnKeyPress(selectButton, optionsList, 'Enter');
  });
});

describe('When the dropList button is focused and the Escape key is pressed', () => {
  test('Should open the list of options', async () => {
    const { selectButton, optionsList } = renderDropList();
    useCase.openListOnKeyPress(selectButton, optionsList, 'Escape');
  });
});

describe('When the dropList button is focused and the ArrowUp key is pressed', () => {
  test('Should open the list of options', async () => {
    const { selectButton, optionsList } = renderDropList();
    useCase.openListOnKeyPress(selectButton, optionsList, 'ArrowUp');
  });
});

describe('When the dropList button is focused and the ArrowDown key is pressed', () => {
  test('Should open the list of options', async () => {
    const { selectButton, optionsList } = renderDropList();
    useCase.openListOnKeyPress(selectButton, optionsList, 'ArrowDown');
  });
});

// is Open

describe('When the dropList is open', () => {
  afterEach(() => {
    mockCallback.mockClear();
  });
  // Use Click
  describe('When an option is clicked', () => {
    test('Should execute the callback function', async () => {
      const { selectButton, optionsList, getByTestId } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);

      fireEvent.click(getByTestId(selector.secondOption));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalledWith(options[1].value);
      });
    });

    test('Should close the list of options', async () => {
      const { selectButton, optionsList, getByTestId } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);

      fireEvent.click(getByTestId(selector.secondOption));

      await waitFor(() => {
        expect(selectButton).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  // Choose an option and press Enter or Space keys

  describe('When user select an option and press Enter keys', () => {
    test('Should toggle the option list and call the callback function if open', async () => {
      const { selectButton, optionsList } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);

      fireEvent.keyDown(selectButton, { key: 'Enter' });

      await waitFor(() => {
        expect(selectButton).toHaveAttribute('aria-expanded', 'false');
        expect(mockCallback).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalledWith(options[0].value);
      });
    });
  });

  describe('When user select an option and press Espace keys', () => {
    test('Should toggle the option list and call the callback function if open', async () => {
      const { selectButton, optionsList } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);

      fireEvent.keyDown(selectButton, { key: 'Espace' });

      await waitFor(() => {
        expect(selectButton).toHaveAttribute('aria-expanded', 'false');
        expect(mockCallback).toHaveBeenCalled();
        expect(mockCallback).toHaveBeenCalledWith(options[0].value);
      });
    });
  });

  // Select An option and press an another keys

  describe('When a key other than the specified keys is pressed', () => {
    test('Should not modify the state', async () => {
      const { selectButton, optionsList } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);

      fireEvent.keyDown(selectButton, { key: 'SomeOtherKey' });

      await waitFor(() => {
        expect(selectButton).toHaveAttribute('aria-expanded', 'true');
        expect(mockCallback).not.toHaveBeenCalled();
      });
    });
  });

  // Use Tab for navigate for navigate on the option

  describe('When the tab key is pressed once', () => {
    test('Should focus the next option', () => {
      const { selectButton, optionsList, getByTestId } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);
      fireEvent.keyDown(selectButton, { key: 'Tab' });

      const element = getByTestId(selector.secondOption);
      expect(element).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('when the user presses the tab key once more than the number of options', () => {
    test('Should loop through the list of options and return to the first option', () => {
      const { selectButton, optionsList, getByTestId } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);

      for (let i = 0; i < options.length; i++) {
        fireEvent.keyDown(selectButton, { key: 'Tab' });
      }

      const element = getByTestId(selector.firstOptions);
      expect(element).toHaveAttribute('aria-selected', 'true');
    });
  });

  // Use shift + tab for navigate on the option

  describe('when the user presses shift + tab', () => {
    test('Should navigate to the previous option with Shift + Tab', () => {
      const { selectButton, optionsList } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);

      fireEvent.keyDown(selectButton, { key: 'Tab', shiftKey: true });

      const expectedIndex = (options.length - 1) % options.length;
      const expectedLabel = options[expectedIndex].label;

      expect(selectButton).toHaveAttribute('aria-expanded', 'true');
      expect(selectButton).toHaveTextContent(expectedLabel);
    });
  });

  // Close list

  describe('when the user presses Escape', () => {
    test('Should close the option list', () => {
      const { selectButton, optionsList } = renderDropList();
      useCase.openListOnClick(selectButton, optionsList);

      fireEvent.keyDown(selectButton, { key: 'Escape' });

      expect(selectButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('When the user clicks outside the list', () => {
    test('Should close the option list', async () => {
      const { getByTestId } = render(
        <div>
          <DropList options={options} callback={mockCallback} />
          <span data-testid='outside'> Outside the drop list </span>
        </div>
      );

      const selectButton = getByTestId(selector.select) as HTMLButtonElement;

      fireEvent.click(selectButton);

      await waitFor(() => {
        expect(selectButton).toHaveAttribute('aria-expanded', 'true');
      });

      fireEvent.click(getByTestId('outside'));

      await waitFor(() => {
        expect(selectButton).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });
});
