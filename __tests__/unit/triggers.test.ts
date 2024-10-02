import TestUtils from '../utils';
import Workflow from '../../src/types/Workflow';
import Job from '../../src/types/Job';
import Step from '../../src/types/Step';

const WORKFLOW_MOCK: Workflow['config'] = {
  name: 'test-workflow',
  on: 'push',
  jobs: [
    new Job('build', {
      runsOn: 'ubuntu-latest',
      steps: [
        new Step({
          name: 'Checkout',
          uses: 'actions/checkout@v4',
        }),
      ],
    }),
  ],
};

describe('Workflow triggers', () => {
  it('Should accept a single event', () => {
    const workflow = new Workflow('fileName', {
      ...WORKFLOW_MOCK,
      on: 'push',
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
        uses: actions/checkout@v4
`.trim() + '\n',
    );
  });

  it('Should accept multiple events', () => {
    const workflow = new Workflow('fileName', {
      ...WORKFLOW_MOCK,
      on: ['push', 'create'],
    });
    const yaml = TestUtils.convertToYaml(workflow);
    expect(yaml).toEqual(
      `
name: test-workflow
on:
  - push
  - create
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
`.trim() + '\n',
    );
  });

  it('Should accept nested values', () => {
    const workflow = new Workflow('fileName', {
      ...WORKFLOW_MOCK,
      on: {
        push: {
          branches: ['main'],
          'branches-ignore': ['feature-branch-*'],
        },
      },
    });
    const yaml = TestUtils.convertToYaml(workflow);
    expect(yaml).toEqual(
      `
name: test-workflow
on:
  push:
    branches:
      - main
    branches-ignore:
      - feature-branch-*
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
`.trim() + '\n',
    );
  });
});
