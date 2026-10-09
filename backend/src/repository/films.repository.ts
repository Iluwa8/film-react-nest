import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Repository } from './repository.interface';
import { Film } from '../films/entities/film.entity';

@Injectable()
export class FilmsRepository extends Repository<Film> implements OnModuleInit {
  private films: Film[] = [];

  async onModuleInit(): Promise<void> {
    const filePath = path.join(
      process.cwd(),
      'test',
      'mongodb_initial_stub.json',
    );
    const raw = fs.readFileSync(filePath, 'utf-8');
    this.films = JSON.parse(raw);
  }

  async findAll(): Promise<Film[]> {
    return this.films;
  }

  async findById(id: string): Promise<Film | null> {
    return this.films.find((film) => film.id === id) ?? null;
  }

  async create(data: Omit<Film, 'id'>): Promise<Film> {
    const film: Film = { id: randomUUID(), ...data };
    this.films.push(film);
    return film;
  }

  async update(id: string, data: Partial<Film>): Promise<Film | null> {
    const index = this.films.findIndex((film) => film.id === id);
    if (index === -1) {
      return null;
    }
    this.films[index] = { ...this.films[index], ...data };
    return this.films[index];
  }
}
