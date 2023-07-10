import React, { ReactElement } from 'react';
import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});
