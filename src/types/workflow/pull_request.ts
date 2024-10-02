/**
 * @see https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#pull_request
 */
type ActivityType =
  | 'assigned'
  | 'unassigned'
  | 'labeled'
  | 'unlabeled'
  | 'opened'
  | 'edited'
  | 'closed'
  | 'reopened'
  | 'synchronize'
  | 'converted_to_draft'
  | 'locked'
  | 'unlocked'
  | 'enqueued'
  | 'dequeued'
  | 'milestoned'
  | 'demilestoned'
  | 'ready_for_review'
  | 'review_requested'
  | 'review_request_removed'
  | 'auto_merge_enabled'
  | 'auto_merge_disabled';

type PullRequestProps = Partial<{
  types: ActivityType[];
  branches: string[];
  'branches-ignore': string[];
  paths: string[];
  'paths-ignore': string[];
}>;

export default PullRequestProps;
