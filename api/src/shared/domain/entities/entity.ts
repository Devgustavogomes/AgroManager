export class Entity<Props, EventData = unknown> {
  protected props: Props;

  protected domainEvents: { event: string; data: EventData }[] = [];

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
