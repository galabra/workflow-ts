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

