# workflow-ts

Simply typed classes, for modular workflows management and governance.

## Quick Start

1. Run `npm install --save-dev workflow-ts`
2. Convert your YAML workflow files into TypeScript files by running `npx convert-workflows`
3. Build your workflow YAML files as part of your build process, as described [here](https://github.com/emmanuelnk/github-actions-workflow-ts?tab=readme-ov-file#using-the-cli)


## Motivation

**YAML configurations are an absolute nightmare to maintain.**

Seriously, though. Managing logic in key/value structures doesn't make any sense.<br/>
It forces us to:

🤢 Duplicate logic across repositories<br />
😖 Reinvent the wheel - although actions are (kinda) standardized, jobs and workflows have similar structure. Yet, thry're still rewritten for each repository<br/>
😵‍💫 Guess types (is `[push]` a string or an array?)<br/>
🥴 Push code just to test whether the workflow is valid

Using code to define our workflows, we can avoid this turmoil :)

## Example

Let's consider we have the following workflow YAML file:
```yaml
# my-repository/.github/workflows/unit-tests-commit.yml

name: Run unit tests on every commit
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

  test:
    name: Run tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install
      - run: npm run test
```

In order to reuse this in another project, we need to duplicate the file.<br/>
But what if we also want to change something?

For example, let's say in the other project the tests should only run on the `main` and `dev` branches.

### 1. Generating the TypeScript workflow file
By running `npx convert-workflows` we'll generate the following file:
```typescript
// my-monorepo/first-project/src/workflows/unit-tests-commit.wac.ts

import { Workflow, Job, Step } from 'workflow-ts';

export const workflow = new Workflow('test-workflow', {
  name: 'Run tests',
  on: 'push',
  jobs: [
    new Job('build', {
      runsOn: 'ubuntu-latest',
      steps: [
        new Step({ uses: 'actions/checkout@v4' }),
      ],
    }),
    new Job('test', {
      name: 'Run tests',
      runsOn: 'ubuntu-latest',
      steps: [
        new Step({ uses: 'actions/checkout@v4' }),
        new Step({ run: 'npm install' }),
        new Step({ run: 'npm run test' }),
      ],
    }),
  ],
});

```

Now we can treat it as any other code we maintain, create a builder function, reuse it, etc.

### 2. Abstracting the workflow

Let's create a builder function:
```typescript
// my-monorepo/common/workflowUtils.ts

import { Workflow, Job, Step } from 'workflow-ts';

export function buildWorkflow(
  triggeringBranches?: string[]
): Workflow {
  const onValue = triggeringBranches === undefined
    ? 'push'
    : { push: { branches: triggeringBranches } };

  return new Workflow('test-workflow', {
    name: 'Run tests',
    on: onValue,
    jobs: [
      /// Same as before
    ],
  });
}
```

### 3. Reuse workflow in other project

We can call the function to generate our workflow:

```typescript
// my-monorepo/second-project/src/workflows/unit-tests-commit.wac.ts

import { buildWorkflow } from '../../../common/workflowUtils';

const workflow = buildWorkflow(['main', 'dev']);
export workflow;
```

### 4. Generate the YAML files

In order for the workflows to actually run, we only need to have the YAML files before we push the code.</br>
This is done by running emmanuelnk/github-actions-workflow-ts' script: `npx generate-workflow-files build`.