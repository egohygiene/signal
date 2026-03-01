import { createFakeDataProvider } from '@egohygiene/signal/providers/FakeDataProvider';
import { http, HttpResponse } from 'msw';

const provider = createFakeDataProvider();

export const handlers = [
  http.get('/api/transactions', async () => {
    const data = await provider.getTransactions();
    return HttpResponse.json(data);
  }),
  http.get('/api/categories', async () => {
    const data = await provider.getCategories();
    return HttpResponse.json(data);
  }),
  http.get('/api/budgets', async () => {
    const data = await provider.getBudgets();
    return HttpResponse.json(data);
  }),
  http.get('/api/pools', async () => {
    const data = await provider.getPools();
    return HttpResponse.json(data);
  }),
];
