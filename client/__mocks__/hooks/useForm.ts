const useFormMock = {
  validateField: jest.fn(),
  validateForm: jest.fn(),
  getFormData: jest.fn(),
  reset: jest.fn(),
  errors: {},
};

jest.mock('@hooks/index', () => ({
  __esModule: true,
  useForm: () => useFormMock,
}));
