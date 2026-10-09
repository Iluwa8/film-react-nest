import { Film } from 'src/films/entities/film.entity';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';
export const ORDERS_REPOSITORY = 'ORDERS_REPOSITORY';

export abstract class Repository<T extends { id: string }> {
  abstract findAll(): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: Omit<T, 'id'>): Promise<T>;
  abstract update(id: string, data: Partial<T>): Promise<T | null>;
}

// Новый интерфейс — только для фильмов
export interface FilmsRepository extends Repository<Film> {
  addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void>;
}
