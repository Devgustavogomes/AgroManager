import { Optional } from 'src/shared/application/types/optional';

interface NotificationProps {
  notificationId: string;
  event: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

export class Notification {
  protected props: NotificationProps;

  private constructor(props: NotificationProps) {
    this.props = props;
  }

  public static create(
    props: Optional<
      NotificationProps,
      'notificationId' | 'read' | 'createdAt' | 'updatedAt'
    >,
  ) {
    return new Notification({
      ...props,
      notificationId: props.notificationId ?? 'non-registered',
      read: props.read ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    });
  }

  public readNotification() {
    this.props.read = true;
    this.props.updatedAt = new Date();
  }

  get notificationId() {
    return this.props.notificationId;
  }

  get event() {
    return this.props.event;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get read() {
    return this.props.read;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
