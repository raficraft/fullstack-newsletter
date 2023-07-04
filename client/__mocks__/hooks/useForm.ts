const useFormMock = {
  validateForm: jest.fn(),
  validateField: jest.fn(),
  getFormData: jest.fn(),
  reset: jest.fn(),
  errors: {},
};

const mockFunction = () => useFormMock;

export default mockFunction;
