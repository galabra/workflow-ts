import { validateNotEmpty } from '../../src/utils/TypescriptUtils';

describe('TypeScript utility functions', () => {
  describe('validateNotEmpty', () => {
    it('Should validate a non-empty array', () => {
      const response = validateNotEmpty(['a']);
      expect(response).toEqual(['a']);
    });

    it('Should validate a non-empty array of different types', () => {
      const response = validateNotEmpty(['a', 1]);
      expect(response).toEqual(['a', 1]);
    });

    it('When array is empty, should throw an error', () => {
      expect(() => validateNotEmpty([])).toThrow();
    });

    it('When input is not an array, should throw an error', () => {
      expect(() => validateNotEmpty(1)).toThrow();
    });
  });
});
