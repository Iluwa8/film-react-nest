import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface OrderItem {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
  id: string;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('jsonb')
  items: OrderItem[];
}
