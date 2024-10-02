import * as GenericGithubActions from 'github-actions-workflow-ts';

import PullRequestProps from '../types/workflow/pull_request';
import PushProps from '../types/workflow/push';
import { NonEmptyArray, Replace } from '../utils/TypescriptUtils';
import Job from '../types/Job';

type GenericWorkflow = GenericGithubActions.GeneratedWorkflowTypes.Workflow;
type GenericEvent = GenericGithubActions.GeneratedWorkflowTypes.Event;

interface SpecificTriggerValues {
  push: PushProps;
  pull_request: PullRequestProps;
  pull_request_target: PullRequestProps;
  schedule: NonEmptyArray<{ cron: string }>;
}

/**
 * Trigger can be a simple event, an array of events or a compound type.
 * This type separates the compound type by excluding the simpler cases.
 */
type CompoundTrigger = Exclude<
  GenericWorkflow['on'],
  GenericEvent | GenericEvent[]
>;

interface SpecificWorkflowProps {
  name: string;
  on:
    | Replace<CompoundTrigger, Partial<SpecificTriggerValues>>
    | GenericGithubActions.GeneratedWorkflowTypes.Event
    | NonEmptyArray<GenericEvent>;
  jobs: [Job, ...Job[]];
}

export default class Workflow extends GenericGithubActions.Workflow {
  config: Replace<GenericWorkflow, SpecificWorkflowProps>;

  constructor(
    fileName: string,
    config: Replace<GenericWorkflow, SpecificWorkflowProps>,
  ) {
    const { jobs, ...rest } = config;
    super(fileName, rest);

    Workflow.validateJobsIds(jobs);
    this.config = config;

    super.addJobs(jobs.map((job) => job.convert()));
  }

  private static validateJobsIds(jobs: SpecificWorkflowProps['jobs']): void {
    const jobsIds = jobs.map((job) => job.id);

    const isValid = jobs.every((job) => {
      const dependentJobsIds = job.config.needs ?? [];
      if (typeof dependentJobsIds === 'string') {
        return jobsIds.includes(dependentJobsIds);
      }
      return dependentJobsIds.every((jobId) => jobsIds.includes(jobId));
    });

    if (!isValid) {
      throw new Error('"needs" values should only include existing jobs\' IDs');
    }
  }
}
