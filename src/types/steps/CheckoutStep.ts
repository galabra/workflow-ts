import Step from '../../types/Step';

const LATEST_VERSION = 4;

type Config = Partial<{
  name: string;
  version: number;
}>;

export default class CheckoutStep extends Step {
  constructor({ name, version = LATEST_VERSION }: Config = {}) {
    const label = `actions/checkout@v${version}`;
    super({ name, uses: label });
  }
}
