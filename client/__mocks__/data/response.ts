import { mockNewsletters } from './data';

export const responseApi = {
  subscribe: {
    success: mockNewsletters[0],
    exist: {
      error: 'This email is already in use',
    },
    invalid: {
      error: 'Valid email is required',
    },
  },
};
