import { debounce } from '../debounce';

describe('debounce', () => {
  jest.useFakeTimers();

  test('should debounce the callback function', () => {
    const callback = jest.fn();
    const debouncedCallback = debounce(callback, 100);

    debouncedCallback();
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    debouncedCallback();
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);

    debouncedCallback();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test('should debounce the callback function with the latest arguments', () => {
    const callback = jest.fn();
    const debouncedCallback = debounce(callback, 100);

    debouncedCallback('apple');
    debouncedCallback('banana');
    debouncedCallback('orange');

    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledWith('orange');
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
