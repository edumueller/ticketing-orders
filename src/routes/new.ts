import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  BadRequestError,
} from "@devneering/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the DB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure the ticket is not already reserved
    const reservation = await ticket.isReserved();
    if (reservation) {
      throw new BadRequestError("Ticket is not available");
    }

    // Calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order referencing the ticket and save it
    const order = Order.build({
      status: OrderStatus.Created,
      userId: req.currentUser!.id,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an event saying an order was created
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
