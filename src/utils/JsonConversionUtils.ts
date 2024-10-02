export default class JsonConversionUtils {
  public static convertJsonToTypescript(
    fileName: string,
    input: object,
  ): string {
    if (!('jobs' in input)) {
      throw new Error('A workflow must contain jobs');
    }

    if (!('on' in input)) {
      throw new Error('A workflow must have a trigger');
    }

    const { jobs, ...rest } = input;

    if (typeof jobs !== 'object') {
      throw new Error('"jobs" must be an object');
    }
    const parsedJobs = this.convertJobs(jobs);

    const nameRow =
      'name' in rest
        ? this.getIndentation(1) + `name: ${JSON.stringify(rest.name)},\n`
        : '';
    const onRow = this.getIndentation(1) + `on: ${JSON.stringify(rest.on)},`;

    return `
import { Workflow, Job, Step } from 'workflow-ts';

export const workflow = new Workflow('${fileName}', {
${nameRow}${onRow}
  jobs: [
${parsedJobs}
  ],
});
`.trim();
  }

  private static convertJobs(jobs: object): string {
    const jobKeysMapping = {
      'runs-on': 'runsOn',
    };
    const jobsIndentation = this.getIndentation(2);

    return Object.entries(jobs)
      .map(([jobId, _jobObject]) => {
        const jobObject = Object.fromEntries(
          Object.entries(_jobObject).map(([key, value]) => [
            jobKeysMapping[key] ?? key,
            value,
          ]),
        );

        if ('steps' in jobObject) {
          const { steps, ...jobKeys } = jobObject;
          const jobKeysIndentation = this.getIndentation(3);
          const stepsIndentation = this.getIndentation(4);

          const parsedSteps = steps
            .map(
              (stepObject) =>
                stepsIndentation + `new Step(${JSON.stringify(stepObject)})`,
            )
            .join(',\n');
          const nonStepsEntries = Object.entries(jobKeys);
          const nonStepsEntriesAsString =
            nonStepsEntries.length === 0
              ? ''
              : Object.entries(jobKeys)
                  .map(([key, value]) => `"${key}": ${JSON.stringify(value)}`)
                  .join(`,\n${jobKeysIndentation}`) +
                `,\n${jobKeysIndentation}`;
          return `${jobsIndentation}new Job('${jobId}', {\n${jobKeysIndentation}${nonStepsEntriesAsString}"steps": [\n${parsedSteps}\n${jobKeysIndentation}]\n${jobsIndentation}})`;
        }

        return `new Job('${jobId}', ${JSON.stringify(jobObject)})`;
      })
      .join(',\n');
  }

  private static getIndentation(depth: number): string {
    return Array(depth).fill('  ').join('');
  }
}
