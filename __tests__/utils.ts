import jsYaml from 'js-yaml';
import Workflow from '../src/types/Workflow';

export default class TestUtils {
  public static convertToYaml(workflow: Workflow): string {
    const json = TestUtils.convertWorkflowToJson(workflow);
    return jsYaml.dump(json, { noCompatMode: true });
  }

  private static convertWorkflowToJson(workflow: Workflow): object {
    const { jobs, ...rest } = workflow.config;
    return {
      ...rest,
      jobs: Object.fromEntries(jobs.map((job) => [job.id, job.convert().job])),
    };
  }
}
