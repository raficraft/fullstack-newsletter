import * as zustand from 'zustand';

// Mock the entire zustand module
jest.mock('zustand');

// You can replace these values as per your needs
const mockData = [''];
const mockErrorApi = '';
const mockLoading = false;
const mockFilterRequest = '';
const mockCurrentActiveElement = null;
const mockCurrentAction = null;

// Mocking the store
const useStoreMock = zustand.create as jest.Mock;

useStoreMock.mockImplementation(() => ({
  data: mockData,
  errorApi: mockErrorApi,
  loading: mockLoading,
  filterRequest: mockFilterRequest,
  currentActiveElement: mockCurrentActiveElement,
  currentAction: mockCurrentAction,
  handleRequest: jest.fn(),
  registered: jest.fn(),
  subscribe: jest.fn(),
  deleteSubscribe: jest.fn(),
  toggleSubscribe: jest.fn(),
  editSubscribe: jest.fn(),
  filterData: jest.fn(),
  searchSubscriber: jest.fn(),
  createReqOptions: jest.fn(),
  setFilterRequest: jest.fn(),
  setData: jest.fn(),
  setErrorApi: jest.fn(),
}));
