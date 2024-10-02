import Job from '../../types/Job';
import Step from '../../types/Step';
import CheckoutStep from '../../types/steps/CheckoutStep';

export default class RunTestsJob extends Job {
  constructor() {
    super('test', {
      name: 'Run tests',
      steps: [
        new CheckoutStep(),
        new Step({ run: 'npm install' }),
        new Step({ run: 'npm run test' }),
      ],
    });
  }
}
