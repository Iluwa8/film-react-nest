import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;

  beforeEach(() => {
    logger = new DevLogger();
  });

  it('должен создаваться без ошибок', () => {
    expect(logger).toBeDefined();
  });

  it('должен вызывать методы логирования без исключений', () => {
    // Подавляем реальный вывод в консоль на время теста
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    expect(() => logger.log('test')).not.toThrow();
    expect(() => logger.error('error')).not.toThrow();
    expect(() => logger.warn('warn')).not.toThrow();

    logSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
