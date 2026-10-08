import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { Film, FilmSchema } from './entities/film.entity';
import { MongoFilmsRepository } from '../repository/mongo-films.repository';
import { FILMS_REPOSITORY } from '../repository/repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    {
      provide: FILMS_REPOSITORY,
      useClass: MongoFilmsRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class FilmsModule {}
