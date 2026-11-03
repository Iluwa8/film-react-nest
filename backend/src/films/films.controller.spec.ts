import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { NotFoundException } from '@nestjs/common';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    getAll: jest.fn(),
    getSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);

    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('должен возвращать список фильмов из сервиса', async () => {
      const expectedResult = {
        total: 1,
        items: [{ id: '1', title: 'Test Film' }],
      };
      mockFilmsService.getAll.mockResolvedValue(expectedResult);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it('должен пробрасывать ошибку, если сервис упал', async () => {
      const error = new Error('Something went wrong');
      mockFilmsService.getAll.mockRejectedValue(error);

      await expect(controller.getAll()).rejects.toThrow(error);
    });
  });

  describe('getSchedule', () => {
    it('должен возвращать расписание для указанного id', async () => {
      const filmId = 'some-id';
      const expectedResult = {
        total: 2,
        items: [{ time: '10:00' }, { time: '13:00' }],
      };
      mockFilmsService.getSchedule.mockResolvedValue(expectedResult);

      const result = await controller.getSchedule(filmId);

      expect(service.getSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toEqual(expectedResult);
    });

    it('должен пробрасывать NotFoundException, если фильм не найден', async () => {
      const filmId = 'missing-id';
      mockFilmsService.getSchedule.mockRejectedValue(
        new NotFoundException(`Film with id ${filmId} not found`),
      );

      await expect(controller.getSchedule(filmId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
