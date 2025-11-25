// Simplified API types to avoid Mongoose duplication
import { Request } from 'express';

export interface IAuthRequest extends Request {
  user?: Record<string, unknown>;
}

export interface IApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error: {
    code: string;
    details?: unknown;
    stack?: string;
  };
}

export type TokenType = 'access' | 'refresh';
