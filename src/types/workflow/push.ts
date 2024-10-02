type PushProps = Partial<{
  branches: string[];
  'branches-ignore': string[];
  tags: string[];
  'tags-ignore': string[];
}>;

export default PushProps;
