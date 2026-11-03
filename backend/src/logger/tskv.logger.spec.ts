import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('должен форматировать запись в TSKV с табуляцией', () => {
    logger.log('user login', { userId: 42, role: 'admin' });

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    const line: string = consoleLogSpy.mock.calls[0][0];

    // Поля разделены табуляцией
    expect(line).toContain('\t');

    const fields = line.split('\t');
    const fieldMap = Object.fromEntries(
      fields.map((field) => {
        const [key, ...rest] = field.split('=');
        return [key, rest.join('=')];
      }),
    );

    expect(fieldMap.level).toBe('log');
    expect(fieldMap.message).toBe('user login');
    expect(fieldMap.userId).toBe('42');
    expect(fieldMap.role).toBe('admin');
  });

  it('должен приводить числовые значения к строкам', () => {
    logger.log('test', { count: 123, active: true });

    const line: string = consoleLogSpy.mock.calls[0][0];
    const fields = line.split('\t');
    const fieldMap = Object.fromEntries(
      fields.map((field) => {
        const [key, ...rest] = field.split('=');
        return [key, rest.join('=')];
      }),
    );

    expect(fieldMap.count).toBe('123');
    expect(fieldMap.active).toBe('true');
  });

  it('должен корректно обрабатывать вызов без optionalParams', () => {
    logger.log('simple message');

    const line: string = consoleLogSpy.mock.calls[0][0];
    const fields = line.split('\t');

    expect(fields.length).toBeGreaterThanOrEqual(2);
    expect(line).toContain('level=log');
    expect(line).toContain('message=simple message');
  });

  it('должен писать error в console.error', () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    logger.error('critical');

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    const line: string = consoleErrorSpy.mock.calls[0][0];
    expect(line).toContain('level=error');
    expect(line).toContain('message=critical');

    consoleErrorSpy.mockRestore();
  });
});
