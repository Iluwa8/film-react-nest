import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Repository } from './repository.interface';
import { Film } from '../films/entities/film.entity';

@Injectable()
export class MongoFilmsRepository extends Repository<Film> {
  constructor(
    @InjectModel(Film.name)
    private readonly filmModel: Model<Film>,
  ) {
    super();
  }

  async addTakenSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $addToSet: { 'schedule.$.taken': seatKey } },
    );
  }

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().select('-_id').lean<Film[]>().exec();
  }

  async findById(id: string): Promise<Film | null> {
    return this.filmModel.findOne({ id }).select('-_id').lean<Film>().exec();
  }

  async create(data: Omit<Film, 'id'>): Promise<Film> {
    const doc = await this.filmModel.create({ ...data, id: randomUUID() });
    return doc.toObject<Film>();
  }

  async update(id: string, data: Partial<Film>): Promise<Film | null> {
    return this.filmModel
      .findOneAndUpdate({ id }, data, { new: true })
      .select('-_id')
      .lean<Film>()
      .exec();
  }
}
