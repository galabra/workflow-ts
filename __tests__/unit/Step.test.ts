import Step from '../../src/types/Step';
import Workflow from '../../src/types/Workflow';
import Job from '../../src/types/Job';
import TestUtils from '../utils';

describe('Step initialization', () => {
  describe('Should handle "run" field', () => {
    it('Should support "run" command as a string', () => {
      const step = new Step({
        run: 'echo foo',
      });
      expect(step.config.run).toEqual('echo foo');
    });

    it('Should support "run" command as an array of strings', () => {
      const step = new Step({
        run: ['echo foo', 'echo bar'],
      });
      expect(step.config.run).toEqual('echo foo\necho bar');
    });

    it('Should support no "run" field', () => {
      const step = new Step({ uses: '' });
      expect(step.config.run).toBeUndefined();
    });

    it('Should throw an error when "run" field is an empty array', () => {
      expect(() => new Step({ run: [] })).toThrow();
    });

    it('Should throw an error when "run" field is invalid', () => {
      expect(() => new Step({ run: 1 } as any)).toThrow();
    });

    it('Should throw an error when both "run" and "uses" fields are present', () => {
      expect(() => new Step({ run: '', uses: '' } as any)).toThrow();
    });
  });

  it('Should convert to YAML', () => {
    const workflow = new Workflow('file-name', {
      name: 'test-workflow',
      on: 'push',
      jobs: [
        new Job('build', {
          runsOn: 'ubuntu-latest',
          steps: [
            new Step({
              name: 'Checkout',
              run: ['echo first', 'echo second'],
            }),
          ],
        }),
      ],
    });

    const yaml = TestUtils.convertToYaml(workflow);
    expect(yaml).toEqual(
      `
name: test-workflow
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        run: |-
          echo first
          echo second
`.trim() + '\n',
    );
  });
});
