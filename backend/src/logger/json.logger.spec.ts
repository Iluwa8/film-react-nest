import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('должен форматировать log как JSON', () => {
    logger.log('test message', { userId: 1 });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const rawOutput = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(rawOutput);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('test message');
    expect(parsed.optionalParams).toEqual([{ userId: 1 }]);
  });

  it('должен форматировать error как JSON и писать в console.error', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    logger.error('critical error', 'stack trace');

    const rawOutput = consoleErrorSpy.mock.calls[0][0];
    const parsed = JSON.parse(rawOutput);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('critical error');
    expect(parsed.optionalParams).toEqual(['stack trace']);

    consoleErrorSpy.mockRestore();
  });

  it('должен корректно обрабатывать вызов без optionalParams', () => {
    logger.log('simple');

    const rawOutput = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(rawOutput);

    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('simple');
    // Если в реализации optionalParams не добавляется при пустом массиве
    expect(parsed.optionalParams).toBeUndefined();
  });

  it('должен форматировать warn, debug, verbose', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.warn('warn msg');
    logger.debug('debug msg');
    logger.verbose('verbose msg');

    expect(JSON.parse(warnSpy.mock.calls[0][0]).level).toBe('warn');
    expect(JSON.parse(debugSpy.mock.calls[0][0]).level).toBe('debug');
    expect(JSON.parse(logSpy.mock.calls[0][0]).level).toBe('verbose');

    warnSpy.mockRestore();
    debugSpy.mockRestore();
    logSpy.mockRestore();
  });
});
