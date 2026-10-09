import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  Repository,
} from '../repository/repository.interface';
import { Film } from './entities/film.entity';
import { FilmsListDto } from './dto/films-list.dto';
import { ScheduleListDto } from './dto/schedule-list.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: Repository<Film>,
  ) {}

  async getAll(): Promise<FilmsListDto> {
    const films = await this.filmsRepository.findAll();
    return {
      total: films.length,
      items: films,
    } as unknown as FilmsListDto;
  }

  async getSchedule(id: string): Promise<ScheduleListDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }
    return {
      total: film.schedule.length,
      items: film.schedule,
    } as unknown as ScheduleListDto;
  }
}
