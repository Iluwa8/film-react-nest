import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsListDto } from './dto/films-list.dto';
import { ScheduleListDto } from './dto/schedule-list.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  getAll(): Promise<FilmsListDto> {
    return this.filmsService.getAll();
  }

  @Get(':id/schedule')
  getSchedule(@Param('id') id: string): Promise<ScheduleListDto> {
    return this.filmsService.getSchedule(id);
  }
}
