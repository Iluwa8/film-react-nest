import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class FilmDto {
  @Expose() id: string;
  @Expose() rating: number;
  @Expose() director: string;
  @Expose() tags: string[];
  @Expose() title: string;
  @Expose() about: string;
  @Expose() description: string;
  @Expose() image: string;
  @Expose() cover: string;

  @Exclude() _id?: unknown;
}
