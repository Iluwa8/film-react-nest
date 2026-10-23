import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('float')
  rating: number;

  @Column()
  director: string;

  @Column({
    type: 'text',
    transformer: {
      to: (v: string[] | string) => (Array.isArray(v) ? v.join(',') : v),
      from: (v: string) => (v ? v.split(',') : []),
    },
  })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column()
  about: string;

  @Column()
  description: string;

  @OneToMany(() => Schedule, (s) => s.film, { cascade: true })
  schedule: Schedule[];
}
