import Workflow from '../../src/types/Workflow';
import Job from '../../src/types/Job';
import Step from '../../src/types/Step';

const JOB_CONFIG_MOCK = {
  runsOn: 'ubuntu-latest',
  steps: [
    new Step({
      name: 'Checkout',
      uses: 'actions/checkout@v4',
    }),
  ],
};
const WORKFLOW_MOCK: Workflow['config'] = {
  name: 'test-workflow',
  on: 'push',
  jobs: [new Job('build', JOB_CONFIG_MOCK)],
};

describe('Workflow initialization', () => {
  describe('Jobs "needs" different values should refer to actual jobs IDs', () => {
    it('Should work when a single ID exists', () => {
      expect(
        () =>
          new Workflow('fileName', {
            ...WORKFLOW_MOCK,
            jobs: [
              ...WORKFLOW_MOCK.jobs,
              new Job('second', { ...JOB_CONFIG_MOCK, needs: 'build' }),
            ],
          }),
      ).not.toThrow();
    });

    it('Should work when a single ID in array exists', () => {
      expect(
        () =>
          new Workflow('fileName', {
            ...WORKFLOW_MOCK,
            jobs: [
              ...WORKFLOW_MOCK.jobs,
              new Job('second', { ...JOB_CONFIG_MOCK, needs: ['build'] }),
            ],
          }),
      ).not.toThrow();
    });

    it('Should work when all IDs in array exist', () => {
      expect(
        () =>
          new Workflow('fileName', {
            ...WORKFLOW_MOCK,
            jobs: [
              ...WORKFLOW_MOCK.jobs,
              new Job('second', { ...JOB_CONFIG_MOCK, needs: ['build'] }),
              new Job('third', {
                ...JOB_CONFIG_MOCK,
                needs: ['build', 'second'],
              }),
            ],
          }),
      ).not.toThrow();
    });

    it('Should work when the "needs" field isn\'t used', () => {
      expect(
        () =>
          new Workflow('fileName', {
            ...WORKFLOW_MOCK,
            jobs: [...WORKFLOW_MOCK.jobs, new Job('second', JOB_CONFIG_MOCK)],
          }),
      ).not.toThrow();
    });

    it("Should throw an error when a single ID doesn't exist", () => {
      expect(
        () =>
          new Workflow('fileName', {
            ...WORKFLOW_MOCK,
            jobs: [
              ...WORKFLOW_MOCK.jobs,
              new Job('second', { ...JOB_CONFIG_MOCK, needs: 'foo' }),
            ],
          }),
      ).toThrow();
    });

    it("Should throw an error when a single ID in array doesn't exist", () => {
      expect(
        () =>
          new Workflow('fileName', {
            ...WORKFLOW_MOCK,
            jobs: [
              ...WORKFLOW_MOCK.jobs,
              new Job('second', { ...JOB_CONFIG_MOCK, needs: ['foo'] }),
            ],
          }),
      ).toThrow();
    });

    it("Should throw an error when one of the IDs in array doesn't exist", () => {
      expect(
        () =>
          new Workflow('fileName', {
            ...WORKFLOW_MOCK,
            jobs: [
              ...WORKFLOW_MOCK.jobs,
              new Job('second', {
                ...JOB_CONFIG_MOCK,
                needs: ['build', 'foo'],
              }),
            ],
          }),
      ).toThrow();
    });
  });
});
