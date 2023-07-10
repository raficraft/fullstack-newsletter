import React from 'react';
import { render } from '@testing-library/react';
import Abstract from '../Abstract';

describe('Abstract component', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(<Abstract />);
    const components = [
      'abstract',
      'tablet',
      'browser',
      'graphic',
      'range',
      'combo',
    ];

    components.forEach((component) => {
      expect(getByTestId(component)).toBeInTheDocument();
    });
  });
});
