import { Publisher, OrderCreatedEvent, Subjects } from '@devneering/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
