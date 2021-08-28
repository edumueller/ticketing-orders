import { Subjects, Publisher, OrderCancelledEvent } from '@devneering/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
