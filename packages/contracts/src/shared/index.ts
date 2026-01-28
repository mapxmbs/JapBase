/**
 * @package @japbase/contracts
 * @module shared
 * 
 * Tipos e utilitários compartilhados entre todos os sistemas.
 */

/**
 * Status genérico de resposta de API
 */
export type ApiStatus = 'success' | 'error' | 'loading';

/**
 * Resposta padrão de erro de API
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Resposta padrão de sucesso de API
 */
export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Resposta genérica de API
 */
export type ApiResponse<T> = ApiSuccess<T> | { error: ApiError };
