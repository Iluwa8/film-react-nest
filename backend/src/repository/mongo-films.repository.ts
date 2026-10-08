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

  async findAll(): Promise<Film[]> {
    const docs = await this.filmModel.find().lean().exec();
    return docs as unknown as Film[];
  }

  async findById(id: string): Promise<Film | null> {
    const doc = await this.filmModel.findOne({ id }).lean().exec();
    return (doc as unknown as Film) ?? null;
  }

  async create(data: Omit<Film, 'id'>): Promise<Film> {
    const doc = await this.filmModel.create({
      ...data,
      id: randomUUID(),
    });
    return doc.toObject() as Film;
  }

  async update(id: string, data: Partial<Film>): Promise<Film | null> {
    const doc = await this.filmModel
      .findOneAndUpdate({ id }, data, { new: true })
      .lean()
      .exec();
    return (doc as unknown as Film) ?? null;
  }
}
