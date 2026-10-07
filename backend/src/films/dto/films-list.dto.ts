import { FilmDto } from './films.dto';

export class FilmsListDto {
  total: number;
  items: FilmDto[];
}
