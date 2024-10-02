import JsonConversionUtils from '../../src/utils/JsonConversionUtils';

describe('Convert JSON to Typescript', () => {
  it('Input must have a "jobs" value', () => {
    expect(() =>
      JsonConversionUtils.convertJsonToTypescript('file-name', {
        on: 'push',
      }),
    ).toThrow();
  });

  it('Input\'s "jobs" value must be an object', () => {
    expect(() =>
      JsonConversionUtils.convertJsonToTypescript('file-name', {
        on: 'push',
        jobs: 1,
      }),
    ).toThrow();
  });

  it('Input must have an "on" value', () => {
    expect(() =>
      JsonConversionUtils.convertJsonToTypescript('file-name', { jobs: {} }),
    ).toThrow();
  });
});
