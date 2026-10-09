import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ScheduleDto {
  @Expose() id: string;
  @Expose() daytime: string;
  @Expose() hall: number;
  @Expose() rows: number;
  @Expose() seats: number;
  @Expose() price: number;
  @Expose() taken: string[];
}
