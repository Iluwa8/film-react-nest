import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { FilmsRepository } from './repository.interface';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Injectable()
export class TypeOrmFilmsRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepo: TypeOrmRepository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: TypeOrmRepository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepo.find({ relations: ['schedule'] });
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmRepo.findOne({
      where: { id },
      relations: ['schedule'],
    });
  }

  async create(data: Omit<Film, 'id'>): Promise<Film> {
    const film = this.filmRepo.create(data);
    return this.filmRepo.save(film); // cascade: true сохранит и schedule
  }

  async update(id: string, data: Partial<Film>): Promise<Film | null> {
    const film = await this.filmRepo.findOne({
      where: { id },
      relations: ['schedule'],
    });
    if (!film) return null;
    this.filmRepo.merge(film, data);
    return this.filmRepo.save(film);
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    await this.scheduleRepo
      .createQueryBuilder()
      .update(Schedule)
      .set({
        taken: () =>
          `CASE WHEN taken = '' THEN :seatKey ELSE taken || ',' || :seatKey END`,
      })
      .where('id = :sessionId', { sessionId })
      .andWhere('"filmId" = :filmId', { filmId })
      .andWhere(`NOT (:seatKey = ANY(string_to_array(taken, ',')))`)
      .setParameter('seatKey', seatKey)
      .execute();
  }
}
