#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-expressions */

import yargs from 'yargs';
import convertWorkflowsToWacFiles from './scripts/convert-workflows';

yargs
  .scriptName('workflow-ts')
  .usage(
    '$0 [outputDir]',
    'Converts YAML files into dynamic TypeScript workflow classes',
    (yargs) => {
      return yargs.positional('outputDir', {
        describe: 'The path to the generated workflows directory',
        type: 'string',
        default: './src/workflows',
      });
    },
    (argv) => {
      const targetWokflowsDir = argv['outputDir'] as string;
      convertWorkflowsToWacFiles(targetWokflowsDir);
    },
  )
  .help().argv;
