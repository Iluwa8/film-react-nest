import { Exclude, Expose, Type } from 'class-transformer';
import { ScheduleDto } from './schedule.dto';

@Exclude()
export class ScheduleListDto {
  @Expose()
  total: number;

  @Expose()
  @Type(() => ScheduleDto)
  items: ScheduleDto[];
}
