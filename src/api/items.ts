import { authApi } from './auth';
import type { ItemResponse } from '../types/items';

export const itemsApi = {
  async getAll(): Promise<ItemResponse[]> {
    return authApi.request<ItemResponse[]>('/api/v1/items');
  },
};