import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import {
  FILMS_REPOSITORY,
  ORDERS_REPOSITORY,
  Repository,
} from '../repository/repository.interface';
import { Film } from '../films/entities/film.entity';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrderService', () => {
  let service: OrderService;
  let filmsRepository: jest.Mocked<Repository<Film>>;
  let ordersRepository: jest.Mocked<Repository<Order>>;

  const filmId = 'film-1';
  const sessionId = 'session-1';
  const daytime = '2024-06-28T10:00:53+03:00';

  const createFilm = (): Film => ({
    id: filmId,
    rating: 8,
    director: 'Test',
    tags: ['test'],
    image: '/img.jpg',
    cover: '/cov.jpg',
    title: 'Test film',
    about: 'about',
    description: 'desc',
    schedule: [
      {
        id: sessionId,
        daytime,
        hall: 0,
        rows: 5,
        seats: 10,
        price: 350,
        taken: [],
      },
    ],
  });

  const createDto = (overrides?: Partial<CreateOrderDto>): CreateOrderDto => ({
    email: 'test@test.ru',
    phone: '+7 (000) 000-00-00',
    tickets: [
      {
        film: filmId,
        session: sessionId,
        daytime,
        row: 2,
        seat: 5,
        price: 350,
      },
    ],
    ...overrides,
  });

  beforeEach(async () => {
    filmsRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest
        .fn()
        .mockImplementation(async (id: string, data: Partial<Film>) => ({
          ...createFilm(),
          ...data,
          id,
        })),
    } as unknown as jest.Mocked<Repository<Film>>;

    ordersRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest
        .fn()
        .mockImplementation(async (data: Omit<Order, 'id'>) => ({
          id: 'order-1',
          ...data,
        })),
      update: jest.fn(),
    } as unknown as jest.Mocked<Repository<Order>>;

    const module = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: FILMS_REPOSITORY, useValue: filmsRepository },
        { provide: ORDERS_REPOSITORY, useValue: ordersRepository },
      ],
    }).compile();

    service = module.get(OrderService);
  });

  it('создаёт заказ и помечает место занятым', async () => {
    const film = createFilm();
    filmsRepository.findById.mockResolvedValue(film);

    const result = await service.create(createDto());

    expect(result.total).toBe(1);
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      film: filmId,
      session: sessionId,
      row: 2,
      seat: 5,
      price: 350,
    });
    expect(result.items[0].id).toBeDefined();
    expect(film.schedule[0].taken).toContain('2:5');
    expect(filmsRepository.update).toHaveBeenCalledTimes(1);
    expect(ordersRepository.create).toHaveBeenCalledTimes(1);
  });

  it('бросает BadRequestException, если место уже занято', async () => {
    const film = createFilm();
    film.schedule[0].taken.push('2:5');
    filmsRepository.findById.mockResolvedValue(film);

    await expect(service.create(createDto())).rejects.toThrow(
      BadRequestException,
    );
    expect(filmsRepository.update).not.toHaveBeenCalled();
    expect(ordersRepository.create).not.toHaveBeenCalled();
  });

  it('бросает BadRequestException при двух одинаковых местах в одном запросе', async () => {
    const film = createFilm();
    filmsRepository.findById.mockResolvedValue(film);

    const dto = createDto({
      tickets: [
        {
          film: filmId,
          session: sessionId,
          daytime,
          row: 2,
          seat: 5,
          price: 350,
        },
        {
          film: filmId,
          session: sessionId,
          daytime,
          row: 2,
          seat: 5,
          price: 350,
        },
      ],
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(ordersRepository.create).not.toHaveBeenCalled();
  });

  it('бросает BadRequestException, если фильм не найден', async () => {
    filmsRepository.findById.mockResolvedValue(null);

    await expect(service.create(createDto())).rejects.toThrow(
      BadRequestException,
    );
    expect(ordersRepository.create).not.toHaveBeenCalled();
  });

  it('бросает BadRequestException, если сеанс не найден', async () => {
    const film = createFilm();
    filmsRepository.findById.mockResolvedValue(film);

    const dto = createDto({
      tickets: [
        {
          film: filmId,
          session: 'unknown-session',
          daytime,
          row: 2,
          seat: 5,
          price: 350,
        },
      ],
    });

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    expect(ordersRepository.create).not.toHaveBeenCalled();
  });

  it('бронирует несколько разных мест на одном сеансе', async () => {
    const film = createFilm();
    filmsRepository.findById.mockResolvedValue(film);

    const dto = createDto({
      tickets: [
        {
          film: filmId,
          session: sessionId,
          daytime,
          row: 1,
          seat: 1,
          price: 350,
        },
        {
          film: filmId,
          session: sessionId,
          daytime,
          row: 1,
          seat: 2,
          price: 350,
        },
        {
          film: filmId,
          session: sessionId,
          daytime,
          row: 3,
          seat: 7,
          price: 350,
        },
      ],
    });

    const result = await service.create(dto);

    expect(result.total).toBe(3);
    expect(film.schedule[0].taken).toEqual(
      expect.arrayContaining(['1:1', '1:2', '3:7']),
    );
    expect(filmsRepository.update).toHaveBeenCalledTimes(1);
    expect(ordersRepository.create).toHaveBeenCalledTimes(1);
  });
});
