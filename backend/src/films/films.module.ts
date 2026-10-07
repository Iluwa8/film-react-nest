import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repository/films.repository';
import { FILMS_REPOSITORY } from '../repository/repository.interface';

@Module({
  controllers: [FilmsController],
  providers: [
    FilmsService,
    { provide: FILMS_REPOSITORY, useClass: FilmsRepository },
  ],
  exports: [FILMS_REPOSITORY], // понадобится OrderModule на шаге 3
})
export class FilmsModule {}
