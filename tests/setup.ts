import { logger } from '../src/utils/logger';

// Setup test environment before all tests
beforeAll(async () => {
  // Silence logger during tests
  logger.silent = true;
});

// Global test utilities
declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        createTestUser: () => Promise<any>;
        getAuthToken: (userId: string) => string;
      };
    }
  }
}

// Global test utilities
declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        createTestUser: () => Promise<any>;
        getAuthToken: (userId: string) => string;
      };
    }
  }
}