import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  film: string;

  @Prop({ required: true })
  session: string;

  @Prop({ required: true })
  daytime: string;

  @Prop({ required: true })
  row: number;

  @Prop({ required: true })
  seat: number;

  @Prop({ required: true })
  price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ collection: 'orders', versionKey: false, id: false })
export class Order {
  @Prop({ required: true, unique: true, index: true })
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
