import { ExtendedWorkflowTypes } from 'github-actions-workflow-ts';
import { validateNotEmpty } from '../utils/TypescriptUtils';

type StepProps = Omit<ExtendedWorkflowTypes.Step, 'run' | 'uses'> &
  (
    | {
        uses: string;
        run?: never;
      }
    | {
        run: string | string[];
        uses?: never;
      }
  );

export default class Step {
  config: StepProps;

  constructor(config: StepProps) {
    this.config = config;

    if (config.run !== undefined) {
      if (config.uses !== undefined) {
        throw new Error('Can only use either "run" or "uses"');
      }

      this.config.run = Step.parseMultilineString(config.run);
    }
  }

  private static parseMultilineString(input: string | string[]): string {
    if (typeof input === 'string') {
      return input;
    }
    if (Array.isArray(input)) {
      return validateNotEmpty(input).join('\n');
    }
    throw new Error('Invalid value');
  }
}
