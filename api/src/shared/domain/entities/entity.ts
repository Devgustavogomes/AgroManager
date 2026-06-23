export class Entity<Props> {
  protected props: Props;

  protected domainEvents = [];

  protected constructor(props: Props) {
    this.props = props;
  }

  public getDomainEvents() {
    return this.domainEvents;
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
