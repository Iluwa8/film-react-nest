import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrdersRepository } from '../repository/orders.repository';
import { ORDERS_REPOSITORY } from '../repository/repository.interface';
import { FilmsModule } from '../films/films.module';

@Module({
  imports: [FilmsModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    { provide: ORDERS_REPOSITORY, useClass: OrdersRepository },
  ],
})
export class OrderModule {}
