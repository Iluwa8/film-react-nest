import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  Repository,
} from '../repository/repository.interface';
import { Film, Schedule } from './entities/film.entity';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: Repository<Film>,
  ) {}

  async getAll(): Promise<{ total: number; items: Film[] }> {
    const films = await this.filmsRepository.findAll();
    return { total: films.length, items: films };
  }

  async getSchedule(id: string): Promise<{ total: number; items: Schedule[] }> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    return { total: film.schedule.length, items: film.schedule };
  }
}
