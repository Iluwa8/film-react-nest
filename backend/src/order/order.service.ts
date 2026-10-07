import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  FILMS_REPOSITORY,
  ORDERS_REPOSITORY,
  Repository,
} from '../repository/repository.interface';
import { Film } from '../films/entities/film.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: Repository<Film>,
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const takenInRequest = new Set<string>();

    for (const ticket of dto.tickets) {
      const film = await this.filmsRepository.findById(ticket.film);
      if (!film) {
        throw new BadRequestException(`Film ${ticket.film} not found`);
      }

      const session = film.schedule.find((s) => s.id === ticket.session);
      if (!session) {
        throw new BadRequestException(
          `Session ${ticket.session} not found for film ${ticket.film}`,
        );
      }

      const seatKey = `${ticket.row}-${ticket.seat}`;
      const alreadyTaken =
        session.taken.includes(seatKey) || takenInRequest.has(seatKey);
      if (alreadyTaken) {
        throw new BadRequestException(`Seat ${seatKey} is already taken`);
      }

      takenInRequest.add(seatKey);
    }

    const items = dto.tickets.map((ticket) => {
      return {
        ...ticket,
        id: randomUUID(),
      };
    });

    const filmsToUpdate = new Map<string, Film>();

    for (const ticket of dto.tickets) {
      const film =
        filmsToUpdate.get(ticket.film) ??
        (await this.filmsRepository.findById(ticket.film))!;

      const session = film.schedule.find((s) => s.id === ticket.session)!;
      const seatKey = `${ticket.row}-${ticket.seat}`;
      if (!session.taken.includes(seatKey)) {
        session.taken.push(seatKey);
      }

      filmsToUpdate.set(ticket.film, film);
    }

    for (const film of filmsToUpdate.values()) {
      await this.filmsRepository.update(film.id, { schedule: film.schedule });
    }

    await this.ordersRepository.create({
      email: dto.email,
      phone: dto.phone,
      items,
    });

    return {
      total: items.length,
      items,
    };
  }
}
