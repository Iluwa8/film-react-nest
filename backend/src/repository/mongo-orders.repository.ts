import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Repository } from './repository.interface';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class MongoOrdersRepository extends Repository<Order> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {
    super();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().lean<Order[]>().exec();
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderModel.findOne({ id }).lean<Order>().exec();
  }

  async create(data: Omit<Order, 'id'>): Promise<Order> {
    const doc = await this.orderModel.create({ ...data, id: randomUUID() });
    return doc.toObject<Order>();
  }

  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    return this.orderModel
      .findOneAndUpdate({ id }, data, { new: true })
      .lean<Order>()
      .exec();
  }
}
