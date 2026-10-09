import { Exclude, Expose, Type } from 'class-transformer';
import { FilmDto } from './films.dto';

@Exclude()
export class FilmsListDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => FilmDto)
  items: FilmDto[];
}
