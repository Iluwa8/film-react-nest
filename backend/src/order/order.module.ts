import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ORDERS_REPOSITORY } from '../repository/repository.interface';
import { FilmsModule } from '../films/films.module';
import { Order, OrderSchema } from './entities/order.entity';
import { MongoOrdersRepository } from '../repository/mongo-orders.repository';

@Module({
  imports: [
    FilmsModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    { provide: ORDERS_REPOSITORY, useClass: MongoOrdersRepository },
  ],
})
export class OrderModule {}
