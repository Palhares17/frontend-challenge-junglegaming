import { isAxiosError } from 'axios';
import type { ApiError } from '@/core/entities/marketplace.entity';

export function apiError(error: unknown): ApiError {
  if (isAxiosError<ApiError>(error) && error.response?.data?.message)
    return error.response.data;
  return {
    code: 'NETWORK_ERROR',
    message:
      'Não foi possível concluir. Verifique sua conexão e tente novamente.',
  };
}

export function formValues(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries()) as Record<
    string,
    string
  >;
}
