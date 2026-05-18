export class Entity<Props> {
  protected props: Props;

  constructor(props: Props) {
    this.props = props;
  }
}
