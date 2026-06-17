import { describe, it, expect, afterEach, vi } from 'vitest';

describe('config.js', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.resetModules();
  });

  it('should load config with NODE_ENV test', async () => {
    // Arrange
    process.env.NODE_ENV = 'test';
    vi.resetModules();

    // Action
    const config = (await import('../config.js')).default;

    // Assert
    expect(config).toBeDefined();
    expect(config.app).toBeDefined();
    expect(config.database).toBeDefined();
    expect(config.auth).toBeDefined();
  });

  it('should load from .env file when NODE_ENV is development', async () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    vi.resetModules();

    // Action
    const config = (await import('../config.js')).default;

    // Assert
    expect(config).toBeDefined();
    expect(config.app.host).toBe('localhost');
    expect(config.app.debug).toEqual({ request: ['error'] });
  });

  it('should load from .env file when NODE_ENV is production', async () => {
    // Arrange
    process.env.NODE_ENV = 'production';
    vi.resetModules();

    // Action
    const config = (await import('../config.js')).default;

    // Assert
    expect(config).toBeDefined();
    expect(config.app.host).toBe('0.0.0.0');
    expect(config.app.debug).toEqual({});
  });
});
