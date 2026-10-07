import { TicketDto } from './ticket.dto';

export class OrderItemDto extends TicketDto {
  id: string;
}

export class OrderResponseDto {
  total: number;
  items: OrderItemDto[];
}
