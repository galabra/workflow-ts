import Job from '../../src/types/Job';

describe('Job initialization', () => {
  describe('"id" field', () => {
    it('Should accept a valid ID', () => {
      expect(() => new Job('foo', { steps: [] })).not.toThrow();
    });

    it('Should not accept an invalid ID', () => {
      expect(() => new Job('foo^', { steps: [] })).toThrow();
    });
  });

  describe('"needs" field', () => {
    it('Should accept a non-empty "needs" array value', () => {
      expect(() => new Job('foo', { steps: [], needs: ['bar'] })).not.toThrow();
    });

    it('Should accept a non-empty "needs" string value', () => {
      expect(() => new Job('foo', { steps: [], needs: 'bar' })).not.toThrow();
    });

    it('Should accept a missing "needs" key', () => {
      expect(() => new Job('foo', { steps: [] })).not.toThrow();
    });

    it('Should not accept an empty "needs" value', () => {
      expect(() => new Job('foo', { steps: [], needs: [] as any })).toThrow();
    });
  });
});
