//TODO реализовать DTO для /orders
import { OrderItemDto } from '../dto/order-response.dto';

export class Order {
  id: string;
  email: string;
  phone: string;
  items: OrderItemDto[];
}
