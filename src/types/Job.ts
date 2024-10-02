import { GeneratedWorkflowTypes, NormalJob } from 'github-actions-workflow-ts';
import {
  NonEmptyArray,
  Replace,
  validateNotEmpty,
} from '../utils/TypescriptUtils';
import Step from '../types/Step';

type JobId = string;

interface SpecificJobProps {
  steps: Step[];
  name?: string;
  permissions?: GeneratedWorkflowTypes.NormalJob['permissions'];
  needs?: JobId | NonEmptyArray<JobId>;
  runsOn?: string;
}

type JobProps = Replace<
  Omit<GeneratedWorkflowTypes.NormalJob, 'runs-on'>,
  SpecificJobProps
>;

const DEFAULT_JOB_CONFIG: Partial<JobProps> = {
  runsOn: 'ubuntu-latest',
};

export default class Job {
  id: JobId;
  config: JobProps;

  constructor(
    id: JobId,
    config: Replace<JobProps, { needs?: JobId | JobId[] }>,
  ) {
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      throw new Error(
        'Invalid Job ID format. See https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_id',
      );
    }

    this.id = id;
    this.config = {
      ...DEFAULT_JOB_CONFIG,
      ...config,
      needs: Job.validateNeedsField(config.needs),
    };
  }

  public convert(): NormalJob {
    const { name, runsOn, steps, ...config } = this.config;
    const parsedJob: NormalJob['job'] = {
      name,
      'runs-on': runsOn,
      ...config,
      steps: steps.map(
        (step) => step.config,
      ) as unknown as NormalJob['job']['steps'],
    };

    return new NormalJob(this.id, parsedJob);
  }

  private static validateNeedsField(input: unknown): JobProps['needs'] {
    if (input === undefined || typeof input === 'string') {
      return input as string | undefined;
    }
    return validateNotEmpty(input);
  }
}
