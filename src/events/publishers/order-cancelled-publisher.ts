import { Publisher, OrderCancelledEvent, Subjects } from "@devneering/common";

export class OrderCreatedPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
