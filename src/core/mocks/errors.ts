import type { ApiError } from '@/core/entities/marketplace.entity';

export class MockError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) { super(message); }
  toJSON(): ApiError {
    return { code: this.code, message: this.message, ...(this.fields ? { fields: this.fields } : {}) };
  }
}
export function invalid(fields: Record<string, string>): never {
  throw new MockError(422, 'VALIDATION_ERROR', 'Confira os campos informados.', fields);
}
export function missing(): never {
  throw new MockError(404, 'NOT_FOUND', 'Recurso não encontrado.');
}
export function objectInput(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid({ body: 'Objeto JSON obrigatório.' });
  return value as Record<string, unknown>;
}
export function text(value: unknown, field: string, max = 120): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) invalid({ [field]: `Informe um texto de até ${max} caracteres.` });
  return value.trim();
}
export function emailInput(value: unknown): string {
  const email = text(value, 'email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) invalid({ email: 'E-mail inválido.' });
  return email;
}
export function passwordInput(value: unknown, confirmation?: unknown): string {
  if (typeof value !== 'string' || value.length < 8 || value.length > 128 || !/[a-z]/i.test(value) || !/\d/.test(value)) invalid({ password: 'Use de 8 a 128 caracteres com letra e número.' });
  if (confirmation !== value) invalid({ confirmPassword: 'As senhas devem coincidir.' });
  return value;
}
