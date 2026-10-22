import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column('float')
  price: number;

  @Column({
    type: 'text',
    transformer: {
      to: (v: string[] | string) => (Array.isArray(v) ? v.join(',') : v),
      from: (v: string) => (v ? v.split(',') : []),
    },
  })
  taken: string[];

  @ManyToOne(() => Film, (f) => f.schedule, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'filmId' })
  film?: Film;
}
