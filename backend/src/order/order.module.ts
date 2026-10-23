import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ORDERS_REPOSITORY } from '../repository/repository.interface';
import { FilmsModule } from '../films/films.module';
import { Order } from './entities/order.entity';
import { TypeOrmOrdersRepository } from '../repository/typeorm-orders.repository';

@Module({
  imports: [FilmsModule, TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [
    OrderService,
    { provide: ORDERS_REPOSITORY, useClass: TypeOrmOrdersRepository },
  ],
})
export class OrderModule {}
