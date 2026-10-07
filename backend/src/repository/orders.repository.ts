import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Repository } from './repository.interface';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class OrdersRepository extends Repository<Order> {
  private orders: Order[] = [];

  async findAll(): Promise<Order[]> {
    return this.orders;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async create(data: Omit<Order, 'id'>): Promise<Order> {
    const order: Order = { id: randomUUID(), ...data };
    this.orders.push(order);
    return order;
  }

  async update(id: string, data: Partial<Order>): Promise<Order | null> {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return null;
    this.orders[index] = { ...this.orders[index], ...data };
    return this.orders[index];
  }
}
