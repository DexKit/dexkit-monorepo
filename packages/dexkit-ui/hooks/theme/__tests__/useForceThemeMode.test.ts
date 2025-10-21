import { renderHook } from '@testing-library/react';
import { useForceThemeMode } from '../useForceThemeMode';

// Mock del DOM
const mockBody = {
  classList: {
    contains: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
  },
  getAttribute: jest.fn(),
  style: {
    backgroundColor: 'rgb(0, 0, 0)',
  },
};

Object.defineProperty(document, 'body', {
  value: mockBody,
  writable: true,
});

// Mock de window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: jest.fn(() => ({
    backgroundColor: 'rgb(0, 0, 0)',
  })),
  writable: true,
});

describe('useForceThemeMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should detect dark mode from body class', () => {
    mockBody.classList.contains.mockImplementation((className: string) => {
      return className === 'dark' || className === 'Mui-dark';
    });

    const { result } = renderHook(() => useForceThemeMode());

    expect(result.current.mode).toBe('dark');
    expect(result.current.isForced).toBe(true);
  });

  it('should detect dark mode from data-theme attribute', () => {
    mockBody.classList.contains.mockReturnValue(false);
    mockBody.getAttribute.mockImplementation((attr: string) => {
      if (attr === 'data-theme') return 'dark';
      if (attr === 'data-mui-color-scheme') return null;
      return null;
    });

    const { result } = renderHook(() => useForceThemeMode());

    expect(result.current.mode).toBe('dark');
    expect(result.current.isForced).toBe(true);
  });

  it('should detect dark mode from data-mui-color-scheme attribute', () => {
    mockBody.classList.contains.mockReturnValue(false);
    mockBody.getAttribute.mockImplementation((attr: string) => {
      if (attr === 'data-mui-color-scheme') return 'dark';
      return null;
    });

    const { result } = renderHook(() => useForceThemeMode());

    expect(result.current.mode).toBe('dark');
    expect(result.current.isForced).toBe(true);
  });

  it('should detect dark mode from computed background color', () => {
    mockBody.classList.contains.mockReturnValue(false);
    mockBody.getAttribute.mockReturnValue(null);
    mockBody.style.backgroundColor = 'rgb(0, 0, 0)';

    const { result } = renderHook(() => useForceThemeMode());

    expect(result.current.mode).toBe('dark');
    expect(result.current.isForced).toBe(true);
  });

  it('should detect light mode from body class', () => {
    mockBody.classList.contains.mockImplementation((className: string) => {
      return className === 'light' || className === 'Mui-light';
    });

    const { result } = renderHook(() => useForceThemeMode());

    expect(result.current.mode).toBe('light');
    expect(result.current.isForced).toBe(true);
  });

  it('should return original mode when no forced detection', () => {
    mockBody.classList.contains.mockReturnValue(false);
    mockBody.getAttribute.mockReturnValue(null);
    mockBody.style.backgroundColor = 'rgb(255, 255, 255)';

    const { result } = renderHook(() => useForceThemeMode());

    expect(result.current.mode).toBe('light'); // Default mode
    expect(result.current.isForced).toBe(false);
  });
});
