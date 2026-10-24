import { HttpResponse, type HttpResponseResolver } from 'msw';
import { MockError } from './errors';
import { advanceOrders } from './orders';
import { networkCondition } from './scenarios';

export function mockResolver(resolve: HttpResponseResolver, scope: 'catalog' | 'navigation' | 'mutation' | 'control' = 'navigation'): HttpResponseResolver {
  return async (info) => {
    try {
      if (scope !== 'control') {
        const failure = await networkCondition(scope, info.request);
        if (failure) return failure;
        advanceOrders();
      }
      return await resolve(info);
    } catch (error) {
      if (error instanceof MockError) return HttpResponse.json(error.toJSON(), { status: error.status });
      if (error instanceof SyntaxError) return HttpResponse.json({ code: 'INVALID_JSON', message: 'JSON inválido.' }, { status: 400 });
      throw error;
    }
  };
}
