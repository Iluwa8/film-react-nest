import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { Repository } from './repository.interface';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class TypeOrmOrdersRepository extends Repository<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: TypeOrmRepository<Order>,
  ) {
    super();
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderRepo.findOne({ where: { id } });
  }

  async create(data: Omit<Order, 'id'>): Promise<Order> {
    const order = this.orderRepo.create(data);
    return this.orderRepo.save(order);
  }

  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    await this.orderRepo.update(id, data);
    return this.findById(id);
  }
}
